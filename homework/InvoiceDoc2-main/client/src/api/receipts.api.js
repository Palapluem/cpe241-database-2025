import { API_BASE } from "./http.js";

// API for Receipts
export async function listReceipts(params = {}) {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}${API_BASE.endsWith('/') ? '' : '/'}api/receipts?${q}`);
    if (!res.ok) { const text = await res.text(); throw new Error(text || "Failed to fetch receipts"); }
    return res.json();
}

export async function getReceipt(id) {
    if (id === "new") return null;
    const res = await fetch(`${API_BASE}${API_BASE.endsWith('/') ? '' : '/'}api/receipts/${id}`);
    if (!res.ok) { const text = await res.text(); throw new Error(text || "Failed to fetch receipt"); }
    return res.json();
}

export async function createReceipt(data) {
    const res = await fetch(`${API_BASE}${API_BASE.endsWith('/') ? '' : '/'}api/receipts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        let err;
        try { const text = await res.text(); err = JSON.parse(text).error; } catch { err = "Create error"; }
        throw new Error(err);
    }
    return res.json();
}

export async function updateReceipt(id, data) {
    const res = await fetch(`${API_BASE}${API_BASE.endsWith('/') ? '' : '/'}api/receipts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        let err;
        try { const text = await res.text(); err = JSON.parse(text).error; } catch { err = "Update error"; }
        throw new Error(err);
    }
    return res.json();
}

export async function deleteReceipt(id) {
    const res = await fetch(`${API_BASE}${API_BASE.endsWith('/') ? '' : '/'}api/receipts/${id}`, { method: "DELETE" });
    if (!res.ok) { const text = await res.text(); throw new Error(text || "Failed to delete receipt"); }
    return res.json();
}

export async function getReceiptUnpaidInvoices(customerCode, excludeReceiptId = "") {
    const params = { customerCode };
    if (excludeReceiptId) params.excludeReceiptId = excludeReceiptId;
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}${API_BASE.endsWith('/') ? '' : '/'}api/receipt-invoices?${q}`);
    if (!res.ok) {
        let err;
        try { const text = await res.text(); err = JSON.parse(text).error; } catch { err = "Fetch error"; }
        throw new Error(err || "Failed to fetch unpaid invoices");
    }
    return res.json();
}