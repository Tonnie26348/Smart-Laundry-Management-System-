import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';

export const InventoryPage = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('inventory_items').select('*');
      if (error) console.error('Error fetching inventory:', error);
      else setInventory(data || []);
      setLoading(false);
    };
    fetchInventory();
  }, []);

  const updateStock = async (id: string, currentStock: number, change: number) => {
    const newStock = Number(currentStock) + Number(change);
    const { error } = await (supabase.from('inventory_items') as any).update({ current_stock: newStock }).eq('id', id);
    if (error) alert('Failed to update stock');
    else fetchInventory();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Inventory</h1>
        {loading ? <LoadingSpinner /> : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead><tr className="bg-gray-100 text-left"><th className="p-4">Item Name</th><th className="p-4">Stock</th><th className="p-4">Actions</th></tr></thead>
              <tbody>
                {inventory.map(i => (
                  <tr key={i.id} className="border-t">
                    <td className="p-4">{i.name}</td>
                    <td className="p-4">{i.current_stock}</td>
                    <td className="p-4 flex gap-2">
                      <Button size="sm" onClick={() => updateStock(i.id, i.current_stock, 1)}>+</Button>
                      <Button size="sm" onClick={() => updateStock(i.id, i.current_stock, -1)}>-</Button>
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
