-- 1. Ensure order_id in loyalty_transactions for idempotency
ALTER TABLE loyalty_transactions 
ADD COLUMN order_id UUID REFERENCES orders(id) UNIQUE;

-- 2. Update Loyalty Points Trigger to prevent duplicate awards
CREATE OR REPLACE FUNCTION add_loyalty_points()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if points were already awarded for this order
    IF NOT EXISTS (SELECT 1 FROM loyalty_transactions WHERE order_id = NEW.id) THEN
        UPDATE customers 
        SET loyalty_points = loyalty_points + floor(NEW.total_price / 100)
        WHERE id = NEW.customer_id;
        
        INSERT INTO loyalty_transactions (customer_id, order_id, points_change, reason)
        VALUES (NEW.customer_id, NEW.id, floor(NEW.total_price / 100), 'Points for order ' || NEW.order_number);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
