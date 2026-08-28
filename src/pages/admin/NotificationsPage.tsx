import { useEffect, useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { notificationService } from '@/features/notifications/notificationService';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { format } from 'date-fns';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await notificationService.getAllNotifications();
        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Notification Management</h1>
        {loading ? <LoadingSpinner /> : (
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full">
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
                      <td className="p-4">{n.profiles?.full_name || 'N/A'}</td>
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
