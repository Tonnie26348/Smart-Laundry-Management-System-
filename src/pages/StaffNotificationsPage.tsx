import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';

export const StaffNotificationsPage = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) console.error('Error fetching staff notifications:', error);
      else setNotifications(data || []);
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    await (supabase.from('notifications') as any).update({ is_read: true }).eq('id', id);
    setNotifications(notifications.map(n => n.id === id ? {...n, is_read: true} : n));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Notifications</h1>
      {loading ? <LoadingSpinner /> : (
        <div className="space-y-4">
          {notifications.map(n => (
            <div key={n.id} className={`p-4 border rounded-lg ${n.is_read ? 'bg-gray-50' : 'bg-white border-primary-200'}`}>
              <div className="flex justify-between">
                <h3 className="font-bold">{n.title}</h3>
                <span className="text-xs text-gray-500">{format(new Date(n.created_at), 'PPPp')}</span>
              </div>
              <p className="text-sm mt-1">{n.message}</p>
              {!n.is_read && (
                <Button size="sm" variant="outline" className="mt-2" onClick={() => markAsRead(n.id)}>Mark as Read</Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
