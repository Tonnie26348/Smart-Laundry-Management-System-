-- 1. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "See conversations I participate in" ON public.conversations;
DROP POLICY IF EXISTS "Allowed to create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;

-- 2. Re-create robust policies
CREATE POLICY "See conversations I participate in" ON public.conversations
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = conversations.id AND user_id = auth.uid())
);

CREATE POLICY "Allowed to create conversations" ON public.conversations
FOR INSERT WITH CHECK (created_by = auth.uid());

-- Ensure conversation_participants INSERT policy exists
DROP POLICY IF EXISTS "Allowed to insert participants" ON public.conversation_participants;
CREATE POLICY "Allowed to insert participants" ON public.conversation_participants
FOR INSERT WITH CHECK (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = conversation_participants.conversation_id AND cp.user_id = auth.uid()));
