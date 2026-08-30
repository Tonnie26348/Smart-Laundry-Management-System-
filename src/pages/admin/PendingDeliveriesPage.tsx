import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const PendingDeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    setLoading(true);
    // Fetch non-delivered
    const { data, error } = await supabase
      .from('deliveries')
      .select('*, orders(order_number, customers(phone, profiles(full_name)))')
      .neq('status', 'delivered')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching deliveries:', error);
    else setDeliveries(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const updateDeliveryStatus = async (id: string, status: string) => {
    const { error } = await (supabase.from('deliveries') as any)
      .update({ status })
      .eq('id', id);

    if (error) {
        alert('Failed to update status: ' + error.message);
    } else {
        fetchDeliveries();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Pending Deliveries</h1>
        {loading ? <LoadingSpinner /> : (
          <div className="space-y-4">
            {deliveries.length === 0 ? (
              <Card className="p-8 text-center text-gray-500">No pending deliveries.</Card>
            ) : (
              deliveries.map(delivery => (
                <Card key={delivery.id} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-bold">Order #{delivery.orders?.order_number}</p>
                      <p>Customer: {delivery.orders?.customers?.profiles?.full_name}</p>
                      <p>Phone: {delivery.orders?.customers?.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pickup: {delivery.pickup_address}</p>
                      <p className="text-sm text-gray-600">Delivery: {delivery.delivery_address}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" onClick={() => updateDeliveryStatus(delivery.id, 'picked_up')}>Picked Up</Button>
                    <Button size="sm" onClick={() => updateDeliveryStatus(delivery.id, 'delivered')} className="bg-green-600">Delivered</Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
