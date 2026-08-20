-- RPC for getting dashboard metrics
CREATE OR REPLACE FUNCTION get_dashboard_metrics()
RETURNS TABLE(
    today_orders BIGINT,
    pending_orders BIGINT,
    completed_orders BIGINT,
    total_revenue DECIMAL,
    active_customers BIGINT,
    low_stock_items BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT count(*) FROM orders WHERE created_at::date = CURRENT_DATE),
        (SELECT count(*) FROM orders WHERE status = 'pending'),
        (SELECT count(*) FROM orders WHERE status = 'completed'),
        (SELECT COALESCE(sum(total_amount), 0) FROM orders WHERE status = 'completed'),
        (SELECT count(*) FROM customers),
        (SELECT count(*) FROM inventory_items WHERE current_stock < min_stock_level);
END;
$$ LANGUAGE plpgsql;
