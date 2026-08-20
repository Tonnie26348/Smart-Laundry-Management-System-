-- 1. Update deliveries table
ALTER TABLE deliveries 
ADD COLUMN assigned_to UUID REFERENCES profiles(id);

-- 2. Update status constraint
ALTER TABLE deliveries DROP CONSTRAINT deliveries_status_check;

ALTER TABLE deliveries ADD CONSTRAINT deliveries_status_check 
CHECK (status IN ('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed'));

-- 3. Update RLS policies
DROP POLICY IF EXISTS "Staff can view all deliveries" ON deliveries;

CREATE POLICY "Staff can view all deliveries" ON deliveries FOR SELECT USING (get_user_role(auth.uid()) IN ('admin', 'manager', 'staff'));
CREATE POLICY "Delivery staff can view assigned deliveries" ON deliveries FOR SELECT USING (assigned_to = auth.uid());
CREATE POLICY "Delivery staff can update assigned deliveries" ON deliveries FOR UPDATE USING (assigned_to = auth.uid());
