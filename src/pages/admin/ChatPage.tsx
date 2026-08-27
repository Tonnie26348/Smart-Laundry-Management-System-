import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ChatBox } from '@/components/chat/ChatBox';

export const ChatPage = () => {
  const { receiverId } = useParams<{ receiverId: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchMessages = async () => {
    if (!currentUser || !receiverId) return;
    const { data } = await supabase
      .from('messages')
      .select('*, profiles!messages_sender_id_fkey(full_name)')
      .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${currentUser.id})`)
      .order('created_at', { ascending: true });
    setMessages(data || []);
  };

  useEffect(() => {
    const initChat = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (user && receiverId) {
        await fetchMessages();
      }
      setLoading(false);
    };
    initChat();
  }, [receiverId]);

  const sendMessage = async (text: string) => {
    if (!currentUser || !receiverId) return;

    await (supabase.from('messages') as any).insert({
      sender_id: currentUser.id,
      receiver_id: receiverId,
      message_text: text
    });
    await fetchMessages();
  };

  if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-xl font-bold">Chat</h2>
        <ChatBox 
          messages={messages} 
          currentUserId={currentUser?.id} 
          onSendMessage={sendMessage}
        />
      </div>
    </AdminLayout>
  );
};
