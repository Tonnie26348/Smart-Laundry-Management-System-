-- 1. Discounts table
CREATE TABLE discounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
    value DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    usage_limit INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Discount Usage table
CREATE TABLE discount_usages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discount_id UUID REFERENCES discounts(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
    used_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SQL function for calculation
CREATE OR REPLACE FUNCTION apply_discount(order_id_param UUID, discount_code TEXT)
RETURNS DECIMAL AS $$
DECLARE
    discount_record RECORD;
    order_total DECIMAL;
    discount_amount DECIMAL;
BEGIN
    SELECT * INTO discount_record FROM discounts WHERE code = discount_code AND is_active = true;
    IF discount_record.id IS NULL THEN RETURN 0; END IF;

    IF (discount_record.start_date IS NOT NULL AND discount_record.start_date > NOW()) OR 
       (discount_record.end_date IS NOT NULL AND discount_record.end_date < NOW()) THEN 
        RETURN 0; 
    END IF;

    IF discount_record.usage_limit IS NOT NULL AND 
       (SELECT count(*) FROM discount_usages WHERE discount_id = discount_record.id) >= discount_record.usage_limit THEN 
        RETURN 0; 
    END IF;

    SELECT total_price INTO order_total FROM orders WHERE id = order_id_param;
    
    IF discount_record.type = 'percentage' THEN
        discount_amount := (order_total * discount_record.value) / 100;
    ELSE
        discount_amount := discount_record.value;
    END IF;

    RETURN LEAST(discount_amount, order_total);
END;
$$ LANGUAGE plpgsql;

-- 4. RLS
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_usages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active discounts" ON discounts FOR SELECT USING (is_active = true);
CREATE POLICY "Admin/Manager can manage discounts" ON discounts FOR ALL USING (get_user_role(auth.uid()) IN ('administrator', 'manager'));
CREATE POLICY "Customers can view own discount usages" ON discount_usages FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())));
