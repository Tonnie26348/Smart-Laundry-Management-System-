-- 1. System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policy
CREATE POLICY "Admin can manage system settings" ON system_settings 
FOR ALL 
USING (get_user_role(auth.uid()) IN ('administrator', 'manager'))
WITH CHECK (get_user_role(auth.uid()) IN ('administrator', 'manager'));

-- 4. Enable Read for everyone
CREATE POLICY "Everyone can view settings" ON system_settings 
FOR SELECT 
USING (true);
