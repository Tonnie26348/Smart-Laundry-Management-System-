-- 1. Suppliers Table
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    contact TEXT
);

-- 2. Inventory Items Table
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

-- 3. Inventory Transactions Table
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('addition', 'deduction')),
    quantity DECIMAL(10, 2) NOT NULL,
    reason TEXT,
    performed_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- Policies (Staff/Admin access only)
CREATE POLICY "Staff can access suppliers" ON suppliers FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'manager', 'staff'));
CREATE POLICY "Staff can access inventory items" ON inventory_items FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'manager', 'staff'));
CREATE POLICY "Staff can access transactions" ON inventory_transactions FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'manager', 'staff'));
