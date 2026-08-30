-- Drop the potentially problematic role-based policy
DROP POLICY IF EXISTS "Admin/Manager can manage all deliveries" ON public.deliveries;

-- Create a more robust policy for administrators
CREATE POLICY "Admin/Manager can manage all deliveries" ON public.deliveries
FOR ALL USING (
  -- Use direct profile lookup as a fallback if the function is unreliable
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('administrator', 'manager')
  )
);
