import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Notification, notificationService } from '../notificationService';

export const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await notificationService.getNotifications(userId);
      setNotifications(data);
    };
    fetchNotifications();

    const channel = supabase
      .channel('notification-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  return notifications;
};
