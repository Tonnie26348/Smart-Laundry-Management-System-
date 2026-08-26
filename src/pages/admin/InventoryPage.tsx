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
  // Re-added supplier join
  const { data, error } = await supabase.from('inventory_items').select('*, suppliers(name)');
  if (error) {
      console.error('Error fetching inventory:', error);
      alert('Supabase Fetch Error: ' + error.message);
  } else {
      setInventory(data || []);
  }
  setLoading(false);
};

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = async (id: string, currentStock: number, isAddition: boolean) => {
    const quantity = prompt(`Enter quantity to ${isAddition ? 'add' : 'deduct'}:`);
    const reason = prompt('Enter reason for this change:');
    
    if (!quantity || isNaN(Number(quantity))) {
        alert('Please enter a valid quantity.');
        return;
    }

    const change = isAddition ? Number(quantity) : -Number(quantity);
    const newStock = Number(currentStock) + change;

    if (newStock < 0) {
        alert('Insufficient stock for this deduction.');
        return;
    }

    const { error } = await (supabase.from('inventory_items') as any).update({ current_stock: newStock }).eq('id', id);
    if (error) {
        alert('Failed to update stock');
        return;
    }

    await (supabase.from('inventory_transactions') as any).insert({
        item_id: id,
        type: isAddition ? 'addition' : 'deduction',
        quantity: Number(quantity),
        reason: reason || 'No reason provided'
    });

    fetchInventory();
  };

  const handleAddNewItem = async () => {
    const name = prompt('Enter item name:');
    const sku = prompt('Enter SKU:');
    const unit = prompt('Enter unit (e.g., kg, L, pcs):');
    const minStock = prompt('Enter minimum stock level:');

    if (!name || !sku || !unit || !minStock) {
        alert('All fields are required.');
        return;
    }

    const { error } = await (supabase.from('inventory_items') as any).insert({
        name,
        sku,
        unit,
        min_stock_level: Number(minStock),
        current_stock: 0
    });

    if (error) {
        alert('Failed to add new item: ' + error.message);
    } else {
        fetchInventory();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Inventory Dashboard</h1>
            <Button onClick={handleAddNewItem}>Add New Item</Button>
        </div>
        {loading ? <LoadingSpinner /> : (
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-gray-100 text-left border-b border-gray-200">
                  <th className="p-4 w-1/4 font-semibold text-gray-700">Name</th>
                  <th className="p-4 w-1/6 font-semibold text-gray-700">SKU</th>
                  <th className="p-4 w-1/12 font-semibold text-gray-700">Stock</th>
                  <th className="p-4 w-1/12 font-semibold text-gray-700">Min</th>
                  <th className="p-4 w-1/12 font-semibold text-gray-700">Unit</th>
                  <th className="p-4 w-1/6 font-semibold text-gray-700">Supplier</th>
                  <th className="p-4 w-1/6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500 font-medium">
                      No inventory items found. Please run the seed script to add default items.
                    </td>
                  </tr>
                ) : (
                  inventory.map(i => {
                    const isLowStock = Number(i.current_stock) <= Number(i.min_stock_level);
                    return (
                      <tr key={i.id} className={`border-t border-gray-100 hover:bg-gray-50 transition-colors ${isLowStock ? 'bg-red-50 hover:bg-red-100' : ''}`}>
                        <td className="p-4 font-medium truncate">{i.name}</td>
                        <td className="p-4 text-gray-600 truncate">{i.sku}</td>
                        <td className={`p-4 ${isLowStock ? 'text-red-600 font-extrabold' : 'text-gray-900 font-semibold'}`}>
                            {i.current_stock}
                        </td>
                        <td className="p-4 text-gray-600">{i.min_stock_level}</td>
                        <td className="p-4 text-gray-500 truncate">{i.unit}</td>
                        <td className="p-4 text-gray-600 truncate">{i.suppliers?.name || 'N/A'}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleStockChange(i.id, i.current_stock, true)}>Add</Button>
                              <Button size="sm" variant="danger" onClick={() => handleStockChange(i.id, i.current_stock, false)}>Deduct</Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
