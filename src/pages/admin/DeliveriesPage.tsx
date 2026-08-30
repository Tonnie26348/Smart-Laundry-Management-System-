import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';

export const DeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveriesAndStaff = async () => {
    setLoading(true);
    
    // Fetch deliveries
    const { data: deliveriesData, error: deliveriesError } = await supabase
      .from('deliveries')
      .select('*, orders(order_number), customers(profile_id, profiles(full_name))');
    
    // Fetch delivery staff
    const { data: staffData, error: staffError } = await (supabase
      .from('profiles')
      .select('id, full_name')
      .eq('role', 'delivery_staff') as any);

    if (deliveriesError) console.error('Error fetching deliveries:', deliveriesError);
    else setDeliveries(deliveriesData || []);
    
    if (staffError) console.error('Error fetching staff:', staffError);
    else setStaff(staffData || []);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchDeliveriesAndStaff();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await (supabase.from('deliveries') as any).update({ status: newStatus }).eq('id', id);
    if (error) alert('Failed to update status');
    else fetchDeliveriesAndStaff();
  };

  const assignStaff = async (id: string, staffId: string) => {
    const { error } = await (supabase.from('deliveries') as any).update({ assigned_to: staffId, status: 'assigned' }).eq('id', id);
    if (error) alert('Failed to assign staff');
    else fetchDeliveriesAndStaff();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Deliveries</h1>
        {loading ? <LoadingSpinner /> : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead><tr className="bg-gray-100 text-left"><th className="p-4">Order #</th><th className="p-4">Customer</th><th className="p-4">Status</th><th className="p-4">Assign Staff</th><th className="p-4">Actions</th></tr></thead>
              <tbody>
                {deliveries.map(d => (
                  <tr key={d.id} className="border-t">
                    <td className="p-4">{d.orders?.order_number}</td>
                    <td className="p-4">{d.customers?.profiles?.full_name}</td>
                    <td className="p-4 capitalize">{d.status}</td>
                    <td className="p-4">
                        <select onChange={(e) => assignStaff(d.id, e.target.value)} value={d.assigned_to || ''} className="border rounded p-1 text-sm">
                            <option value="">Unassigned</option>
                            {staff.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                        </select>
                    </td>
                    <td className="p-4 flex gap-2">
                      <Button size="sm" onClick={() => updateStatus(d.id, 'picked_up')}>Picked Up</Button>
                      <Button size="sm" onClick={() => updateStatus(d.id, 'delivered')}>Delivered</Button>
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
