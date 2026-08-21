-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'received', 'processing', 'completed', 'cancelled')),
    total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    laundry_item_id UUID REFERENCES laundry_items(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL -- Snapshot of price at time of order
);

-- RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies
-- Customers can view/insert own orders
CREATE POLICY "Customers can view own orders" ON orders FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));
CREATE POLICY "Customers can insert own orders" ON orders FOR INSERT WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

-- Staff/Admin can manage all
CREATE POLICY "Admin/Manager/Staff can manage all orders" ON orders FOR ALL USING (get_user_role(auth.uid()) IN ('administrator', 'manager', 'laundry_staff'));
CREATE POLICY "Admin/Manager/Staff can manage all order items" ON order_items FOR ALL USING (get_user_role(auth.uid()) IN ('administrator', 'manager', 'laundry_staff'));
CREATE POLICY "Customers can view own order items" ON order_items FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())));
