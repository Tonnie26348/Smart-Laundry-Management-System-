import { useState, useEffect } from 'react';
import { CustomerLayout } from '@/layouts/CustomerLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';

export const CustomerOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        setLoading(false);
        return;
    }

    // Fetch customer ID first
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (customer) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_id', customer.id)
          .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching orders:', error);
        } else {
            setOrders(data || []);
        }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        {loading ? <LoadingSpinner /> : (
          <div className="space-y-4">
            {orders.length === 0 ? (
                <Card className="p-8 text-center text-gray-500">No orders found.</Card>
            ) : (
                orders.map(o => (
                    <Card key={o.id} className="p-4 flex justify-between items-center">
                        <div>
                            <p className="font-bold">Order #{o.order_number}</p>
                            <p className="text-sm text-gray-500">Status: <span className="capitalize">{o.status}</span></p>
                        </div>
                        <p className="font-bold">KSh {o.total_amount}</p>
                    </Card>
                ))
            )}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};
