import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface CustomerWithProfile {
  id: string;
  profile_id: string;
  phone: string;
  address: string;
  loyalty_points: number;
  profiles: {
    full_name: string;
    email: string;
  };
}

export const CustomersPage = () => {
  const [customers, setCustomers] = useState<CustomerWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*, profiles(full_name, email)');

      if (error) {
        console.error('Error fetching customers:', error);
      } else {
        setCustomers(data as unknown as CustomerWithProfile[]);
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
            <div className="bg-white shadow rounded-lg overflow-hidden overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Phone</th>
                            <th className="p-4">Loyalty Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map(c => (
                            <tr key={c.id} className="border-t">
                                <td className="p-4">{c.profiles?.full_name}</td>
                                <td className="p-4">{c.profiles?.email}</td>
                                <td className="p-4">{c.phone}</td>
                                <td className="p-4">{c.loyalty_points}</td>
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
