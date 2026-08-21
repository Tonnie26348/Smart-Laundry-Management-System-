-- Refine Audit Logs RLS Policy to strictly limit read access to 'administrator' only
DROP POLICY IF EXISTS "Staff can view logs" ON audit_logs;

CREATE POLICY "Only administrator can view audit logs" 
ON audit_logs 
FOR SELECT 
USING (get_user_role(auth.uid()) = 'administrator');
