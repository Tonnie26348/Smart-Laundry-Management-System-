import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';

export const StaffNotificationsView = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        setLoading(false);
        return;
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Error fetching notifications:', error);
    } else {
        setNotifications(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Notifications</h1>
      {loading ? <LoadingSpinner /> : (
        <div className="space-y-4">
          {notifications.length === 0 ? (
              <Card className="p-8 text-center text-gray-500">No notifications found.</Card>
          ) : (
              notifications.map(n => (
                  <Card key={n.id} className="p-4 border-l-4 border-blue-500">
                      <p className="font-bold">{n.title}</p>
                      <p className="text-sm text-gray-600">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(n.created_at).toLocaleString()}</p>
                  </Card>
              ))
          )}
        </div>
      )}
    </div>
  );
};
