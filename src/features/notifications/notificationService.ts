/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export const notificationService = {
  async createNotification(notification: Omit<Notification, 'id' | 'is_read' | 'created_at'>) {
    const { error } = await (supabase.from('notifications') as any).insert({
      ...notification,
      type: notification.type || 'system',
      is_read: false
    });
    if (error) throw error;
  },
  async getAllNotifications(): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async getNotifications(profileId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Notification[];
  },
  async markAsRead(notificationId: string) {
    const { error } = await (supabase.from('notifications') as any)
      .update({ is_read: true })
      .eq('id', notificationId);
    if (error) throw error;
  }
};
