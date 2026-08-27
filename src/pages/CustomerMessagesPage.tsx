import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ChatBox } from '@/components/chat/ChatBox';

export const CustomerMessagesPage = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchMessages = async (userId: string, adminId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*, profiles!messages_sender_id_fkey(full_name)')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${adminId}),and(sender_id.eq.${adminId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true });
    setMessages(data || []);
  };

  useEffect(() => {
    const initChat = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      
      // Find administrator
      const { data: admin } = await (supabase.from('profiles').select('id').eq('role', 'administrator').single() as any);
      if (admin && user) {
        setAdminId(admin.id);
        await fetchMessages(user.id, admin.id);
      }
      setLoading(false);
    };
    initChat();
  }, []);

  const sendMessage = async (text: string) => {
    if (!currentUser || !adminId) return;

    await (supabase.from('messages') as any).insert({
      sender_id: currentUser.id,
      receiver_id: adminId,
      message_text: text
    });
    
    await fetchMessages(currentUser.id, adminId);
  };

  const refreshMessages = async () => {
      if (currentUser && adminId) {
          await fetchMessages(currentUser.id, adminId);
      }
  };

  if (loading) return <LoadingSpinner />;

  return (
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-xl font-bold">Messages</h2>
        <ChatBox 
          messages={messages} 
          currentUserId={currentUser?.id} 
          onSendMessage={sendMessage}
          onRefresh={refreshMessages}
        />
      </div>
  );
};
