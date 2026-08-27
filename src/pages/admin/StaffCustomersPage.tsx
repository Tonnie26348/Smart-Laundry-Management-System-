import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const StaffCustomersPage = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      console.log('Fetching customers...');
      const { data, error } = await supabase
        .from('customers')
        .select('*, profiles(id, full_name, email)');

      if (error) {
        console.error('Error fetching customers:', error);
        alert('Fetch Error: ' + error.message);
      } else {
        console.log('Fetched customers:', data);
        setCustomers(data || []);
      }
      setLoading(false);
    };

    fetchCustomers();
  }, []);
  const filteredCustomers = customers.filter(c =>
    c.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
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
                        {filteredCustomers.map(c => (
                            <tr key={c.id} className="border-t">
                                <td className="p-4">{c.profiles?.full_name || 'N/A'}</td>
                                <td className="p-4">{c.profiles?.email || 'N/A'}</td>
                                <td className="p-4">{c.phone || 'N/A'}</td>
                                <td className="p-4">
                                  <Button size="sm" onClick={() => navigate(`/admin/chat/${c.profiles?.id}`)}>Chat</Button>
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
