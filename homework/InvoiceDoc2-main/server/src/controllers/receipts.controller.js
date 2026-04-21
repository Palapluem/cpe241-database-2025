import * as receiptService from "../services/receipts.service.js";

// list all receipts
export async function getReceipts(req, res) {
  try {
    const queryParams = {
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit,
      sortBy: req.query.sortBy,
      sortDir: req.query.sortDir,
    };
    const result = await receiptService.listReceipts(queryParams);
    res.json(result);
  } catch (err) {
    console.error("getReceipts error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// get single receipt by ID or receipt_no
export async function getReceiptById(req, res) {
  try {
    const result = await receiptService.getReceipt(req.params.id);
    if (!result) return res.status(404).json({ error: "Receipt not found" });
    res.json(result);
  } catch (err) {
    console.error("getReceiptById error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// create receipt
export async function createReceipt(req, res) {
  try {
    const result = await receiptService.createReceipt(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error("createReceipt error:", err);
    res.status(400).json({ error: err.message });
  }
}

// update receipt
export async function updateReceipt(req, res) {
  try {
    const result = await receiptService.updateReceipt(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    console.error("updateReceipt error:", err);
    res.status(400).json({ error: err.message });
  }
}

// delete receipt
export async function deleteReceipt(req, res) {
  try {
    await receiptService.deleteReceipt(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error("deleteReceipt error:", err);
    res.status(500).json({ error: err.message });
  }
}

// Get Invoices for the receipt line item List Of Values (LoV)
export async function getReceiptUnpaidInvoices(req, res) {
  try {
    const customerCode = req.query.customerCode;
    let currentReceiptId = req.query.excludeReceiptId;
    if (currentReceiptId === "null" || currentReceiptId === "") currentReceiptId = null;
    
    if (!customerCode) {
      return res.status(400).json({ error: "customerCode is required" });
    }
    const result = await receiptService.getUnpaidInvoices(customerCode, currentReceiptId);
    res.json(result);
  } catch (err) {
    console.error("getReceiptUnpaidInvoices error:", err);
    res.status(400).json({ error: err.message });
  }
}