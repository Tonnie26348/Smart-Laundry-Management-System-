import { useEffect, useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { discountService, Discount } from '@/features/discounts/discountService';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Input } from '@/components/ui/Input';

export const DiscountsPage = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDiscount, setNewDiscount] = useState<Partial<Discount>>({ code: '', type: 'percentage', value: 0, is_active: true });

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const data = await discountService.getAllDiscounts();
      setDiscounts(data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleCreate = async () => {
    try {
      await discountService.createDiscount(newDiscount as Omit<Discount, 'id'>);
      setNewDiscount({ code: '', type: 'percentage', value: 0, is_active: true });
      fetchDiscounts();
    } catch (error) {
      console.error('Error creating discount:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await discountService.deleteDiscount(id);
      fetchDiscounts();
    } catch (error) {
      console.error('Error deleting discount:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Discount Management</h1>
        
        <div className="bg-white p-6 shadow rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Create New Discount</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Code (e.g. SAVE10)" value={newDiscount.code} onChange={e => setNewDiscount({...newDiscount, code: e.target.value})} />
            <select className="border rounded px-2" value={newDiscount.type} onChange={e => setNewDiscount({...newDiscount, type: e.target.value as any})}>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
            <Input type="number" placeholder="Value" value={newDiscount.value} onChange={e => setNewDiscount({...newDiscount, value: Number(e.target.value)})} />
            <Button onClick={handleCreate}>Create Discount</Button>
          </div>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-left border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-700">Code</th>
                  <th className="p-4 font-semibold text-gray-700">Type</th>
                  <th className="p-4 font-semibold text-gray-700">Value</th>
                  <th className="p-4 font-semibold text-gray-700">Active</th>
                  <th className="p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map(d => (
                  <tr key={d.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-4">{d.code}</td>
                    <td className="p-4 uppercase">{d.type}</td>
                    <td className="p-4">{d.value} {d.type === 'percentage' ? '%' : 'KSh'}</td>
                    <td className="p-4">{d.is_active ? 'Yes' : 'No'}</td>
                    <td className="p-4">
                      <Button size="sm" variant="outline" onClick={() => handleDelete(d.id)} className="text-red-600 border-red-600 hover:bg-red-50">Delete</Button>
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
