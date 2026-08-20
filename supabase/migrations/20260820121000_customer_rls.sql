-- Enable RLS on customers
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Customers can view/update own record
CREATE POLICY "Customers can view own record" ON customers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Customers can update own record" ON customers FOR UPDATE USING (user_id = auth.uid());

-- Staff/Admins can view all
CREATE POLICY "Staff can view all customers" ON customers FOR SELECT USING (get_user_role(auth.uid()) IN ('admin', 'manager', 'staff'));
CREATE POLICY "Admins can insert/update customers" ON customers FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'manager'));
