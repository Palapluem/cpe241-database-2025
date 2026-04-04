// Payment list: click Delete → show confirm modal → call delete API → refresh table
import React from "react";
import { toast } from "react-toastify";
import { listPayments, deletePayment } from "../../api/payments.api.js";
import { formatBaht, formatDate } from "../../utils.js";
import DataList from "../../components/DataList.jsx";
import { ConfirmModal, AlertModal } from "../../components/Modal.jsx";

export default function PaymentList() {
    const fetchData = React.useCallback((params) => listPayments(params), []);
    const [confirmModal, setConfirmModal] = React.useState({ isOpen: false, id: null });
    const [alertModal, setAlertModal] = React.useState({ isOpen: false, message: "" });
    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

    const closeConfirm = () => setConfirmModal({ isOpen: false, id: null });

    const handleDelete = (id) => {
        setConfirmModal({ isOpen: true, id });
    };

    const confirmDelete = async () => {
        try {
            await deletePayment(confirmModal.id);
            closeConfirm();
            setRefreshTrigger((t) => t + 1);
            toast.success("Payment deleted.");
        } catch (e) {
            const msg = String(e.message || e);
            toast.error(msg);
            setAlertModal({ isOpen: true, message: "Error: " + msg });
            closeConfirm();
        }
    };

    // Columns: id, invoice_id, payment_date, amount, method, note
    const columns = [
        { key: "id", label: "ID", sortable: true, style: { width: 60 } },
        { key: "invoice_id", label: "Invoice ID", sortable: true },
        { key: "payment_date", label: "Payment Date", sortable: true, render: v => formatDate(v) },
        { key: "amount", label: "Amount", sortable: true, align: "right", render: v => <span className="font-bold">{formatBaht(v)}</span> },
        { key: "method", label: "Method", sortable: true },
        { key: "note", label: "Note", sortable: true, render: v => v || "-" },
    ];

    return (
        <>
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmDelete}
                closeOnConfirm={false}
                title="Delete Payment"
                message="Are you sure you want to delete this payment?"
                confirmText="Delete"
            />
            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={() => setAlertModal({ isOpen: false, message: "" })}
                title="Error"
                message={alertModal.message}
            />
            <DataList
                refreshTrigger={refreshTrigger}
                title="Payments"
                fetchData={fetchData}
                columns={columns}
                searchPlaceholder="Search ID, Invoice, Note..."
                itemName="payment"
                basePath="/payments"
                itemKey="id"
                onDelete={handleDelete}
            />
        </>
    );
}
