import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useRole } from '@/hooks/useRole';

export const EmployeesPage = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { role, loading: roleLoading } = useRole();

  useEffect(() => {
    if (roleLoading) return;
    if (role !== 'administrator') {
      setLoading(false);
      return;
    }

    const fetchEmployees = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('employees').select('*, profiles(full_name, email)');
      if (error) console.error('Error fetching employees:', error);
      else setEmployees(data || []);
      setLoading(false);
    };
    fetchEmployees();
  }, [role, roleLoading]);

  if (roleLoading) return <AdminLayout><LoadingSpinner /></AdminLayout>;
  if (role !== 'administrator') return <AdminLayout>Access Denied</AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Employees</h1>
        {loading ? <LoadingSpinner /> : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead><tr className="bg-gray-100"><th className="p-4">Name</th><th className="p-4">Email</th></tr></thead>
              <tbody>
                {employees.map(e => (
                  <tr key={e.id} className="border-t">
                    <td className="p-4">{e.profiles?.full_name}</td>
                    <td className="p-4">{e.profiles?.email}</td>
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
