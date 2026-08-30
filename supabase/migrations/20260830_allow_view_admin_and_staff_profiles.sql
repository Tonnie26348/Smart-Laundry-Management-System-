-- Update policy to allow authenticated users to view administrator OR delivery_staff profiles
DROP POLICY IF EXISTS "Allow view administrator profiles" ON profiles;
CREATE POLICY "Allow view admin and delivery staff profiles" ON profiles
    FOR SELECT USING (role IN ('administrator', 'delivery_staff'));
