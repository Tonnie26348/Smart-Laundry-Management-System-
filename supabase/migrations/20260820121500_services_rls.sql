-- Enable RLS on services and laundry_items
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE laundry_items ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read services and items
CREATE POLICY "Everyone can view services" ON services FOR SELECT USING (true);
CREATE POLICY "Everyone can view laundry items" ON laundry_items FOR SELECT USING (true);

-- Allow Admins/Managers to modify
CREATE POLICY "Admins can modify services" ON services FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'manager'));
CREATE POLICY "Admins can modify laundry items" ON laundry_items FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'manager'));
