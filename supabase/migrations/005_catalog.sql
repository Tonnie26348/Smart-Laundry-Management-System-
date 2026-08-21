-- Service Categories
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES service_categories(id),
    name TEXT NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Item Categories
CREATE TABLE item_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Laundry Items
CREATE TABLE laundry_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES item_categories(id),
    name TEXT NOT NULL,
    price_adjustment DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE laundry_items ENABLE ROW LEVEL SECURITY;

-- Everyone can view catalog
CREATE POLICY "Everyone can view service categories" ON service_categories FOR SELECT USING (true);
CREATE POLICY "Everyone can view services" ON services FOR SELECT USING (true);
CREATE POLICY "Everyone can view item categories" ON item_categories FOR SELECT USING (true);
CREATE POLICY "Everyone can view laundry items" ON laundry_items FOR SELECT USING (true);

-- Admin/Manager can manage catalog
CREATE POLICY "Admin/Manager can manage service categories" ON service_categories FOR ALL USING (get_user_role(auth.uid()) IN ('administrator', 'manager'));
CREATE POLICY "Admin/Manager can manage services" ON services FOR ALL USING (get_user_role(auth.uid()) IN ('administrator', 'manager'));
CREATE POLICY "Admin/Manager can manage item categories" ON item_categories FOR ALL USING (get_user_role(auth.uid()) IN ('administrator', 'manager'));
CREATE POLICY "Admin/Manager can manage laundry items" ON laundry_items FOR ALL USING (get_user_role(auth.uid()) IN ('administrator', 'manager'));
