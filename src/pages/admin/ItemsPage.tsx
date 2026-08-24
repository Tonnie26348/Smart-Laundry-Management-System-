import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { catalogService, LaundryItem, ItemCategory } from '@/features/catalog/catalogService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

export const ItemsPage = () => {
  const [items, setItems] = useState<LaundryItem[]>([]);
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<LaundryItem> | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [itemsData, categoriesData] = await Promise.all([
        catalogService.getLaundryItems(false), // Fetch all
        catalogService.getItemCategories()
      ]);
      setItems(itemsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      await catalogService.manageLaundryItem(editingItem, !!editingItem.id);
      alert(`Item ${editingItem.id ? 'updated' : 'created'} successfully.`);
      setIsModalOpen(false);
      setEditingItem(null);
      loadData();
    } catch (error) {
      alert('Error saving laundry item.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Laundry Items</h1>
            <Button onClick={() => { setEditingItem({ is_active: true }); setIsModalOpen(true); }}>Add Item</Button>
        </div>
        {loading ? <div>Loading...</div> : (
          <Card className="p-6">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Active</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{categories.find(c => c.id === item.category_id)?.name}</td>
                    <td className="p-2">{item.is_active ? 'Yes' : 'No'}</td>
                    <td className="p-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingItem(item); setIsModalOpen(true); }}>Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem?.id ? "Edit Item" : "Add Item"}>
            <form onSubmit={handleSave} className="space-y-4">
                <Input label="Name" value={editingItem?.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} required />
                <label className="block text-sm font-medium">Category</label>
                <select className="w-full p-2 border rounded" value={editingItem?.category_id || ''} onChange={e => setEditingItem({...editingItem, category_id: e.target.value})} required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <Button type="submit" className="w-full">Save</Button>
            </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};
