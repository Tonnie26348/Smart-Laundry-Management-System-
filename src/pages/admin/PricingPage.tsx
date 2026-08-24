import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { catalogService, LaundryItemServiceWithDetails, LaundryItem, Service } from '@/features/catalog/catalogService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

export const PricingPage = () => {
  const [mappings, setMappings] = useState<LaundryItemServiceWithDetails[]>([]);
  const [items, setItems] = useState<LaundryItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<any | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mappingsData, itemsData, servicesData] = await Promise.all([
        catalogService.getLaundryItemServices(),
        catalogService.getLaundryItems(),
        catalogService.getServices()
      ]);
      setMappings(mappingsData);
      setItems(itemsData);
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMapping) return;
    try {
      await catalogService.manageLaundryItemService(editingMapping, !!editingMapping.id);
      alert('Mapping saved successfully.');
      setIsModalOpen(false);
      setEditingMapping(null);
      loadData();
    } catch (error: any) {
      alert(error.message || 'Error saving mapping.');
    }
  };

  const getSelectedService = () => services.find(s => s.id === editingMapping?.service_id);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Pricing Management</h1>
            <Button onClick={() => { setEditingMapping({ is_active: true }); setIsModalOpen(true); }}>Add Pricing</Button>
        </div>
        {loading ? <div>Loading pricing...</div> : (
          <Card className="p-6">
            <table className="min-w-full">
              <thead><tr className="border-b"><th className="text-left p-2">Item</th><th className="text-left p-2">Service</th><th className="text-left p-2">Base</th><th className="text-left p-2">Adj</th><th className="text-left p-2">Final</th><th className="text-left p-2">Actions</th></tr></thead>
              <tbody>
                {mappings.map(m => (
                  <tr key={m.id} className="border-b">
                    <td className="p-2">{m.laundry_items.name}</td>
                    <td className="p-2">{m.services.name}</td>
                    <td className="p-2">KSh {m.services.base_price.toFixed(2)}</td>
                    <td className="p-2">KSh {m.price_adjustment.toFixed(2)}</td>
                    <td className="p-2 font-bold">KSh {catalogService.calculateFinalPrice(m.services.base_price, m.price_adjustment).toFixed(2)}</td>
                    <td className="p-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingMapping(m); setIsModalOpen(true); }}>Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMapping?.id ? "Edit Pricing" : "Add Pricing"}>
            <form onSubmit={handleSave} className="space-y-4">
                <label className="block text-sm font-medium">Laundry Item</label>
                <select className="w-full p-2 border rounded" value={editingMapping?.laundry_item_id || ''} onChange={e => setEditingMapping({...editingMapping, laundry_item_id: e.target.value})} required disabled={!!editingMapping?.id}>
                    <option value="">Select Item</option>
                    {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
                <label className="block text-sm font-medium">Service</label>
                <select className="w-full p-2 border rounded" value={editingMapping?.service_id || ''} onChange={e => setEditingMapping({...editingMapping, service_id: e.target.value})} required disabled={!!editingMapping?.id}>
                    <option value="">Select Service</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <Input label="Price Adjustment (KSh)" type="number" value={editingMapping?.price_adjustment || 0} onChange={e => setEditingMapping({...editingMapping, price_adjustment: parseFloat(e.target.value) || 0})} required />
                
                <div className="p-4 bg-gray-50 rounded">
                  <p><strong>Pricing Preview</strong></p>
                  <p>Base: KSh {getSelectedService()?.base_price.toFixed(2) || '0.00'}</p>
                  <p>Adjustment: KSh {(editingMapping?.price_adjustment || 0).toFixed(2)}</p>
                  <p className="font-bold">Final Price: KSh {catalogService.calculateFinalPrice(getSelectedService()?.base_price || 0, editingMapping?.price_adjustment || 0).toFixed(2)}</p>
                </div>
                <Button type="submit" className="w-full">Save</Button>
            </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};
