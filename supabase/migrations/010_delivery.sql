-- 1. Deliveries table
CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    pickup_address TEXT,
    delivery_address TEXT,
    delivery_type TEXT NOT NULL CHECK (delivery_type IN ('pickup', 'delivery')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed')),
    scheduled_at TIMESTAMPTZ,
    assigned_to UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Admin/Manager can manage all
CREATE POLICY "Admin/Manager can manage all deliveries" ON deliveries FOR ALL USING (get_user_role(auth.uid()) IN ('administrator', 'manager'));

-- Delivery staff can view/update assigned
CREATE POLICY "Delivery staff can view assigned deliveries" ON deliveries FOR SELECT USING (assigned_to = auth.uid());
CREATE POLICY "Delivery staff can update assigned deliveries" ON deliveries FOR UPDATE USING (assigned_to = auth.uid());

-- Customers can view own
CREATE POLICY "Customers can view own deliveries" ON deliveries FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())));
