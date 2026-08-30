import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ChatBox } from '@/components/chat/ChatBox';

export const ChatPage = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initChat = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      setLoading(false);
    };
    initChat();
  }, []);

  if (loading || !currentUser) return <AdminLayout><LoadingSpinner /></AdminLayout>;
  if (!conversationId) return <AdminLayout><div>No conversation selected</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-xl font-bold">Chat</h2>
        <ChatBox 
          conversationId={conversationId}
          currentUserId={currentUser.id} 
        />
      </div>
    </AdminLayout>
  );
};
