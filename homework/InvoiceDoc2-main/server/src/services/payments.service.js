import { pool } from "../db/pool.js";

export async function listPayments({
  search = "",
  page = 1,
  limit = 10,
  sortBy = "payment_date",
  sortDir = "desc",
} = {}) {
  const offset = (Number(page) - 1) * Number(limit);
  const searchParam = `%${search}%`;

  const allowedSort = ["id", "payment_date", "invoice_id", "amount", "method"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "payment_date";
  const sortDirection = sortDir === "asc" ? "ASC" : "DESC";

  // Count
  const countQuery = `
    SELECT COUNT(*) as total
    FROM payment p
    WHERE cast(p.id as text) ILIKE $1 
       OR cast(p.invoice_id as text) ILIKE $1 
       OR p.note ILIKE $1
       OR p.method ILIKE $1
  `;
  const countResult = await pool.query(countQuery, [searchParam]);
  const total = Number(countResult.rows[0].total);

  // Data
  const dataQuery = `
    SELECT p.*
    FROM payment p
    WHERE cast(p.id as text) ILIKE $1 
       OR cast(p.invoice_id as text) ILIKE $1 
       OR p.note ILIKE $1 
       OR p.method ILIKE $1
    ORDER BY ${sortColumn} ${sortDirection}
    LIMIT $2 OFFSET $3
  `;
  const dataResult = await pool.query(dataQuery, [searchParam, limit, offset]);

  return {
    data: dataResult.rows,
    total,
    page: Number(page),
    limit: Number(limit),
  };
}

export async function getPayment(id) {
  const res = await pool.query("SELECT * FROM payment WHERE id = $1", [id]);
  return res.rows[0];
}

export async function createPayment(data) {
  const { invoice_id, amount, payment_date, method, note } = data;
  const res = await pool.query(
    `INSERT INTO payment (invoice_id, amount, payment_date, method, note)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [invoice_id, amount, payment_date || new Date(), method, note]
  );
  return res.rows[0];
}

export async function updatePayment(id, data) {
  const { invoice_id, amount, payment_date, method, note } = data;
  const res = await pool.query(
    `UPDATE payment
     SET invoice_id = $1, amount = $2, payment_date = $3, method = $4, note = $5
     WHERE id = $6
     RETURNING *`,
    [invoice_id, amount, payment_date, method, note, id]
  );
  return res.rows[0];
}

export async function deletePayment(id) {
  const res = await pool.query(
    "DELETE FROM payment WHERE id = $1 RETURNING id",
    [id]
  );
  return res.rows[0];
}
