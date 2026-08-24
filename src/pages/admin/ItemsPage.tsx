import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { catalogService, LaundryItem, ItemCategory } from '@/features/catalog/catalogService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const ItemsPage = () => {
  const [items, setItems] = useState<LaundryItem[]>([]);
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Laundry Items</h1>
        {loading ? <div>Loading...</div> : (
          <Card className="p-6">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Active</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{categories.find(c => c.id === item.category_id)?.name}</td>
                    <td className="p-2">{item.is_active ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};
