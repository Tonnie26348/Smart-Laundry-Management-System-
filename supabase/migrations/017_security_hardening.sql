-- 1. Tighten Order Management RLS
DROP POLICY IF EXISTS "Admin/Manager/Staff can manage all orders" ON orders;
DROP POLICY IF EXISTS "Admin/Manager/Staff can manage all order items" ON order_items;

CREATE POLICY "Admin/Manager can manage all orders" ON orders FOR ALL USING (get_user_role(auth.uid()) IN ('administrator', 'manager'));
CREATE POLICY "Laundry staff can view and update order status" ON orders FOR SELECT USING (get_user_role(auth.uid()) = 'laundry_staff');
CREATE POLICY "Laundry staff can update order status" ON orders FOR UPDATE USING (get_user_role(auth.uid()) = 'laundry_staff');

CREATE POLICY "Admin/Manager can manage all order items" ON order_items FOR ALL USING (get_user_role(auth.uid()) IN ('administrator', 'manager'));
CREATE POLICY "Laundry staff can view all order items" ON order_items FOR SELECT USING (get_user_role(auth.uid()) = 'laundry_staff');

-- 2. Storage Security
-- (This assumes the bucket is created in Supabase Dashboard)
-- Create policy to allow staff to upload photos
CREATE POLICY "Staff can upload photos" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'item-photos' AND 
  get_user_role(auth.uid()) IN ('administrator', 'manager', 'laundry_staff')
);
CREATE POLICY "Everyone can view photos" ON storage.objects FOR SELECT USING (bucket_id = 'item-photos');
