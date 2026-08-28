import { useEffect, useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { loyaltyService } from '@/features/loyalty/loyaltyService';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { format } from 'date-fns';

export const LoyaltyPage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const data = await loyaltyService.getAllLoyaltyTransactions();
        setTransactions(data || []);
      } catch (error) {
        console.error('Error fetching loyalty transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Loyalty Program Management</h1>
        {loading ? <LoadingSpinner /> : (
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-left border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-700">Customer</th>
                  <th className="p-4 font-semibold text-gray-700">Points Change</th>
                  <th className="p-4 font-semibold text-gray-700">Reason</th>
                  <th className="p-4 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500 font-medium">No loyalty transactions found.</td>
                  </tr>
                ) : (
                  transactions.map(t => (
                    <tr key={t.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="p-4">{t.customers?.full_name || 'N/A'}</td>
                      <td className={`p-4 font-semibold ${t.points_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {t.points_change > 0 ? '+' : ''}{t.points_change}
                      </td>
                      <td className="p-4">{t.reason}</td>
                      <td className="p-4 text-gray-500">{format(new Date(t.created_at), 'PPPp')}</td>
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
