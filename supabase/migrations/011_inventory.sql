-- 1. Suppliers
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    contact_email TEXT,
    contact_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Inventory Items
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    current_stock DECIMAL(10, 2) NOT NULL DEFAULT 0,
    min_stock_level DECIMAL(10, 2) NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    supplier_id UUID REFERENCES suppliers(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Inventory Transactions
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('addition', 'deduction')),
    quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
    reason TEXT,
    performed_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RLS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- Policies: Staff/Admin only
CREATE POLICY "Admin/Manager/Staff can manage inventory" ON inventory_items FOR ALL USING (get_user_role(auth.uid()) IN ('administrator', 'manager', 'laundry_staff'));
CREATE POLICY "Admin/Manager/Staff can manage suppliers" ON suppliers FOR ALL USING (get_user_role(auth.uid()) IN ('administrator', 'manager', 'laundry_staff'));
CREATE POLICY "Admin/Manager/Staff can manage inventory transactions" ON inventory_transactions FOR ALL USING (get_user_role(auth.uid()) IN ('administrator', 'manager', 'laundry_staff'));
