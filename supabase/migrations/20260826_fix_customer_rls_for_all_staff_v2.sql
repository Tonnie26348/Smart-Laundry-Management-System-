-- Fix RLS policy for customers to ensure all staff roles can view them
DROP POLICY IF EXISTS "Staff can view all customers" ON public.customers;

-- Create policy using only valid enum values: 'administrator', 'manager', 'laundry_staff', 'delivery_staff', 'customer'
CREATE POLICY "Staff can view all customers" 
ON public.customers 
FOR SELECT 
USING (
  get_user_role(auth.uid()) IN ('administrator', 'manager', 'laundry_staff', 'delivery_staff')
);
