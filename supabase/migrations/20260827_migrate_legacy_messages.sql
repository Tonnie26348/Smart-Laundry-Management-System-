-- Phase 4.2: Legacy Messaging Data Migration
-- Safe migration to move data from public.messages to new conversation architecture

BEGIN;

-- 1. Disable triggers on messages_v2 to prevent conversation/notification side effects
ALTER TABLE public.messages_v2 DISABLE TRIGGER ALL;

-- 2. Identify unique canonical direct-chat pairs
CREATE TEMP TABLE legacy_pairs AS
SELECT DISTINCT
    LEAST(sender_id, receiver_id) as participant_a,
    GREATEST(sender_id, receiver_id) as participant_b,
    MIN(created_at) as first_message_at
FROM public.messages
WHERE sender_id IS NOT NULL AND receiver_id IS NOT NULL
  AND sender_id IN (SELECT id FROM public.profiles)
  AND receiver_id IN (SELECT id FROM public.profiles)
  AND trim(message_text) != ''
GROUP BY 1, 2;

-- 3. Create Conversations
INSERT INTO public.conversations (conversation_type, created_by, created_at, updated_at, last_message_at)
SELECT 
    'direct',
    lp.participant_a,
    lp.first_message_at,
    lp.first_message_at,
    lp.first_message_at
FROM legacy_pairs lp
ON CONFLICT DO NOTHING;

-- 4. Create Participants (Sender & Receiver)
-- Need to map pairs to conversations
CREATE TEMP TABLE conversation_map AS
SELECT c.id AS conversation_id, lp.participant_a, lp.participant_b
FROM public.conversations c
JOIN legacy_pairs lp ON c.created_at = lp.first_message_at AND c.conversation_type = 'direct';

-- Add Sender (A)
INSERT INTO public.conversation_participants (conversation_id, user_id, joined_at)
SELECT conversation_id, participant_a, first_message_at FROM conversation_map cm
JOIN legacy_pairs lp ON cm.participant_a = lp.participant_a AND cm.participant_b = lp.participant_b
ON CONFLICT DO NOTHING;

-- Add Receiver (B)
INSERT INTO public.conversation_participants (conversation_id, user_id, joined_at)
SELECT conversation_id, participant_b, first_message_at FROM conversation_map cm
JOIN legacy_pairs lp ON cm.participant_a = lp.participant_a AND cm.participant_b = lp.participant_b
ON CONFLICT DO NOTHING;

-- 5. Migrate Messages
INSERT INTO public.messages_v2 (id, conversation_id, sender_id, message_text, created_at)
SELECT 
    m.id,
    cm.conversation_id,
    m.sender_id,
    m.message_text,
    m.created_at
FROM public.messages m
JOIN conversation_map cm ON 
    (m.sender_id = cm.participant_a AND m.receiver_id = cm.participant_b) OR
    (m.sender_id = cm.participant_b AND m.receiver_id = cm.participant_a)
WHERE m.sender_id IS NOT NULL AND m.receiver_id IS NOT NULL
  AND m.sender_id IN (SELECT id FROM public.profiles)
  AND m.receiver_id IN (SELECT id FROM public.profiles)
  AND trim(m.message_text) != ''
ON CONFLICT (id) DO NOTHING;

-- 6. Read Receipt Migration (last_read_at)
UPDATE public.conversation_participants cp
SET last_read_at = sub.max_read_at
FROM (
    SELECT 
        m.receiver_id as user_id,
        cm.conversation_id,
        MAX(m.read_at) as max_read_at
    FROM public.messages m
    JOIN conversation_map cm ON 
        (m.sender_id = cm.participant_a AND m.receiver_id = cm.participant_b) OR
        (m.sender_id = cm.participant_b AND m.receiver_id = cm.participant_a)
    WHERE m.read_at IS NOT NULL
    GROUP BY 1, 2
) sub
WHERE cp.conversation_id = sub.conversation_id AND cp.user_id = sub.user_id;

-- 7. Re-enable triggers
ALTER TABLE public.messages_v2 ENABLE TRIGGER ALL;

-- 8. Clean up
DROP TABLE legacy_pairs;
DROP TABLE conversation_map;

COMMIT;
