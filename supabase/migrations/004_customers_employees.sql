-- 1. Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    phone TEXT,
    address TEXT,
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Employees table
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    hire_date DATE DEFAULT CURRENT_DATE,
    salary DECIMAL(10, 2),
    position TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS Policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Customers can view/update own info
CREATE POLICY "Customers can view own record" ON customers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Customers can update own record" ON customers FOR UPDATE USING (user_id = auth.uid());

-- Admin/Manager can view/manage all
CREATE POLICY "Admin/Manager can manage all customers" ON customers FOR ALL USING (get_user_role(auth.uid()) IN ('administrator', 'manager'));
CREATE POLICY "Admin/Manager can manage employees" ON employees FOR ALL USING (get_user_role(auth.uid()) IN ('administrator', 'manager'));
CREATE POLICY "Employees can view own record" ON employees FOR SELECT USING (user_id = auth.uid());
