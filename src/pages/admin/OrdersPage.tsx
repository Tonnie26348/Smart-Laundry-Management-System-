import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('orders').select('*, customers(profile_id, profiles(full_name))');
    
    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await (supabase.from('orders') as any).update({ status: newStatus }).eq('id', id);
    if (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status: ' + error.message);
    } else {
      // Update local state immediately to reflect change
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        {loading ? <LoadingSpinner /> : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead><tr className="bg-gray-100 text-left"><th className="p-4">Order #</th><th className="p-4">Customer</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-t">
                    <td className="p-4">{o.order_number}</td>
                    <td className="p-4">{o.customers?.profiles?.full_name}</td>
                    <td className="p-4 capitalize">{o.status}</td>
                    <td className="p-4">
                      <select onChange={(e) => updateStatus(o.id, e.target.value)} value={o.status}>
                        <option value="pending">Pending</option>
                        <option value="washing">Washing</option>
                        <option value="ready">Ready</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
