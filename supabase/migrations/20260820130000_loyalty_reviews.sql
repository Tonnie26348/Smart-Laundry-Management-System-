-- 1. Loyalty Transactions Table
CREATE TABLE loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    points_change INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Loyalty Points Trigger
CREATE OR REPLACE FUNCTION add_loyalty_points()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' THEN
        UPDATE customers 
        SET loyalty_points = loyalty_points + floor(NEW.total_amount / 100)
        WHERE id = NEW.customer_id;
        
        INSERT INTO loyalty_transactions (customer_id, points_change, reason)
        VALUES (NEW.customer_id, floor(NEW.total_amount / 100), 'Points for order ' || NEW.order_number);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_completed_trigger
AFTER UPDATE ON orders
FOR EACH ROW
WHEN (OLD.status != 'completed' AND NEW.status = 'completed')
EXECUTE FUNCTION add_loyalty_points();

-- 4. RLS Policies
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own loyalty transactions" ON loyalty_transactions FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));
CREATE POLICY "Customers can view approved reviews" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Customers can insert own reviews" ON reviews FOR INSERT WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));
CREATE POLICY "Staff can moderate reviews" ON reviews FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'manager'));
