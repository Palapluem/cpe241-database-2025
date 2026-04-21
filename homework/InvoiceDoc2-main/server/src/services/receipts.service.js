import { pool } from "../db/pool.js";

// Helper to format 2 decimal places
const round2 = (num) => Math.round(Number(num) * 100) / 100;

export async function listReceipts({
  search = "",
  page = 1,
  limit = 10,
  sortBy = "receipt_date",
  sortDir = "desc",
} = {}) {
  const offset = (Number(page) - 1) * Number(limit);
  const allowedSort = ["receipt_no", "customer_name", "receipt_date", "total_received"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "receipt_date";
  const sortDirection = sortDir === "asc" ? "ASC" : "DESC";
  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `SELECT COUNT(*) as total 
     FROM receipt r 
     JOIN customer c ON c.id = r.customer_id 
     WHERE r.receipt_no ILIKE $1 OR c.name ILIKE $1`,
    [searchParam]
  );
  const total = Number(countResult.rows[0].total);

  const { rows } = await pool.query(
    `SELECT r.id, r.receipt_no, r.receipt_date, r.total_received, r.payment_method, 
            c.code as customer_code, c.name as customer_name
     FROM receipt r
     JOIN customer c ON c.id = r.customer_id
     WHERE r.receipt_no ILIKE $1 OR c.name ILIKE $1
     ORDER BY ${sortColumn} ${sortDirection} NULLS LAST, r.id DESC
     LIMIT $2 OFFSET $3`,
    [searchParam, Number(limit), offset]
  );

  return {
    data: rows,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  };
}

async function resolveReceiptId(receipt_no) {
  const r = await pool.query("SELECT id FROM receipt WHERE receipt_no = $1", [receipt_no]);
  return r.rowCount > 0 ? r.rows[0].id : null;
}

export async function getReceipt(idOrReceiptNo) {
  let id = idOrReceiptNo;
  if (typeof idOrReceiptNo === "string" && String(idOrReceiptNo).trim() !== "" && isNaN(Number(idOrReceiptNo))) {
    id = await resolveReceiptId(String(idOrReceiptNo).trim());
    if (id == null) return null;
  } else {
    id = Number(idOrReceiptNo);
  }

  const header = await pool.query(
    `SELECT r.id, r.receipt_no, r.receipt_date, r.customer_id, r.payment_method, 
            r.payment_notes, r.total_received, r.created_at,
            c.code as customer_code, c.name as customer_name, c.address_line1, c.address_line2
     FROM receipt r
     JOIN customer c ON c.id = r.customer_id
     WHERE r.id = $1`,
    [id]
  );

  if (header.rowCount === 0) return null;

  // Amount Already Received must EXCULD the current receipt
  const lines = await pool.query(
    `SELECT rli.id as line_id, i.id as invoice_id, i.invoice_no, i.amount_due as full_amount_due,
            COALESCE((SELECT SUM(amount_received) FROM receipt_line_item WHERE invoice_id = i.id AND receipt_id != $1), 0.00) as amount_already_received,
            rli.amount_received as amount_received_here
     FROM receipt_line_item rli
     JOIN invoice i ON i.id = rli.invoice_id
     WHERE rli.receipt_id = $1
     ORDER BY rli.id`,
    [id]
  );

  const enrichedLines = lines.rows.map(li => {
    const fullAmountDue = Number(li.full_amount_due);
    const amountAlreadyReceived = Number(li.amount_already_received);
    const amountReceivedHere = Number(li.amount_received_here);
    const amountRemaining = round2(fullAmountDue - amountAlreadyReceived);
    const amountStillRemaining = round2(amountRemaining - amountReceivedHere);

    return {
      ...li,
      full_amount_due: fullAmountDue,
      amount_already_received: amountAlreadyReceived,
      amount_received_here: amountReceivedHere,
      amount_remaining: amountRemaining,
      amount_still_remaining: amountStillRemaining
    };
  });

  return { header: header.rows[0], line_items: enrichedLines };
}

// Get Invoices for the receipt line item List Of Values (LoV)
export async function getUnpaidInvoices(customerCode, excludeReceiptId = null) {
  const cust = await pool.query("SELECT id FROM customer WHERE code = $1", [customerCode]);
  if (cust.rowCount === 0) throw new Error(`Customer not found: ${customerCode}`);
  const customerId = cust.rows[0].id;

  // We use our invoice_received_view but adjust logic:
  // If excluding a receipt, we must recalculate "amount_already_received" dynamically
  const query = `
    SELECT v.invoice_id, v.invoice_no, v.amount_due as full_amount_due, 
           COALESCE((SELECT SUM(amount_received) FROM receipt_line_item WHERE invoice_id = v.invoice_id AND ($2::int IS NULL OR receipt_id != $2::int)), 0.00) as amount_already_received
    FROM invoice_received_view v
    WHERE v.customer_id = $1 
      AND (
        (v.amount_due - COALESCE((SELECT SUM(amount_received) FROM receipt_line_item WHERE invoice_id = v.invoice_id AND ($2::int IS NULL OR receipt_id != $2::int)), 0.00)) > 0
        OR v.invoice_id IN (SELECT invoice_id FROM receipt_line_item WHERE receipt_id = $2::int)
      )
    ORDER BY v.invoice_no ASC
  `;
  const res = await pool.query(query, [customerId, excludeReceiptId || null]);
  
  return res.rows.map(r => {
    const fullAmountDue = Number(r.full_amount_due);
    const amountAlreadyReceived = Number(r.amount_already_received);
    return {
      invoice_id: Number(r.invoice_id),
      invoice_no: r.invoice_no,
      full_amount_due: fullAmountDue,
      amount_already_received: amountAlreadyReceived,
      amount_remaining: round2(fullAmountDue - amountAlreadyReceived)
    };
  });
}

export async function createReceipt({ receipt_date, customer_code, payment_method, payment_notes, line_items }) {
  const client = await pool.connect();
  try {
    await client.query("begin");

    const code = customer_code != null ? String(customer_code).trim() : "";
    const cust = await client.query("SELECT id FROM customer WHERE code = $1", [code]);
    if (cust.rowCount === 0) throw new Error(`Customer not found: ${code}`);
    const customer_id = cust.rows[0].id;

    // Generate RCTYY-XXXXX
    const maxRes = await client.query("SELECT MAX(id) as m FROM receipt");
    const nextId = (maxRes.rows[0].m || 0) + 1;
    const year = new Date(receipt_date || Date.now()).getFullYear().toString().slice(-2);
    const receipt_no = `RCT${year}-${nextId.toString().padStart(5, "0")}`;

    // Compute total received from line items
    let total_received = 0;
    const validLines = [];
    
    for (const li of line_items) {
      if (!li.invoice_no) continue;
      const inv = await client.query("SELECT id, amount_due FROM invoice WHERE invoice_no = $1", [li.invoice_no]);
      if (inv.rowCount === 0) throw new Error(`Invoice not found: ${li.invoice_no}`);
      const invoice_id = inv.rows[0].id;
      const amount_received = Number(li.amount_received_here || 0);
      
      if (amount_received < 0) throw new Error("Amount Received Here must not be negative.");
      if (amount_received > 0) {
        total_received += amount_received;
        validLines.push({ invoice_id, amount_received });
      }
    }

    const rct = await client.query(
      `INSERT INTO receipt (id, receipt_no, receipt_date, customer_id, payment_method, payment_notes, total_received, created_at)
       VALUES ((SELECT COALESCE(MAX(id),0)+1 FROM receipt), $1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, receipt_no`,
      [receipt_no, receipt_date, customer_id, payment_method, payment_notes, round2(total_received)]
    );
    const receipt_id = rct.rows[0].id;

    for (const li of validLines) {
      await client.query(
        `INSERT INTO receipt_line_item (id, receipt_id, invoice_id, amount_received, created_at)
         VALUES ((SELECT COALESCE(MAX(id),0)+1 FROM receipt_line_item), $1, $2, $3, NOW())`,
        [receipt_id, li.invoice_id, li.amount_received]
      );
    }

    await client.query("commit");
    return { receipt_no: rct.rows[0].receipt_no };
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

export async function updateReceipt(idOrReceiptNo, { receipt_date, customer_code, payment_method, payment_notes, line_items }) {
  let id = idOrReceiptNo;
  if (typeof idOrReceiptNo === "string" && isNaN(Number(idOrReceiptNo))) {
    id = await resolveReceiptId(String(idOrReceiptNo).trim());
    if (id == null) throw new Error("Receipt not found");
  } else { id = Number(idOrReceiptNo); }

  const client = await pool.connect();
  try {
    await client.query("begin");

    const code = customer_code != null ? String(customer_code).trim() : "";
    const cust = await client.query("SELECT id FROM customer WHERE code = $1", [code]);
    if (cust.rowCount === 0) throw new Error(`Customer not found: ${code}`);
    const customer_id = cust.rows[0].id;

    let total_received = 0;
    const validLines = [];
    
    for (const li of line_items) {
      if (!li.invoice_no) continue;
      const inv = await client.query("SELECT id FROM invoice WHERE invoice_no = $1", [li.invoice_no]);
      if (inv.rowCount === 0) throw new Error(`Invoice not found: ${li.invoice_no}`);
      const invoice_id = inv.rows[0].id;
      const amount_received = Number(li.amount_received_here || 0);
      
      if (amount_received < 0) throw new Error("Amount Received Here must not be negative.");
      if (amount_received > 0) {
        total_received += amount_received;
        validLines.push({ invoice_id, amount_received });
      }
    }

    await client.query(
      `UPDATE receipt 
       SET receipt_date=$1, customer_id=$2, payment_method=$3, payment_notes=$4, total_received=$5
       WHERE id=$6`,
      [receipt_date, customer_id, payment_method, payment_notes, round2(total_received), id]
    );

    // Delete old lines
    await client.query("DELETE FROM receipt_line_item WHERE receipt_id = $1", [id]);

    // Insert new lines
    for (const li of validLines) {
      await client.query(
        `INSERT INTO receipt_line_item (id, receipt_id, invoice_id, amount_received, created_at)
         VALUES ((SELECT COALESCE(MAX(id),0)+1 FROM receipt_line_item), $1, $2, $3, NOW())`,
        [id, li.invoice_id, li.amount_received]
      );
    }

    await client.query("commit");
    const rct = await pool.query("SELECT receipt_no FROM receipt WHERE id = $1", [id]);
    return { receipt_no: rct.rows[0]?.receipt_no };
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteReceipt(idOrReceiptNo) {
  let id = idOrReceiptNo;
  if (typeof idOrReceiptNo === "string" && isNaN(Number(idOrReceiptNo))) {
    id = await resolveReceiptId(String(idOrReceiptNo).trim());
    if (id == null) return null;
  } else { id = Number(idOrReceiptNo); }

  await pool.query("DELETE FROM receipt WHERE id=$1", [id]);
  return { ok: true };
}