import React from "react";
import { createPortal } from "react-dom";
import { useNavigate, Link, useParams } from "react-router-dom";
import { getReceipt, createReceipt, updateReceipt, getReceiptUnpaidInvoices } from "../../api/receipts.api.js";
import { toast } from "react-toastify";
import { formatBaht, formatDate, round2 } from "../../utils.js";
import CustomerPickerModal from "../../components/CustomerPickerModal.jsx";
import Loading from "../../components/Loading.jsx";

function calculateSummary(lines) {
    let total = 0;
    lines.forEach(li => {
        const amt = Number(li.amount_received_here) || 0;
        total += amt;
    });
    return round2(total);
}

export default function ReceiptPage({ mode: propMode }) {
    const { id } = useParams();
    const mode = propMode || (id ? "view" : "create");
    const nav = useNavigate();
    
    const [loading, setLoading] = React.useState(true);
    const [submitting, setSubmitting] = React.useState(false);
    
    // Header
    const [receiptId, setReceiptId] = React.useState("");
    const [receiptNo, setReceiptNo] = React.useState("");
    const [receiptDate, setReceiptDate] = React.useState(new Date().toISOString().split("T")[0]);
    const [paymentMethod, setPaymentMethod] = React.useState("Cash");
    const [paymentNotes, setPaymentNotes] = React.useState("");
    
    // Customer
    const [customerCode, setCustomerCode] = React.useState("");
    const [customerName, setCustomerName] = React.useState("");
    const [customerAddress, setCustomerAddress] = React.useState("");
    const [showCustPicker, setShowCustPicker] = React.useState(false);
    
    // Lines
    const [lines, setLines] = React.useState([]);
    const [unpaidInvoices, setUnpaidInvoices] = React.useState([]);
    const [invoiceLovOpen, setInvoiceLovOpen] = React.useState(false);

    React.useEffect(() => {
        if (mode === "create") {
            setLoading(false);
        } else {
            getReceipt(id)
                .then(data => {
                    const h = data.header;
                    setReceiptId(h.id);
                    setReceiptNo(h.receipt_no);
                    setReceiptDate(h.receipt_date.split("T")[0]);
                    setPaymentMethod(h.payment_method);
                    setPaymentNotes(h.payment_notes || "");
                    setCustomerCode(h.customer_code);
                    setCustomerName(h.customer_name);
                    setCustomerAddress(`${h.address_line1 || ""}, ${h.address_line2 || ""}`);
                    
                    setLines(data.line_items.map(li => ({
                        id: Math.random().toString(), // local id
                        invoice_id: li.invoice_id,
                        invoice_no: li.invoice_no,
                        full_amount_due: li.full_amount_due,
                        amount_already_received: li.amount_already_received,
                        amount_received_here: li.amount_received_here,
                        amount_remaining: li.full_amount_due - li.amount_already_received,
                        amount_still_remaining: li.full_amount_due - li.amount_already_received - li.amount_received_here
                    })));
                    
                    setLoading(false);
                })
                .catch(err => {
                    toast.error("Failed to load receipt: " + err.message);
                    nav("/receipts");
                });
        }
    }, [id, mode, nav]);

    const loadUnpaidInvoices = async () => {
        if (!customerCode) {
            toast.warning("Please select a customer first.");
            return;
        }
        try {
            const data = await getReceiptUnpaidInvoices(customerCode, receiptId || null);
            setUnpaidInvoices(data);
            setInvoiceLovOpen(true);
        } catch (e) {
            toast.error(e.message);
        }
    };

    const handleAddSelectedInvoices = (selectedInvoices) => {
        const newLines = [...lines];
        selectedInvoices.forEach(inv => {
            if (newLines.find(l => l.invoice_no === inv.invoice_no)) return;
            newLines.push({
                id: Math.random().toString(),
                invoice_id: inv.invoice_id,
                invoice_no: inv.invoice_no,
                full_amount_due: inv.full_amount_due,
                amount_already_received: inv.amount_already_received,
                amount_received_here: 0,
                amount_remaining: inv.amount_remaining,
                amount_still_remaining: inv.amount_remaining
            });
        });
        setLines(newLines);
        setInvoiceLovOpen(false);
    };

    const updateLineAmount = (id, newAmountText) => {
        const newVal = Number(newAmountText) || 0;
        setLines(lines.map(li => {
            if (li.id === id) {
                return {
                    ...li,
                    amount_received_here: newAmountText,
                    amount_still_remaining: round2(li.amount_remaining - newVal)
                };
            }
            return li;
        }));
    };

    const removeLine = (id) => {
        setLines(lines.filter(l => l.id !== id));
    };

    const onCustomerSelect = (custCode, custLabel) => {
        setCustomerCode(custCode);
        const namePart = custLabel.split(" - ")[1] || "";
        setCustomerName(namePart);
        setCustomerAddress("");
        setShowCustPicker(false);
        setLines([]);
    };

    const onSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        const cleanLines = lines.map(li => ({
            invoice_no: li.invoice_no,
            amount_received_here: Number(li.amount_received_here) || 0
        })).filter(li => li.amount_received_here > 0);
        
        if (cleanLines.length === 0) {
            toast.error("Receipt must have at least one line item with an amount > 0");
            setSubmitting(false);
            return;
        }

        const hasNegativeAmount = lines.some(li => (Number(li.amount_received_here) || 0) < 0);
        if (hasNegativeAmount) {
            toast.error("Cannot have negative amount received here.");
            setSubmitting(false);
            return;
        }
        
        const payload = {
            receipt_date: receiptDate,
            customer_code: customerCode,
            payment_method: paymentMethod,
            payment_notes: paymentNotes,
            line_items: cleanLines
        };

        try {
            if (mode === "create") {
                const res = await createReceipt(payload);
                toast.success("Created: " + res.receipt_no);
                nav("/receipts");
            } else {
                await updateReceipt(id, payload);
                toast.success("Updated receipt successfully.");
                nav(`/receipts/${id}`);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <Loading size="large" />;

    const totalReceived = calculateSummary(lines);
    const readOnly = mode === "view";

    if (readOnly) {
        return (
            <div className="invoice-preview">
            <style>{`
                @media print {
                    .receipt-print-hide { display: none !important; }
                    .card { box-shadow: none !important; border: none !important; }
                    .modern-table { font-size: 12px; }
                    .page-header, .no-print { display: none !important; }
                }
            `}</style>
            <div className="page-header no-print">
                    <h3 className="page-title">Receipt {receiptNo}</h3>
                    <div className="flex gap-4">
                        <Link to="/receipts" className="btn btn-outline">← Back</Link>
                        <Link to={`/receipts/${id}/edit`} className="btn btn-outline">Edit</Link>
                        <button onClick={handlePrint} className="btn btn-primary">
                            <svg style={{ marginRight: 8 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                            Print PDF
                        </button>
                    </div>
                </div>

                <div className="card">
                    <div className="flex justify-between mb-4">
                        <div>
                            <div className="brand mb-4">InvoiceDoc v2</div>
                            <div className="font-bold">Customer</div>
                            <div>{customerCode} - {customerName}</div>
                            {customerAddress && <div className="text-muted">{customerAddress}</div>}
                        </div>
                        <div className="text-right">
                            <h2 className="mb-4">OFFICIAL RECEIPT</h2>
                            <div><span className="font-bold">Date:</span> {formatDate(receiptDate)}</div>
                            <div><span className="font-bold">Receipt No:</span> {receiptNo}</div>
                            <div><span className="font-bold">Payment Method:</span> {paymentMethod}</div>
                            {paymentNotes && (
                                <div><span className="font-bold">Notes:</span> {paymentNotes}</div>
                            )}
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>Invoice No</th>
                                    <th className="text-right">Amount Due</th>
                                    <th className="text-right receipt-print-hide">Already Rcvd</th>
                                    <th className="text-right receipt-print-hide">Remaining</th>
                                    <th className="text-right">Amt Received Here</th>
                                    <th className="text-right">Still Remaining</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lines.map((li) => (
                                    <tr key={li.id}>
                                        <td>{li.invoice_no}</td>
                                        <td className="text-right">{formatBaht(li.full_amount_due)}</td>
                                        <td className="text-right text-muted receipt-print-hide">{formatBaht(li.amount_already_received)}</td>
                                        <td className="text-right receipt-print-hide">{formatBaht(li.amount_remaining)}</td>
                                        <td className="text-right font-bold text-primary">{formatBaht(li.amount_received_here)}</td>
                                        <td className="text-right">{formatBaht(li.amount_still_remaining)}</td>
                                    </tr>
                                ))}
                                {lines.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>
                                            No invoices applied yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex justify-between">
                        <div className="no-print text-muted" style={{ maxWidth: 300, fontSize: '0.8rem' }}>
                            Thank you for your payment.
                        </div>
                        <div style={{ minWidth: 250 }}>
                            <div className="flex justify-between mt-4 p-2 bg-body font-bold rounded" style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>
                                <span>Total Received:</span>
                                <span>{formatBaht(totalReceived)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Create / Edit mode layout matching InvoiceDoc v2
    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">{mode === "create" ? "Create Receipt" : `Edit Receipt ${receiptNo}`}</h3>
                <Link to="/receipts" className="btn btn-outline">
                    <svg style={{ marginRight: 8 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Back
                </Link>
            </div>

            <div className="card">
                <form onSubmit={onSave}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                        <div>
                            <h4 className="font-bold mb-4" style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>Receipt Information</h4>
                            <div className="form-group">
                                <label className="form-label">Receipt No</label>
                                <input type="text" className="form-control" value={mode === "create" ? "NEW (Generated)" : receiptNo} disabled />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Date *</label>
                                <input
                                    type="date"
                                    required
                                    className="form-control"
                                    value={receiptDate}
                                    onChange={(e) => setReceiptDate(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Payment Method *</label>
                                <select
                                    required
                                    className="form-control"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Check">Check</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4" style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>Billing Information</h4>
                            <div className="form-group">
                                <label className="form-label">Customer *</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={customerCode ? `${customerCode} - ${customerName}` : ""} 
                                        placeholder="Select a customer..."
                                        disabled 
                                        style={{ flex: 1 }} 
                                    />
                                    <button 
                                        type="button" 
                                        className="btn btn-outline"
                                        onClick={() => setShowCustPicker(true)}
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Payment Notes</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={paymentNotes}
                                    onChange={(e) => setPaymentNotes(e.target.value)}
                                    placeholder="Optional notes..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <h4 className="font-bold">Applied Invoices</h4>
                            <button
                                type="button"
                                onClick={loadUnpaidInvoices}
                                className="btn btn-primary"
                                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                            >
                                + Add Unpaid Invoices
                            </button>
                        </div>
                        <div className="table-container">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>Invoice No</th>
                                        <th className="text-right">Amount Due</th>
                                        <th className="text-right">Already Rcvd</th>
                                        <th className="text-right">Remaining</th>
                                        <th className="text-right" style={{ width: 180 }}>Amt Received Here</th>
                                        <th className="text-right">Still Remaining</th>
                                        <th className="text-center" style={{ width: 60 }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lines.map((li) => {
                                        const stillRem = Number(li.amount_still_remaining);
                                        const stillRemStyle = stillRem < 0 ? { color: 'var(--danger)', fontWeight: 'bold' } : {};
                                        return (
                                            <tr key={li.id}>
                                                <td>{li.invoice_no}</td>
                                                <td className="text-right">{formatBaht(li.full_amount_due)}</td>
                                                <td className="text-right text-muted">{formatBaht(li.amount_already_received)}</td>
                                                <td className="text-right font-bold">{formatBaht(li.amount_remaining)}</td>
                                                <td className="text-right">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        className="form-control"
                                                        style={{ textAlign: 'right' }}
                                                        value={li.amount_received_here}
                                                        onChange={e => updateLineAmount(li.id, e.target.value)}
                                                    />
                                                </td>
                                                <td className="text-right" style={stillRemStyle}>
                                                    {formatBaht(stillRem)}
                                                </td>
                                                <td className="text-center">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeLine(li.id)}
                                                        style={{ border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer' }}
                                                        title="Remove"
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {lines.length === 0 && (
                                        <tr>
                                            <td colSpan={7} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>
                                                Select a customer and add unpaid invoices to receive payment.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <div style={{ minWidth: 250 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--body-bg)', fontWeight: 'bold', borderRadius: 'var(--radius)', fontSize: '1.2rem', color: 'var(--primary)' }}>
                                <span>Total Received:</span>
                                <span>{formatBaht(totalReceived)}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)', gap: '1rem' }}>
                        <button type="button" onClick={() => nav(-1)} className="btn btn-outline">Cancel</button>
                        <button type="submit" disabled={submitting} className="btn btn-primary">
                            {submitting ? "Saving..." : "Save Receipt"}
                        </button>
                    </div>
                </form>
            </div>

            <CustomerPickerModal
                isOpen={showCustPicker}
                initialSearch=""
                onClose={() => setShowCustPicker(false)}
                onSelect={onCustomerSelect}
            />

            {invoiceLovOpen && (
                <InvoiceLovModal
                    invoices={unpaidInvoices}
                    onClose={() => setInvoiceLovOpen(false)}
                    onSelect={handleAddSelectedInvoices}
                />
            )}
        </div>
    );
}

function InvoiceLovModal({ invoices, onClose, onSelect }) {
    const [selectedIds, setSelectedIds] = React.useState(new Set());
    const [search, setSearch] = React.useState("");

    const filtered = invoices.filter(inv =>
        inv.invoice_no.toLowerCase().includes(search.toLowerCase())
    );

    const toggleRow = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleApply = () => {
        const res = invoices.filter(i => selectedIds.has(i.invoice_id));
        onSelect(res);
    };

    return createPortal(
        <div
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, padding: 24 }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{ background: "white", borderRadius: "var(--radius)", boxShadow: "var(--shadow-lg)", maxWidth: 720, width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column" }}
            >
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 600 }}>Select Unpaid Invoices</h3>
                    <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text-muted)" }}>✕</button>
                </div>

                <div style={{ padding: "16px 20px" }}>
                    <div style={{ position: "relative" }}>
                        <input
                            type="text"
                            placeholder="Search Invoice No..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="form-control"
                            style={{ paddingLeft: 36 }}
                        />
                        <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                    </div>
                </div>

                <div style={{ flex: 1, overflow: "auto", padding: "0 20px" }}>
                    <div className="table-container">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th style={{ width: 40, textAlign: "center" }}></th>
                                    <th>Invoice No</th>
                                    <th className="text-right">Amt Due</th>
                                    <th className="text-right">Already Received</th>
                                    <th className="text-right">Remaining</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>
                                            No invoices found.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map(inv => {
                                        const isSelected = selectedIds.has(inv.invoice_id);
                                        return (
                                            <tr
                                                key={inv.invoice_id}
                                                style={{ cursor: "pointer", background: isSelected ? "var(--body-bg)" : "transparent" }}
                                                onClick={() => toggleRow(inv.invoice_id)}
                                            >
                                                <td className="text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleRow(inv.invoice_id)}
                                                        onClick={e => e.stopPropagation()}
                                                    />
                                                </td>
                                                <td style={{ fontWeight: 500 }}>{inv.invoice_no}</td>
                                                <td className="text-right">{formatBaht(inv.full_amount_due)}</td>
                                                <td className="text-right text-muted">{formatBaht(inv.amount_already_received)}</td>
                                                <td className="text-right font-bold text-primary">{formatBaht(inv.amount_remaining)}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 500 }}>
                        {selectedIds.size} selected
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button onClick={onClose} className="btn btn-outline">Cancel</button>
                        <button
                            onClick={handleApply}
                            disabled={selectedIds.size === 0}
                            className="btn btn-primary"
                        >
                            Apply Selected
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}