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
      const { data, error } = await supabase
        .from('payments')
        .select('*, orders(order_number)');
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
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-gray-100 text-left border-b border-gray-200">
                  <th className="p-4 w-1/3 font-semibold text-gray-700">Order #</th>
                  <th className="p-4 w-1/3 font-semibold text-gray-700">Amount</th>
                  <th className="p-4 w-1/3 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500 font-medium">No payments found.</td>
                  </tr>
                ) : (
                  payments.map(p => (
                    <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="p-4 truncate">{p.orders?.order_number || 'N/A'}</td>
                      <td className="p-4 font-semibold text-gray-900">KSh {p.amount.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase ${p.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {p.status}
                        </span>
                      </td>
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
