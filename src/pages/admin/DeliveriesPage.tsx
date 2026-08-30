import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { MessageUserButton } from '@/components/chat/MessageUserButton';

export const DeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('deliveries')
      .select('*, orders(order_number), customers(profile_id, profiles(full_name))');
    if (error) console.error('Error fetching deliveries:', error);
    else setDeliveries(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await (supabase.from('deliveries') as any).update({ status: newStatus }).eq('id', id);
    if (error) alert('Failed to update status');
    else fetchDeliveries();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Deliveries</h1>
        {loading ? <LoadingSpinner /> : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead><tr className="bg-gray-100 text-left"><th className="p-4">Order #</th><th className="p-4">Customer</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
              <tbody>
                {deliveries.map(d => (
                  <tr key={d.id} className="border-t">
                    <td className="p-4">{d.orders?.order_number}</td>
                    <td className="p-4">{d.customers?.profiles?.full_name}</td>
                    <td className="p-4 capitalize">{d.status}</td>
                    <td className="p-4 flex gap-2">
                      <Button size="sm" onClick={() => updateStatus(d.id, 'picked_up')}>Picked Up</Button>
                      <Button size="sm" onClick={() => updateStatus(d.id, 'delivered')}>Delivered</Button>
                      <MessageUserButton profileId={d.customers?.profile_id} label="Chat Customer" />
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
