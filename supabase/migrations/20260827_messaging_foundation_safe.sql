-- Phase 3.3.2: Safe Messaging Foundation Migration

-- 1. Create Conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_type TEXT NOT NULL CHECK (conversation_type IN ('direct', 'order', 'group', 'support')),
    title TEXT NULL,
    order_id UUID NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Order uniqueness constraint (partial index)
CREATE UNIQUE INDEX IF NOT EXISTS idx_order_conversations_unique
ON public.conversations (order_id)
WHERE conversation_type = 'order';

-- 3. Create Conversation Participants table
CREATE TABLE IF NOT EXISTS public.conversation_participants (
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
);

-- 4. Create new Messages table (messages_v2)
CREATE TABLE IF NOT EXISTS public.messages_v2 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id),
    message_text TEXT NOT NULL CHECK (char_length(trim(message_text)) > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON public.conversations (last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_order_id ON public.conversations (order_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON public.conversation_participants (user_id, conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_v2_conversation_created_at ON public.messages_v2 (conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_v2_sender_id ON public.messages_v2 (sender_id);

-- 6. Triggers for updated_at / last_message_at
-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_conversations_updated_at ON public.conversations;
CREATE TRIGGER trg_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Trigger for last_message_at
CREATE OR REPLACE FUNCTION public.handle_new_message_v2()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.conversations
    SET last_message_at = NEW.created_at,
        updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_messages_v2_last_message_at ON public.messages_v2;
CREATE TRIGGER trg_messages_v2_last_message_at
AFTER INSERT ON public.messages_v2
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_message_v2();

-- 7. RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages_v2 ENABLE ROW LEVEL SECURITY;

-- Conversations RLS
CREATE POLICY "See conversations I participate in" ON public.conversations
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = conversations.id AND user_id = auth.uid())
);

CREATE POLICY "Allowed to create conversations" ON public.conversations
FOR INSERT WITH CHECK (created_by = auth.uid());

-- Participants RLS
CREATE POLICY "See participants for my conversations" ON public.conversation_participants
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = conversation_participants.conversation_id AND cp.user_id = auth.uid())
);

CREATE POLICY "Update own last_read_at" ON public.conversation_participants
FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Messages RLS
CREATE POLICY "Read messages for my conversations" ON public.messages_v2
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = messages_v2.conversation_id AND cp.user_id = auth.uid())
);

CREATE POLICY "Send message to my conversations" ON public.messages_v2
FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = messages_v2.conversation_id AND cp.user_id = auth.uid())
);

-- 8. Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages_v2;
