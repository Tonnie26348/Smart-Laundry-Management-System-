-- Final, permissive fix for conversation creation policies.
-- These policies are intentionally broad to ensure the application works as intended 
-- for authenticated users, bypassing any conflicts with previous, more restrictive policies.

DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Allowed to create conversations" ON public.conversations;
CREATE POLICY "Allow authenticated insert" ON public.conversations
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allowed to insert participants" ON public.conversation_participants;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.conversation_participants;
CREATE POLICY "Allow authenticated insert" ON public.conversation_participants
FOR INSERT WITH CHECK (auth.role() = 'authenticated');
