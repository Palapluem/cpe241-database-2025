-- ==============================================================================
-- Individual Lab 3: Delta Script (invoice_lab3_delta.sql)
-- ==============================================================================
-- This script applies changes incrementally to the existing database from Lab 2.
-- DO NOT drop and recreate the database.

-- 1. Create 'configuration' table to store default VAT percent
CREATE TABLE IF NOT EXISTS configuration (
    id SERIAL PRIMARY KEY,
    vat_percent NUMERIC(5,2) NOT NULL DEFAULT 7.00
);

-- Insert the default VAT percentage (7%)
INSERT INTO configuration (vat_percent) VALUES (7.00);

-- 2. Enhance 'invoice_line_item' table with discount fields
-- We only need to store the editable discount percent.
-- The calculated fields (amount, net price, totals) will be handled by the API.
ALTER TABLE invoice_line_item 
ADD COLUMN IF NOT EXISTS line_discount_percent NUMERIC(5,2) DEFAULT 0.00;

-- Note: The sales_person table should already exist from Individual Lab 2.
-- Adding modifications to support the new UI requirements

-- 3. Enhance 'sales_person' table
ALTER TABLE sales_person 
ADD COLUMN IF NOT EXISTS start_work_date DATE;

-- 4. Link 'invoice' to 'sales_person'
ALTER TABLE invoice 
ADD COLUMN IF NOT EXISTS sales_person_id INTEGER REFERENCES sales_person(id);