-- 1. Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    mpesa_transaction_id TEXT UNIQUE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed', 'cancelled')),
    amount DECIMAL(10, 2) NOT NULL,
    phone_number TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Customers can view own payments" ON payments FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())));
CREATE POLICY "Staff can view all payments" ON payments FOR SELECT USING (get_user_role(auth.uid()) IN ('admin', 'manager', 'staff'));
