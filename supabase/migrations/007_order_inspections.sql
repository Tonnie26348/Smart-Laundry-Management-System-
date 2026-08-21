-- 1. Item Inspections
CREATE TABLE item_inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
    condition TEXT NOT NULL,
    damage_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Item Photos
CREATE TABLE item_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_id UUID REFERENCES item_inspections(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE item_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_photos ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Staff can manage inspections/photos
CREATE POLICY "Staff can manage inspections" ON item_inspections FOR ALL USING (get_user_role(auth.uid()) IN ('administrator', 'manager', 'laundry_staff'));
CREATE POLICY "Staff can manage photos" ON item_photos FOR ALL USING (get_user_role(auth.uid()) IN ('administrator', 'manager', 'laundry_staff'));

-- Customers can view inspections (visible records)
CREATE POLICY "Customers can view own inspections" ON item_inspections FOR SELECT USING (order_item_id IN (
    SELECT oi.id FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE o.customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
));
