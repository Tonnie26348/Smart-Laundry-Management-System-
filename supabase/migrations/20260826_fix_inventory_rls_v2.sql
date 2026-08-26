-- 1. Re-enable RLS
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing restrictive policies
DROP POLICY IF EXISTS "Enable read/write access for authorized staff" ON public.inventory_items;

-- 3. Create a more robust policy using valid enum values
-- The valid roles defined in your app are: 'administrator', 'manager', 'laundry_staff', 'delivery_staff', 'customer'
CREATE POLICY "Enable read/write access for authorized staff" 
ON public.inventory_items 
FOR ALL 
USING (
  get_user_role(auth.uid()) IN ('administrator', 'manager', 'laundry_staff')
);
