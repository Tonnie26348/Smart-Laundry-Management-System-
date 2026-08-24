import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';

export const CustomerLoyaltyPage = () => {
  const [loyalty, setLoyalty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMyLoyalty = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        setLoading(false);
        return;
    }

    const { data, error } = await (supabase
      .from('customers')
      .select('loyalty_points')
      .eq('profile_id', user.id)
      .single() as any);
    
    if (error) {
        console.error('Error fetching loyalty points:', error);
    } else {
        setLoyalty(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMyLoyalty();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Loyalty Points</h1>
      {loading ? <LoadingSpinner /> : (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-2">Total Points</p>
          <p className="text-5xl font-extrabold text-primary-600">{loyalty?.loyalty_points || 0}</p>
        </Card>
      )}
    </div>
  );
};
