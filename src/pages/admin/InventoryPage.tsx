import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const InventoryPage = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('inventory').select('*');
      if (error) console.error('Error fetching inventory:', error);
      else setInventory(data || []);
      setLoading(false);
    };
    fetchInventory();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Inventory</h1>
        {loading ? <LoadingSpinner /> : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead><tr className="bg-gray-100"><th className="p-4">Item Name</th><th className="p-4">Quantity</th></tr></thead>
              <tbody>
                {inventory.map(i => (
                  <tr key={i.id} className="border-t">
                    <td className="p-4">{i.item_name}</td>
                    <td className="p-4">{i.quantity}</td>
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
