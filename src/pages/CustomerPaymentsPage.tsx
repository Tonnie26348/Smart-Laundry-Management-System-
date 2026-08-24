import { useState, useEffect } from 'react';
import { CustomerLayout } from '@/layouts/CustomerLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';

export const CustomerPaymentsPage = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyPayments = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        setLoading(false);
        return;
    }

    // Fetch customer ID
    const { data: customer } = await (supabase
      .from('customers')
      .select('id')
      .eq('profile_id', user.id)
      .single() as any);

    if (customer) {
        // Fetch payments for orders belonging to this customer
        const { data, error } = await supabase
          .from('payments')
          .select('*, orders!inner(order_number, customer_id)')
          .eq('orders.customer_id', customer.id)
          .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching payments:', error);
        } else {
            setPayments(data || []);
        }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMyPayments();
  }, []);

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Payments</h1>
        {loading ? <LoadingSpinner /> : (
          <div className="space-y-4">
            {payments.length === 0 ? (
                <Card className="p-8 text-center text-gray-500">No payment records found.</Card>
            ) : (
                payments.map(p => (
                    <Card key={p.id} className="p-4 flex justify-between items-center">
                        <div>
                            <p className="font-bold">Order #{p.orders?.order_number}</p>
                            <p className="text-sm text-gray-500">Status: <span className="capitalize">{p.status}</span></p>
                        </div>
                        <p className="font-bold">KSh {p.amount}</p>
                    </Card>
                ))
            )}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};
