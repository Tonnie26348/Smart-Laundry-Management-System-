import { useEffect, useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { notificationService } from '@/features/notifications/notificationService';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNotification, setNewNotification] = useState({ title: '', message: '', profile_id: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [notifs, profs] = await Promise.all([
        notificationService.getAllNotifications(),
        supabase.from('profiles').select('id, full_name')
      ]);
      setNotifications(notifs || []);
      setProfiles(profs.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!newNotification.title || !newNotification.message) return;
    try {
        await notificationService.createNotification(newNotification as any);
        setNewNotification({ title: '', message: '', profile_id: '' });
        fetchData();
        alert('Notification sent!');
    } catch (error) {
        console.error('Error creating notification:', error);
        alert('Failed to send notification');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Notification Management</h1>
        
        <div className="bg-white p-6 shadow rounded-lg border border-gray-200 space-y-4">
            <h2 className="font-bold">Send New Notification</h2>
            <select className="w-full border p-2 rounded" value={newNotification.profile_id} onChange={e => setNewNotification({...newNotification, profile_id: e.target.value})}>
                <option value="">All Users</option>
                {profiles.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
            </select>
            <Input placeholder="Title" value={newNotification.title} onChange={e => setNewNotification({...newNotification, title: e.target.value})} />
            <Input placeholder="Message" value={newNotification.message} onChange={e => setNewNotification({...newNotification, message: e.target.value})} />
            <Button onClick={handleCreate}>Send Notification</Button>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gray-100 text-left border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-700">Recipient</th>
                  <th className="p-4 font-semibold text-gray-700">Title</th>
                  <th className="p-4 font-semibold text-gray-700">Message</th>
                  <th className="p-4 font-semibold text-gray-700">Status</th>
                  <th className="p-4 font-semibold text-gray-700">Created At</th>
                </tr>
              </thead>
              <tbody>
                {notifications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">No notifications found.</td>
                  </tr>
                ) : (
                  notifications.map(n => (
                    <tr key={n.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="p-4">{n.profiles?.full_name || 'All'}</td>
                      <td className="p-4 font-medium">{n.title}</td>
                      <td className="p-4">{n.message}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${n.is_read ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'}`}>
                          {n.is_read ? 'Read' : 'Unread'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{format(new Date(n.created_at), 'PPPp')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
