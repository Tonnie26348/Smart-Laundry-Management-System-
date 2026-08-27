import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Profile {
  id: string;
  full_name: string;
  email: string;
}

interface Customer {
  id: string;
  user_id: string;
  phone: string | null;
  profiles?: Profile;
}

export const StaffCustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      console.log('Fetching customers...');

      // 1. Fetch customers
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*');

      if (customersError) {
        console.error('Error fetching customers:', customersError);
        alert('Fetch Error: ' + customersError.message);
        setLoading(false);
        return;
      }

      const typedCustomers = customersData as Customer[];

      // 2. Fetch profiles for all customer user_ids
      const userIds = typedCustomers?.map(c => c.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        alert('Fetch Profiles Error: ' + profilesError.message);
        setLoading(false);
        return;
      }

      // 3. Merge data
      const typedProfiles = (profilesData as Profile[]) || [];
      const mergedData: Customer[] = (typedCustomers as any[]).map(c => ({
        ...c,
        profiles: typedProfiles.find(p => p.id === c.user_id)
      }));

      console.log('Merged customers data:', JSON.stringify(mergedData, null, 2));
      setCustomers(mergedData);
      setLoading(false);
    };

    fetchCustomers();
  }, []);

  const filteredCustomers: Customer[] = customers.filter(c =>
    (c.profiles?.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (c.profiles?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (c.phone || '').includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Input placeholder="Search by name, email, or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        {loading ? <LoadingSpinner /> : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Phone</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map((c: Customer) => (
                            <tr key={c.id} className="border-t">
                                <td className="p-4">{c.profiles?.full_name || 'N/A'}</td>
                                <td className="p-4">{c.profiles?.email || 'N/A'}</td>
                                <td className="p-4">{c.phone || 'N/A'}</td>
                                <td className="p-4">
                                  <Button size="sm" onClick={() => navigate(`/admin/chat/${c.profiles?.id || ''}`)}>Chat</Button>
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
