import { useState, useEffect } from 'react';
import { CustomerLayout } from '@/layouts/CustomerLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';

export const CustomerReviewsPage = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyReviews = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        setLoading(false);
        return;
    }

    // Fetch customer ID
    const { data: customer } = await (supabase
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single() as any);

    if (customer) {
        const { data, error } = await supabase
          .from('reviews')
          .select('*, orders(order_number)')
          .eq('customer_id', customer.id)
          .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching reviews:', error);
        } else {
            setReviews(data || []);
        }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMyReviews();
  }, []);

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Reviews</h1>
        {loading ? <LoadingSpinner /> : (
          <div className="space-y-4">
            {reviews.length === 0 ? (
                <Card className="p-8 text-center text-gray-500">No reviews found.</Card>
            ) : (
                reviews.map(r => (
                    <Card key={r.id} className="p-4">
                        <p className="font-bold">Order #{r.orders?.order_number}</p>
                        <p className="text-sm text-gray-600">{r.comment}</p>
                        <p className="text-xs text-gray-400 mt-2">Rating: {r.rating}/5</p>
                    </Card>
                ))
            )}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};
