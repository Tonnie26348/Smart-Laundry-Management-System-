import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const CustomerProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
          setLoading(false);
          return;
      }
      
      // Fetch profile and customer
      const { data: profileData } = await (supabase.from('profiles').select('*').eq('id', user.id).single() as any);
      const { data: customerData } = await (supabase.from('customers').select('*').eq('profile_id', user.id).single() as any);
      
      setProfile({
          name: profileData?.full_name,
          // Phone is in profiles, fallback to customer if needed, then default to 'Not Set'
          phone: profileData?.phone || customerData?.phone || 'Not Set',
          address: customerData?.address || 'Not Set',
          loyalty_points: customerData?.loyalty_points ?? 0
      });
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found.</div>;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">My Profile</h2>
        <Button onClick={() => navigate('/profile/edit')}>Edit Profile</Button>
      </div>
      <p className="mb-2"><strong>Name:</strong> {profile.name}</p>
      <p className="mb-2"><strong>Phone:</strong> {profile.phone}</p>
      <p className="mb-2"><strong>Address:</strong> {profile.address}</p>
      <p><strong>Loyalty Points:</strong> {profile.loyalty_points}</p>
    </Card>
  );
};
