-- Drop old conflicting policy
DROP POLICY IF EXISTS "Admin/Manager can manage all deliveries" ON public.deliveries;

-- Create comprehensive Admin/Manager policy for all operations
CREATE POLICY "Admin/Manager can manage all deliveries" ON public.deliveries
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('administrator', 'manager')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('administrator', 'manager')
  )
);
