import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { reviewService } from '@/features/reviews/reviewService';

export const CustomerReviewsPage = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ order_id: '', rating: 5, comment: '' });

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) { setLoading(false); return; }

    const { data: customer } = await (supabase.from('customers').select('id').eq('profile_id', user.id).single() as any);

    if (customer) {
        // Fetch reviews
        const { data: revs } = await supabase.from('reviews').select('*, orders(order_number)').eq('customer_id', customer.id);
        setReviews(revs || []);

        // Fetch completed orders not yet reviewed
        const { data: orders } = await supabase
          .from('orders')
          .select('id, order_number')
          .eq('customer_id', customer.id)
          .eq('status', 'completed');
        
        setCompletedOrders(orders || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!newReview.order_id || !newReview.comment) return;
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');
        const { data: customer } = await (supabase.from('customers').select('id').eq('profile_id', user.id).single() as any);
        // Ensure order_id is included as required by the database schema
        await reviewService.submitReview({ ...newReview, customer_id: customer.id } as any);
        setNewReview({ order_id: '', rating: 5, comment: '' });
        fetchData();
    } catch (e) {
        console.error(e);
        alert('Failed to submit review');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Reviews</h1>
      
      <Card className="p-4 space-y-4">
        <h2 className="font-bold">Submit New Review</h2>
        <select className="w-full border p-2 rounded" value={newReview.order_id} onChange={e => setNewReview({...newReview, order_id: e.target.value})}>
            <option value="">Select Order</option>
            {completedOrders.map(o => <option key={o.id} value={o.id}>{o.order_number}</option>)}
        </select>
        <Input type="number" min="1" max="5" value={newReview.rating} onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})} />
        <Input placeholder="Comment" value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} />
        <Button onClick={handleSubmit}>Submit Review</Button>
      </Card>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-4">
          {reviews.length === 0 ? (
              <Card className="p-8 text-center text-gray-500">No reviews found.</Card>
          ) : (
              reviews.map(r => (
                  <Card key={r.id} className="p-4">
                      <p className="font-bold">Order #{r.orders?.order_number}</p>
                      <p className="text-sm text-gray-600">{r.comment}</p>
                      <p className="text-xs text-gray-400 mt-2">Rating: {r.rating}/5 | Status: {r.status}</p>
                  </Card>
              ))
          )}
        </div>
      )}
    </div>
  );
};
