import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ChatLayout } from '@/features/messaging/components/ChatLayout';
import { ConversationList } from '@/features/messaging/components/ConversationList';
import { MessageList } from '@/features/messaging/components/MessageList';
import { MessageComposer } from '@/features/messaging/components/MessageComposer';
import { useConversations } from '@/features/messaging/hooks/useConversations';
import { useMessages } from '@/features/messaging/hooks/useMessages';
import { useConversation } from '@/features/messaging/hooks/useConversation';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { messagingService } from '@/features/messaging/services/messagingService';
import { ConversationWithParticipants } from '@/features/messaging/types/messaging';

export const MessagingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeConvId = searchParams.get('conversationId');
  const { conversations, loading: convLoading } = useConversations();
  const { conversation } = useConversation(activeConvId || '');
  const { messages, sendMessage, loading: msgLoading } = useMessages(activeConvId || '');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useState(() => {
    supabase.auth.getUser().then(res => setCurrentUser(res.data.user));
  });

  const setActiveConvId = (id: string) => {
      setSearchParams({ conversationId: id });
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Messages</h1>
            <Button onClick={async () => {
                const convId = await messagingService.createSupportConversation();
                setActiveConvId(convId);
            }}>New Support Request</Button>
        </div>
        {convLoading ? <LoadingSpinner /> : (
            <ChatLayout 
                sidebar={<ConversationList conversations={conversations as unknown as ConversationWithParticipants[]} activeConversationId={activeConvId || undefined} onSelect={setActiveConvId} />}
                content={activeConvId ? (
                    <>
                        <div className="p-4 border-b font-bold">{conversation?.title || 'Chat'}</div>
                        <MessageList messages={messages} currentUserId={currentUser?.id} />
                        <MessageComposer onSendMessage={sendMessage} isLoading={msgLoading} />
                    </>
                ) : <div className="p-4">Select a conversation</div>}
            />
        )}
      </div>
    </AdminLayout>
  );
};
