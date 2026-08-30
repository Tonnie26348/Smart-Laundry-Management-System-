-- Allow authenticated users to view administrator profiles
-- This is necessary so customers can discover the administrator to start a support chat.
CREATE POLICY "Allow view administrator profiles" ON profiles
    FOR SELECT USING (role = 'administrator');
