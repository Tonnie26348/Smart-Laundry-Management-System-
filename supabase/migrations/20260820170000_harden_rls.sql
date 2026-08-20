-- Harden Profiles Policies
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Harden Orders Policies
CREATE POLICY "Staff can update order status" ON orders FOR UPDATE USING (get_user_role(auth.uid()) IN ('admin', 'manager', 'staff'));
CREATE POLICY "Customers can only view own orders" ON orders FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

-- Audit table RLS (Write only, no delete/update for anyone)
CREATE POLICY "Staff can view logs" ON audit_logs FOR SELECT USING (get_user_role(auth.uid()) IN ('admin', 'manager'));
CREATE POLICY "System can insert logs" ON audit_logs FOR INSERT WITH CHECK (true);
