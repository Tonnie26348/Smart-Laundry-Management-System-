-- 1. Update orders status check constraint
ALTER TABLE orders DROP CONSTRAINT orders_status_check;

ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN (
    'pending', 'received', 'washing', 'drying', 'ironing', 
    'quality_check', 'ready', 'out_for_delivery', 'completed', 'cancelled'
));

-- 2. Enable Realtime for orders
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
