-- ============================================================
-- Step 4: Write SQL statements to create tables (DDL)
-- ============================================================

-- create database for (Q3) customers, products, orders, items, and payments
CREATE DATABASE shop_db;
USE shop_db;

-- 1. Customers
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    address TEXT
);

-- 2. Products
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- 3. Orders
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    shipping_date DATE,
    
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- 4. Product_Line_Items
CREATE TABLE product_line_items (
    line_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price DECIMAL(10, 2), -- price * quantity
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 5. Payments
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50), -- Credit Card, Cash, etc.
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- ============================================================
-- Step 5: Generate examples data and insert them (DML)
-- ============================================================

-- 1. Insert Customers
INSERT INTO customers (first_name, last_name, address) VALUES 
('Anan', 'Panya', '123 Sukhumvit, Bangkok'),
('Boonchai', 'Srichai', '456 Nimman, Chiang Mai'),
('Chalee', 'Rakdee', '789 Beach Rd, Chonburi');

-- 2. Insert Products
INSERT INTO products (product_name, price) VALUES 
('Laptop Gaming', 35000.00),
('Mechanical Keyboard', 2500.00),
('Wireless Mouse', 1200.00),
('Monitor 27 inch', 7500.00),
('Desk Chair', 4500.00);

-- 3. Insert Orders
INSERT INTO orders (customer_id, order_date, shipping_date) VALUES 
(1, '2025-01-10 10:30:00', '2025-01-12'),
(2, '2025-01-11 14:00:00', '2025-01-13'),
(3, '2025-01-12 09:15:00', '2025-01-14');

-- 4. Insert Product_Line_Items
INSERT INTO product_line_items (order_id, product_id, quantity, total_price) VALUES 
(1, 1, 1, 35000.00),
(1, 3, 1, 1200.00),
(2, 2, 2, 5000.00),
(3, 4, 1, 7500.00),
(3, 5, 1, 4500.00);

-- 5. Insert Payments
INSERT INTO payments (order_id, payment_date, amount, payment_method) VALUES 
(1, '2025-01-10 10:45:00', 36200.00, 'Credit Card'),
(2, '2025-01-11 14:30:00', 5000.00, 'Bank Transfer'),
(3, '2025-01-12 09:30:00', 12000.00, 'Cash on Delivery');