-- Drop potentially conflicting or overly restrictive policies
DROP POLICY IF EXISTS "Allow view administrator profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow view admin and delivery staff profiles" ON public.profiles;

-- Create a single, unambiguous policy for admin and staff discovery
CREATE POLICY "Allow authenticated users to view admin and delivery staff" ON public.profiles
    FOR SELECT 
    USING (role IN ('administrator', 'delivery_staff'));
