import { useState, useEffect } from 'react';
import { CustomerLayout } from '@/layouts/CustomerLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const CustomerMessagesPage = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const initChat = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      
      // Find administrator
      const { data: admin } = await (supabase.from('profiles').select('id').eq('role', 'administrator').single() as any);
      if (admin) {
        setAdminId(admin.id);
        
        // Fetch messages
        const { data } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${admin.id}),and(sender_id.eq.${admin.id},receiver_id.eq.${user?.id})`)
          .order('created_at', { ascending: true });
        setMessages(data || []);
      }
      setLoading(false);
    };
    initChat();
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !adminId) return;

    await (supabase.from('messages') as any).insert({
      sender_id: currentUser.id,
      receiver_id: adminId,
      message_text: newMessage
    });
    setNewMessage('');
    
    // Refresh messages
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${adminId}),and(sender_id.eq.${adminId},receiver_id.eq.${currentUser.id})`)
      .order('created_at', { ascending: true });
    setMessages(data || []);
  };

  if (loading) return <CustomerLayout><LoadingSpinner /></CustomerLayout>;

  return (
    <CustomerLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-xl font-bold">Messages</h2>
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
    </CustomerLayout>
  );
};
