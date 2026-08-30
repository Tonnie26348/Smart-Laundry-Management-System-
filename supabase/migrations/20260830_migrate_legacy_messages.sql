-- 1. Ensure conversation_id column exists in messages
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='conversation_id') THEN
        ALTER TABLE messages ADD COLUMN conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 2. Create a temporary table to hold unique chat pairs
CREATE TEMP TABLE chat_pairs AS 
SELECT DISTINCT
    LEAST(sender_id, receiver_id) as user1,
    GREATEST(sender_id, receiver_id) as user2
FROM messages
WHERE sender_id IS NOT NULL AND receiver_id IS NOT NULL;

-- 3. Create a conversation for each unique pair and map participants
DO $$
DECLARE
    pair RECORD;
    conv_id UUID;
BEGIN
    FOR pair IN SELECT * FROM chat_pairs LOOP
        -- Create the conversation
        INSERT INTO conversations (conversation_type, title, created_by)
        VALUES ('direct', 'Chat between users', pair.user1)
        RETURNING id INTO conv_id;

        -- Add participants
        INSERT INTO conversation_participants (conversation_id, user_id)
        VALUES (conv_id, pair.user1), (conv_id, pair.user2);

        -- Update messages to point to this new conversation
        UPDATE messages
        SET conversation_id = conv_id
        WHERE (sender_id = pair.user1 AND receiver_id = pair.user2)
           OR (sender_id = pair.user2 AND receiver_id = pair.user1);
    END LOOP;
END $$;

-- 4. Cleanup
DROP TABLE chat_pairs;
