import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const PaymentsPage = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('payments').select('*, orders(id)');
      if (error) console.error('Error fetching payments:', error);
      else setPayments(data || []);
      setLoading(false);
    };
    fetchPayments();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Payments</h1>
        {loading ? <LoadingSpinner /> : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead><tr className="bg-gray-100"><th className="p-4">Order ID</th><th className="p-4">Amount</th><th className="p-4">Status</th></tr></thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} className="border-t">
                    <td className="p-4">{p.order_id}</td>
                    <td className="p-4">{p.amount}</td>
                    <td className="p-4">{p.status}</td>
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
