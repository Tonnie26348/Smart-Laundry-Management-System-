import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';

export const InventoryPage = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    setLoading(true);
    // Join with suppliers to get the name
    const { data, error } = await supabase.from('inventory_items').select('*, suppliers(name)');
    if (error) console.error('Error fetching inventory:', error);
    else setInventory(data || []);
    setLoading(false);
  };

  useEffect(() => {
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
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-4">Name</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Min Stock</th>
                  <th className="p-4">Unit</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(i => {
                  const isLowStock = Number(i.current_stock) <= Number(i.min_stock_level);
                  return (
                    <tr key={i.id} className={`border-t ${isLowStock ? 'bg-red-50' : ''}`}>
                      <td className="p-4 font-medium">{i.name}</td>
                      <td className="p-4">{i.sku}</td>
                      <td className={`p-4 ${isLowStock ? 'text-red-600 font-bold' : ''}`}>
                          {i.current_stock}
                      </td>
                      <td className="p-4">{i.min_stock_level}</td>
                      <td className="p-4">{i.unit}</td>
                      <td className="p-4">{i.suppliers?.name || 'N/A'}</td>
                      <td className="p-4 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => updateStock(i.id, i.current_stock, 1)}>+</Button>
                        <Button size="sm" variant="outline" onClick={() => updateStock(i.id, i.current_stock, -1)}>-</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
