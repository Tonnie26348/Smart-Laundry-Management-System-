import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { messagingService } from '@/features/messaging/services/messagingService';

interface Profile {
  id: string;
  full_name: string;
  email: string;
}

interface Customer {
  id: string;
  profile_id: string;
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

      // 2. Fetch profiles for all customer profile_ids
      const profileIds = typedCustomers
        ?.map(c => c.profile_id)
        .filter((id): id is string => id !== null && id !== undefined) || [];
      
      console.log('Profile IDs to fetch:', JSON.stringify(profileIds));

      let profilesData: Profile[] = [];
      if (profileIds.length > 0) {
        const { data, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', profileIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          alert('Fetch Profiles Error: ' + profilesError.message);
          setLoading(false);
          return;
        }
        profilesData = data as Profile[];
        console.log('Profiles data fetched:', JSON.stringify(profilesData, null, 2));
      }

      // 3. Merge data
      const typedProfiles = (profilesData as Profile[]) || [];
      console.log('Typed profiles:', JSON.stringify(typedProfiles, null, 2));

      const mergedData: Customer[] = (typedCustomers as any[]).map(c => {
        const profile = typedProfiles.find(p => {
            const match = p.id === c.profile_id;
            if (!match) {
                console.log(`Comparing p.id (${typeof p.id}) "${p.id}" with c.profile_id (${typeof c.profile_id}) "${c.profile_id}"`);
            }
            return match;
        });
        return {
            ...c,
            profiles: profile
        };
      });

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
                                  <Button size="sm" onClick={async () => {
                                      const convId = await messagingService.getOrCreateDirectConversation(c.profile_id);
                                      navigate(`/admin/messaging?conversationId=${convId}`);
                                  }}>Chat</Button>
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
