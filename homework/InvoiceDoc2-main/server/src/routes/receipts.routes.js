import express from "express";
import * as receiptsController from "../controllers/receipts.controller.js";

const router = express.Router();

router.get("/api/receipt-invoices", receiptsController.getReceiptUnpaidInvoices);

router.get("/api/receipts", receiptsController.getReceipts);
router.post("/api/receipts", receiptsController.createReceipt);

router.get("/api/receipts/:id", receiptsController.getReceiptById);
router.put("/api/receipts/:id", receiptsController.updateReceipt);
router.delete("/api/receipts/:id", receiptsController.deleteReceipt);

export default router;