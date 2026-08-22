import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('orders').select('*, customers(profiles(full_name))');
      if (error) console.error('Error fetching orders:', error);
      else setOrders(data || []);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        {loading ? <LoadingSpinner /> : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead><tr className="bg-gray-100"><th className="p-4">Customer</th><th className="p-4">Status</th><th className="p-4">Total</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-t">
                    <td className="p-4">{o.customers?.profiles?.full_name}</td>
                    <td className="p-4">{o.status}</td>
                    <td className="p-4">{o.total_amount}</td>
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
