import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createPayment, getPayment, updatePayment } from "../../api/payments.api.js";
import { listInvoices } from "../../api/invoices.api.js";

export default function PaymentPage() {
    const { id } = useParams(); // "new" or ID
    const navigate = useNavigate();
    const isNew = id === "new";

    // Form state
    const [formData, setFormData] = React.useState({
        invoice_id: "",
        amount: "",
        payment_date: new Date().toISOString().split('T')[0],
        method: "cash",
        note: ""
    });
    const [invoices, setInvoices] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    // Load initial data
    React.useEffect(() => {
        // Load invoices for dropdown
        listInvoices({ limit: 1000 }).then(res => setInvoices(res.data));

        if (!isNew) {
            setLoading(true);
            getPayment(id)
                .then(data => {
                    const dateStr = data.payment_date ? new Date(data.payment_date).toISOString().split('T')[0] : "";
                    setFormData({
                        invoice_id: data.invoice_id,
                        amount: data.amount,
                        payment_date: dateStr,
                        method: data.method || "cash",
                        note: data.note || ""
                    });
                })
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [id, isNew]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isNew) {
                await createPayment(formData);
                toast.success("Payment created");
            } else {
                await updatePayment(id, formData);
                toast.success("Payment updated");
            }
            navigate("/payments");
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-error">{error}</div>;

    return (
        <div className="card" style={{ maxWidth: 600, margin: "2rem auto" }}>
            <h2 className="page-title">{isNew ? "Create Payment" : "Edit Payment"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Invoice</label>
                    <select
                        className="form-control"
                        value={formData.invoice_id}
                        onChange={e => setFormData({ ...formData, invoice_id: e.target.value })}
                        required
                    >
                        <option value="">Select Invoice</option>
                        {invoices.map(inv => (
                            <option key={inv.id} value={inv.id}>
                                {inv.invoice_no} ({inv.total_amount})
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="form-group">
                    <label>Payment Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={formData.payment_date}
                        onChange={e => setFormData({ ...formData, payment_date: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={formData.amount}
                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Method</label>
                    <select
                        className="form-control"
                        value={formData.method}
                        onChange={e => setFormData({ ...formData, method: e.target.value })}
                        required
                    >
                        <option value="cash">Cash</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Note</label>
                    <textarea
                        className="form-control"
                        value={formData.note}
                        onChange={e => setFormData({ ...formData, note: e.target.value })}
                    />
                </div>
                <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                    <button type="submit" className="btn btn-primary">Save</button>
                    <button type="button" className="btn btn-outline" onClick={() => navigate("/payments")}>Cancel</button>
                </div>
            </form>
        </div>
    );
}
