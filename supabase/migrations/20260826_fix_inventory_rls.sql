-- 1. Re-enable RLS
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing restrictive policies to start fresh
DROP POLICY IF EXISTS "Admin/Manager/Staff can manage inventory" ON public.inventory_items;
DROP POLICY IF EXISTS "Staff can access inventory items" ON public.inventory_items;

-- 3. Create a more robust policy
CREATE POLICY "Enable read/write access for authorized staff" 
ON public.inventory_items 
FOR ALL 
USING (
  get_user_role(auth.uid()) IN ('administrator', 'manager', 'laundry_staff', 'admin', 'staff')
);
