import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const ChatPage = () => {
  const { receiverId } = useParams<{ receiverId: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (user && receiverId) {
        // Fetch initial messages
        const { data } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: true });
        setMessages(data || []);
      }
      setLoading(false);
    };
    fetchUserAndMessages();
  }, [receiverId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !receiverId) return;

    await supabase.from('messages').insert({
      sender_id: currentUser.id,
      receiver_id: receiverId,
      message_text: newMessage
    });
    setNewMessage('');
    // Refresh messages (simple approach)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${currentUser.id})`)
      .order('created_at', { ascending: true });
    setMessages(data || []);
  };

  if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-xl font-bold">Chat</h2>
        <div className="h-96 overflow-y-auto border p-4 space-y-2 bg-white rounded">
          {messages.map(m => (
            <div key={m.id} className={`p-2 rounded ${m.sender_id === currentUser?.id ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}>
              {m.message_text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </AdminLayout>
  );
};
