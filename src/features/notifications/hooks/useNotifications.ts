import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Notification, notificationService } from '../notificationService';

export const useNotifications = (profileId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await notificationService.getNotifications(profileId);
      setNotifications(data);
    };
    fetchNotifications();

    const channel = supabase
      .channel('notification-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `profile_id=eq.${profileId}` },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profileId]);

  return notifications;
};
