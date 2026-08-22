import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const InspectionsPage = () => {
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInspections = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('item_inspections').select('*, order_items(id)');
      if (error) console.error('Error fetching inspections:', error);
      else setInspections(data || []);
      setLoading(false);
    };
    fetchInspections();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Item Inspections</h1>
        {loading ? <LoadingSpinner /> : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead><tr className="bg-gray-100"><th className="p-4">Condition</th><th className="p-4">Notes</th></tr></thead>
              <tbody>
                {inspections.map(i => (
                  <tr key={i.id} className="border-t">
                    <td className="p-4">{i.condition}</td>
                    <td className="p-4">{i.damage_notes}</td>
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
