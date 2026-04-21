import React from "react";
import { toast } from "react-toastify";
import { listReceipts, deleteReceipt } from "../../api/receipts.api.js";
import { formatBaht, formatDate } from "../../utils.js";
import DataList from "../../components/DataList.jsx";
import { ConfirmModal, AlertModal } from "../../components/Modal.jsx";

export default function ReceiptList() {
    const fetchData = React.useCallback((params) => listReceipts(params), []);
    const [confirmModal, setConfirmModal] = React.useState({ isOpen: false, id: null });
    const [alertModal, setAlertModal] = React.useState({ isOpen: false, message: "" });
    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

    const closeConfirm = () => setConfirmModal({ isOpen: false, id: null });

    const handleDelete = (id) => {
        setConfirmModal({ isOpen: true, id });
    };

    const confirmDelete = async () => {
        try {
            await deleteReceipt(confirmModal.id);
            closeConfirm();
            setRefreshTrigger((t) => t + 1);
            toast.success("Receipt deleted.");
        } catch (e) {
            const msg = String(e.message || e);
            toast.error(msg);
            setAlertModal({ isOpen: true, message: "Error: " + msg });
        }
    };

    const columns = [
        { key: "receipt_no", label: "Receipt No", sortable: true },
        { key: "receipt_date", label: "Date", render: (v) => formatDate(v), sortable: true },
        { key: "customer_name", label: "Customer Name", sortable: true },
        { key: "payment_method", label: "Payment Method", sortable: true },
        { key: "total_received", label: "Total Received", align: "right", render: (v) => formatBaht(v), sortable: true },
    ];

    return (
        <div>
            <DataList
                title="Receipts"
                basePath="/receipts"
                itemName="receipt"
                itemKey="receipt_no"
                columns={columns}
                fetchData={fetchData}
                onDelete={handleDelete}
                refreshTrigger={refreshTrigger}
                placeholder="Search by receipt no or customer name..."
            />
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmDelete}
                closeOnConfirm={false}
                title="Delete Receipt"
                message="Are you sure you want to delete this receipt?"
                confirmText="Delete"
            />
            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={() => setAlertModal({ isOpen: false, message: "" })}
                title="Error"
                message={alertModal.message}
            />
        </div>
    );
}