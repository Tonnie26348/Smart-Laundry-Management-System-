import { useState, useEffect } from 'react';
import { customerService, Customer } from '../features/customers/customerService';
import { Card } from '@/components/ui/Card';

export const CustomerProfile = () => {
  const [profile, setProfile] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customerService.getOwnProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found.</div>;

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">My Profile</h2>
      <p>Phone: {profile.phone}</p>
      <p>Address: {profile.address}</p>
      <p>Loyalty Points: {profile.loyalty_points}</p>
    </Card>
  );
};
