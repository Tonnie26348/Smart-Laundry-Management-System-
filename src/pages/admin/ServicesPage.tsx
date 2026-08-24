import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { catalogService, Service, ServiceCategory } from '@/features/catalog/catalogService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

export const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [servicesData, categoriesData] = await Promise.all([
        catalogService.getServices(false),
        catalogService.getServiceCategories()
      ]);
      setServices(servicesData);
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
    if (!editingService) return;
    try {
      await catalogService.manageService(editingService, !!editingService.id);
      alert(`Service ${editingService.id ? 'updated' : 'created'} successfully.`);
      setIsModalOpen(false);
      setEditingService(null);
      loadData();
    } catch (error) {
      alert('Error saving service.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Services</h1>
          <Button onClick={() => { setEditingService({ is_active: true }); setIsModalOpen(true); }}>Add Service</Button>
        </div>
        {loading ? <div>Loading...</div> : (
          <Card className="p-6">
            <table className="min-w-full">
              <thead><tr className="border-b"><th className="text-left p-2">Name</th><th className="text-left p-2">Category</th><th className="text-left p-2">Base Price</th><th className="text-left p-2">Active</th><th className="text-left p-2">Actions</th></tr></thead>
              <tbody>
                {services.map(s => (
                  <tr key={s.id} className="border-b">
                    <td className="p-2">{s.name}</td>
                    <td className="p-2">{categories.find(c => c.id === s.category_id)?.name}</td>
                    <td className="p-2">KSh {s.base_price.toFixed(2)}</td>
                    <td className="p-2">{s.is_active ? 'Yes' : 'No'}</td>
                    <td className="p-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingService(s); setIsModalOpen(true); }}>Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingService?.id ? "Edit Service" : "Add Service"}>
            <form onSubmit={handleSave} className="space-y-4">
                <Input label="Name" value={editingService?.name || ''} onChange={e => setEditingService({...editingService, name: e.target.value})} required />
                <label className="block text-sm font-medium">Category</label>
                <select className="w-full p-2 border rounded" value={editingService?.category_id || ''} onChange={e => setEditingService({...editingService, category_id: e.target.value})} required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <Input label="Base Price" type="number" value={editingService?.base_price || ''} onChange={e => setEditingService({...editingService, base_price: parseFloat(e.target.value)})} required />
                <Button type="submit" className="w-full">Save</Button>
            </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};
