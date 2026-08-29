import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { invoiceService } from '@/services/invoiceService';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const ReceiptsPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*, customers(*, profiles(*)), order_items(*, laundry_item_services(*, services(*))), payments(*)')
        .eq('status', 'completed');
      
      if (error) console.error('Error fetching receipts:', error);
      else setOrders(data || []);
      setLoading(false);
    };
    fetchCompletedOrders();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Receipts</h1>
      {loading ? <LoadingSpinner /> : (
        <div className="bg-white shadow rounded-lg overflow-x-auto border border-gray-200">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr className="text-left"><th className="p-4">Order #</th><th className="p-4">Date</th><th className="p-4">Total</th><th className="p-4">Action</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{o.order_number}</td>
                  <td className="p-4">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="p-4">KSh {o.total_amount}</td>
                  <td className="p-4">
                    <Button size="sm" onClick={() => invoiceService.downloadReceipt(o)}>Download</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
