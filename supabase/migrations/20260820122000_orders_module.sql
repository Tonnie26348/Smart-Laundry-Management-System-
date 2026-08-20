-- 1. Update orders table
ALTER TABLE orders 
ADD COLUMN order_number TEXT UNIQUE NOT NULL DEFAULT ('ORD-' || nextval('txid_current_snapshot'::regclass)::text),
ADD COLUMN delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN discount_amount DECIMAL(10, 2) DEFAULT 0.00;

-- 2. Create order_item_defects table
CREATE TABLE order_item_defects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create deliveries table
CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    delivery_type TEXT NOT NULL CHECK (delivery_type IN ('pickup', 'delivery')),
    address TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'in_transit', 'completed')),
    scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS and add policies
ALTER TABLE order_item_defects ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can insert defects" ON order_item_defects FOR INSERT USING (get_user_role(auth.uid()) IN ('admin', 'manager', 'staff'));
CREATE POLICY "Everyone can view defects" ON order_item_defects FOR SELECT USING (true);

CREATE POLICY "Customers can view own deliveries" ON deliveries FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())));
CREATE POLICY "Staff can view all deliveries" ON deliveries FOR SELECT USING (get_user_role(auth.uid()) IN ('admin', 'manager', 'staff'));
