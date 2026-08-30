-- Drop restrictive delivery staff policies
DROP POLICY IF EXISTS "Delivery staff can view assigned deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Delivery staff can update assigned deliveries" ON public.deliveries;

-- Create robust policies for delivery staff
CREATE POLICY "Delivery staff can view assigned deliveries" ON public.deliveries
FOR SELECT 
USING (assigned_to = auth.uid());

CREATE POLICY "Delivery staff can update assigned deliveries" ON public.deliveries
FOR UPDATE 
USING (assigned_to = auth.uid())
WITH CHECK (assigned_to = auth.uid());
