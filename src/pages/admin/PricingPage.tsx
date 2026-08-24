import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { catalogService, LaundryItemServiceWithDetails } from '@/features/catalog/catalogService';
import { Card } from '@/components/ui/Card';

export const PricingPage = () => {
  const [mappings, setMappings] = useState<LaundryItemServiceWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await catalogService.getLaundryItemServices();
        setMappings(data);
      } catch (error) {
        console.error('Error fetching mappings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Pricing Management</h1>
        {loading ? <div>Loading pricing...</div> : (
          <Card className="p-6">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Item</th>
                  <th className="text-left p-2">Service</th>
                  <th className="text-left p-2">Base</th>
                  <th className="text-left p-2">Adj</th>
                  <th className="text-left p-2">Final</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {mappings.map(m => (
                  <tr key={m.id} className="border-b">
                    <td className="p-2">{m.laundry_items.name}</td>
                    <td className="p-2">{m.services.name}</td>
                    <td className="p-2">KSh {m.services.base_price.toFixed(2)}</td>
                    <td className="p-2">KSh {m.price_adjustment.toFixed(2)}</td>
                    <td className="p-2 font-bold">KSh {catalogService.calculateFinalPrice(m.services.base_price, m.price_adjustment).toFixed(2)}</td>
                    <td className="p-2">{m.is_active ? 'Active' : 'Inactive'}</td>
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
