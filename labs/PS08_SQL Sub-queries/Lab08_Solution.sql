-- PS08 SQL Sub-queries Solution (Improved from PS07 as per instructions)
-- Lab 08: Using Sub-queries to enhance data querying from the original problem

-- =============================================================================================
-- Report 1: Monthly Revenue by Content Type
-- Original PS07 Task 1: Show total revenue.
-- Added in PS08: Show **ONLY** types that generate revenue **above the monthly average**.
-- =============================================================================================

SELECT 
    TO_CHAR(DATE_TRUNC('month', o.created_at), 'YYYY-MM') AS month,
    c.content_type,
    SUM(oi.price) AS total_revenue,
    COUNT(DISTINCT o.id) AS paid_orders,
    'Above Avg' AS performance_status
FROM "order" o
JOIN order_item oi ON o.id = oi.order_id
JOIN content c ON oi.content_id = c.id
WHERE o.status = 'PAID'
GROUP BY DATE_TRUNC('month', o.created_at), c.content_type
HAVING SUM(oi.price) > (
    -- Subquery: Calculate average revenue of content types in the same month
    SELECT AVG(type_total)
    FROM (
        SELECT SUM(oi2.price) as type_total
        FROM "order" o2
        JOIN order_item oi2 ON o2.id = oi2.order_id
        JOIN content c2 ON oi2.content_id = c2.id
        WHERE o2.status = 'PAID'
        AND DATE_TRUNC('month', o2.created_at) = DATE_TRUNC('month', o.created_at) -- Correlated
        GROUP BY c2.content_type
    ) as avg_calc
)
ORDER BY month DESC, total_revenue DESC;

-- =============================================================================================
-- Report 2: Quarterly Paid Orders & Success Rate (Underperforming)
-- Original PS07 Task 2: Show quarterly paid orders and payment success rate.
-- Added in PS08: Show **ONLY** quarters where paid orders are **below the yearly average**.
-- =============================================================================================

WITH YearStats AS (
    SELECT AVG(q_count) as avg_orders
    FROM (
        SELECT COUNT(DISTINCT o_sub.id) as q_count
        FROM "order" o_sub
        WHERE o_sub.status = 'PAID'
        GROUP BY DATE_TRUNC('quarter', o_sub.created_at)
    ) as quarterly_counts
)
SELECT 
    TO_CHAR(DATE_TRUNC('quarter', o.created_at), 'YYYY-"Q"Q') AS quarter,
    COUNT(DISTINCT o.id) AS paid_orders,
    COUNT(CASE WHEN p.status = 'SUCCESS' THEN 1 END) AS success_payments,
    COUNT(CASE WHEN p.status = 'FAILED' THEN 1 END) AS failed_payments,
    CAST((COUNT(CASE WHEN p.status = 'SUCCESS' THEN 1 END) * 100.0 / NULLIF(COUNT(p.id), 0)) AS NUMERIC(5,2)) AS success_rate,
    'Below Avg' AS performance_status,
    (COUNT(DISTINCT o.id) - (SELECT avg_orders FROM YearStats))::integer AS difference_from_avg
FROM "order" o
LEFT JOIN payment p ON o.id = p.order_id
WHERE o.status = 'PAID'
GROUP BY DATE_TRUNC('quarter', o.created_at)
HAVING COUNT(DISTINCT o.id) < (SELECT avg_orders FROM YearStats)
ORDER BY quarter;

-- =============================================================================================
-- Report 3: Top Purchased Content per Quarter (Best Seller Content)
-- Original PS07 Task 4: Show best-selling products ranking.
-- Added in PS08: Select **ONLY Rank 1 (Best Seller)** with the highest sales in that quarter.
-- =============================================================================================

SELECT 
    TO_CHAR(DATE_TRUNC('quarter', o.created_at), 'YYYY-"Q"Q') AS quarter,
    c.title AS content_title,
    COUNT(oi.order_id) AS purchases,
    SUM(oi.price) AS revenue,
    RANK() OVER (PARTITION BY DATE_TRUNC('quarter', o.created_at) ORDER BY SUM(oi.price) DESC) as rank,
    'Best Seller' AS note
FROM "order" o
JOIN order_item oi ON o.id = oi.order_id
JOIN content c ON oi.content_id = c.id
WHERE o.status = 'PAID'
GROUP BY DATE_TRUNC('quarter', o.created_at), c.id, c.title
HAVING SUM(oi.price) = (
    -- Subquery: Find the maximum revenue (MAX) for content in that quarter
    SELECT MAX(content_rev)
    FROM (
        SELECT SUM(oi2.price) as content_rev
        FROM "order" o2
        JOIN order_item oi2 ON o2.id = oi2.order_id
        WHERE o2.status = 'PAID'
        AND DATE_TRUNC('quarter', o2.created_at) = DATE_TRUNC('quarter', o.created_at) -- Correlated
        GROUP BY oi2.content_id
    ) as max_calc
)
ORDER BY quarter DESC;
