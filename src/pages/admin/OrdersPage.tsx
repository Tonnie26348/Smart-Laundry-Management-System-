import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { invoiceService } from '@/services/invoiceService';

export const OrdersPage = () => { // Forced update
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('orders').select('*, customers(*, profiles(*)), order_items(*, laundry_item_services(*, services(*))), payments(*)');
    
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

  const updateStatus = async (order: any, newStatus: string) => {
    const statusOrder = ['pending', 'washing', 'ready', 'completed'];
    const currentIndex = statusOrder.indexOf(order.status);
    const newIndex = statusOrder.indexOf(newStatus);

    if (newIndex < currentIndex) {
      alert('Cannot revert order status.');
      return;
    }

    // 1. Optimistic update
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));

    // 2. Perform the update
    const { error } = await (supabase.from('orders') as any).update({ status: newStatus }).eq('id', order.id);
    
    if (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status: ' + error.message);
      // 3. Rollback on failure
      fetchOrders(); 
    } else {
      // 4. Force a fresh fetch to ensure data integrity
      fetchOrders();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        {loading ? <LoadingSpinner /> : (
          <div className="bg-white shadow rounded-lg overflow-hidden overflow-x-auto">
            <table className="min-w-full">
              <thead><tr className="bg-gray-100 text-left"><th className="p-4">Order #</th><th className="p-4">Customer</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-t">
                    <td className="p-4">{o.order_number}</td>
                    <td className="p-4">{o.customers?.profiles?.full_name}</td>
                    <td className="p-4 capitalize">{o.status}</td>
                    <td className="p-4 flex gap-2">
                      <select onChange={(e) => updateStatus(o, e.target.value)} value={o.status}>
                        <option value="pending">Pending</option>
                        <option value="washing">Washing</option>
                        <option value="ready">Ready</option>
                        <option value="completed">Completed</option>
                      </select>
                      {o.status === 'completed' && (
                        <Button size="sm" onClick={() => invoiceService.downloadReceipt(o)}>Receipt</Button>
                      )}
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
