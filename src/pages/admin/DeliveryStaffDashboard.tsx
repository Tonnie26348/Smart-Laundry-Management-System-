import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';

export const DeliveryStaffDashboard = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignedDeliveries = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        setLoading(false);
        return;
    }

    const { data, error } = await supabase
      .from('deliveries')
      .select('*, orders(order_number)')
      .eq('assigned_to', user.id);
      
    if (error) {
        console.error('Error fetching deliveries:', error);
    } else {
        setDeliveries(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssignedDeliveries();
  }, []);

  const updateDeliveryStatus = async (id: string, status: string) => {
    const { error } = await (supabase.from('deliveries') as any)
      .update({ status })
      .eq('id', id);

    if (error) {
        alert('Failed to update status');
    } else {
        fetchAssignedDeliveries();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Delivery Staff Dashboard</h2>
        
        {loading ? <LoadingSpinner /> : (
            <div className="space-y-4">
                {deliveries.length === 0 ? (
                    <Card>No assigned deliveries.</Card>
                ) : (
                    deliveries.map(delivery => (
                        <Card key={delivery.id} className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg">Order #{delivery.orders?.order_number}</h3>
                                    <p className="text-sm text-gray-600">Type: <span className="capitalize">{delivery.delivery_type}</span></p>
                                    <p className="text-sm text-gray-600">Pickup: {delivery.pickup_address}</p>
                                    <p className="text-sm text-gray-600">Delivery: {delivery.delivery_address}</p>
                                    <p className="text-sm font-medium mt-2">Status: <span className="capitalize text-primary-600">{delivery.status}</span></p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {delivery.status !== 'delivered' && (
                                        <>
                                            <Button size="sm" onClick={() => updateDeliveryStatus(delivery.id, 'picked_up')}>Picked Up</Button>
                                            <Button size="sm" onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}>Confirm Delivery</Button>
                                        </>
                                    )}
                                </div>
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
