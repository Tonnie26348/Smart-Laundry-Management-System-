-- Add INSERT policy for conversations
CREATE POLICY "Users can create conversations" ON conversations
    FOR INSERT WITH CHECK (
        -- Allow users to create conversations if they are part of them.
        -- This requires that the participant is also added in the same transaction
        -- or allowed by some other means.
        -- A simpler approach for now is allowing authenticated users to create.
        auth.role() = 'authenticated'
    );
