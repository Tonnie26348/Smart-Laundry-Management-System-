-- Fix RLS policy for customers to ensure all staff roles can view them
DROP POLICY IF EXISTS "Staff can view all customers" ON public.customers;

CREATE POLICY "Staff can view all customers" 
ON public.customers 
FOR SELECT 
USING (
  get_user_role(auth.uid()) IN ('administrator', 'manager', 'laundry_staff', 'delivery_staff', 'admin', 'staff')
);
