import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const ChatListPage = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch distinct users messaged by or messaging the current user
      const { data } = await (supabase
        .from('messages')
        .select('sender_id, receiver_id, sender:profiles!messages_sender_id_fkey(full_name), receiver:profiles!messages_receiver_id_fkey(full_name)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`) as any);

      // Simple way to get unique users
      const users: Record<string, any> = {};
      (data as any[])?.forEach(msg => {
        const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        const otherName = msg.sender_id === user.id ? msg.receiver?.full_name : msg.sender?.full_name;
        users[otherId] = otherName;
      });

      setConversations(Object.entries(users).map(([id, name]) => ({ id, name })));
      setLoading(false);
    };
    fetchConversations();
  }, []);

  if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-xl font-bold">Messages</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            {conversations.length === 0 ? (
                <p className="p-4 text-gray-500">No active conversations. Start one from the Employees page.</p>
            ) : (
                conversations.map(c => (
                    <div key={c.id} className="p-4 border-t hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/admin/chat/${c.id}`)}>
                        <p className="font-medium">{c.name}</p>
                    </div>
                ))
            )}
        </div>
      </div>
    </AdminLayout>
  );
};
