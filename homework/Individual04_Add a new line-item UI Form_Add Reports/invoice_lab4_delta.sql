-- ==============================================================================
-- Individual Lab 4: Delta Script (invoice_lab4_delta.sql)
-- ==============================================================================

-- 1. Create Receipt Header Table
CREATE TABLE IF NOT EXISTS receipt (
    id SERIAL PRIMARY KEY,
    receipt_no VARCHAR(20) UNIQUE NOT NULL,
    receipt_date DATE NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customer(id),
    payment_method VARCHAR(50) CHECK (payment_method IN ('Cash', 'Bank Transfer', 'Check')),
    payment_notes TEXT,
    total_received NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Receipt Line Item Table
CREATE TABLE IF NOT EXISTS receipt_line_item (
    id SERIAL PRIMARY KEY,
    receipt_id INTEGER NOT NULL REFERENCES receipt(id) ON DELETE CASCADE,
    invoice_id INTEGER NOT NULL REFERENCES invoice(id),
    amount_received NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create invoice_received_view View
-- This view calculates the total amount received and the remaining amount for each invoice.
DROP VIEW IF EXISTS invoice_received_view;

CREATE VIEW invoice_received_view AS
SELECT 
    i.customer_id,
    i.id AS invoice_id,
    i.invoice_no,
    i.amount_due,
    COALESCE(SUM(rli.amount_received), 0.00) AS amount_received,
    i.amount_due - COALESCE(SUM(rli.amount_received), 0.00) AS amount_remain
FROM 
    invoice i
LEFT JOIN 
    receipt_line_item rli ON i.id = rli.invoice_id
GROUP BY 
    i.customer_id, i.id, i.invoice_no, i.amount_due;
