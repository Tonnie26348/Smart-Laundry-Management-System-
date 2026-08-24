import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';

export const CustomerProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
          setLoading(false);
          return;
      }
      
      // Fetch profile (for name) and customer (for phone/address)
      const { data: profileData } = await (supabase.from('profiles').select('full_name').eq('id', user.id).single() as any);
      // The user console output showed 'address' but not 'phone'. 
      // Perhaps it's named 'contact_phone' or similar? The console shows the keys.
      // Keys were: id, profile_id, customer_number, address, loyalty_points, is_active, created_at, updated_at
      // The 'phone' column IS NOT in the returned object.
      // Wait, is it possible 'phone' is in another table or I need to join?
      // Based on 004_customers_employees.sql and 20260820120000_initial_schema.sql, 'phone' should be in 'customers'.
      
      const { data: customerData } = await (supabase.from('customers').select('*').eq('profile_id', user.id).single() as any);
      
      setProfile({
          name: profileData?.full_name,
          phone: customerData?.phone || customerData?.contact_phone || 'N/A',
          address: customerData?.address,
          loyalty_points: customerData?.loyalty_points
      });
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found.</div>;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>
      <p className="mb-2"><strong>Name:</strong> {profile.name}</p>
      <p className="mb-2"><strong>Phone:</strong> {profile.phone}</p>
      <p className="mb-2"><strong>Address:</strong> {profile.address}</p>
      <p><strong>Loyalty Points:</strong> {profile.loyalty_points}</p>
    </Card>
  );
};
