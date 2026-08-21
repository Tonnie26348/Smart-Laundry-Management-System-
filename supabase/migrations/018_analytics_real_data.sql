-- Enhanced RPC for dashboard and reports
CREATE OR REPLACE FUNCTION get_admin_analytics()
RETURNS TABLE(
    today_orders BIGINT,
    pending_orders BIGINT,
    completed_orders BIGINT,
    total_revenue DECIMAL,
    customer_count BIGINT,
    low_stock_count BIGINT,
    revenue_data JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT count(*) FROM orders WHERE created_at::date = CURRENT_DATE),
        (SELECT count(*) FROM orders WHERE status = 'pending'),
        (SELECT count(*) FROM orders WHERE status = 'completed'),
        (SELECT COALESCE(sum(total_price), 0) FROM orders WHERE status = 'completed'),
        (SELECT count(*) FROM customers),
        (SELECT count(*) FROM inventory_items WHERE current_stock < min_stock_level),
        (SELECT jsonb_agg(sub) FROM (
            SELECT created_at::date as date, sum(total_price) as revenue 
            FROM orders 
            WHERE status = 'completed' 
            GROUP BY date 
            ORDER BY date DESC 
            LIMIT 7
        ) sub);
END;
$$ LANGUAGE plpgsql;
