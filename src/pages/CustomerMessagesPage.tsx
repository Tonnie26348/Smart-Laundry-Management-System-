import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ConversationList } from '@/features/messaging/components/ConversationList';
import { ChatBox } from '@/components/chat/ChatBox';

export const CustomerMessagesPage = () => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      setLoading(false);
    };
    init();
  }, []);

  if (loading || !currentUser) return <LoadingSpinner />;

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6">
      <div className="w-1/3 border-r pr-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Conversations</h2>
        <ConversationList onSelectConversation={setConversationId} />
      </div>
      <div className="flex-1">
        {conversationId ? (
          <ChatBox conversationId={conversationId} currentUserId={currentUser.id} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};
