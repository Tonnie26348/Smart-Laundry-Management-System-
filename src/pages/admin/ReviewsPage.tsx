import { useEffect, useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { reviewService, Review } from '@/features/reviews/reviewService';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const ReviewsPage = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await reviewService.moderateReview(id, status);
      fetchReviews();
    } catch (error) {
      console.error('Error moderating review:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Customer Reviews</h1>
        {loading ? <LoadingSpinner /> : (
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gray-100 text-left border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-700">Order #</th>
                  <th className="p-4 font-semibold text-gray-700">Customer</th>
                  <th className="p-4 font-semibold text-gray-700">Rating</th>
                  <th className="p-4 font-semibold text-gray-700">Comment</th>
                  <th className="p-4 font-semibold text-gray-700">Status</th>
                  <th className="p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">No reviews found.</td>
                  </tr>
                ) : (
                  reviews.map(review => (
                    <tr key={review.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-4">{review.orders?.order_number || 'N/A'}</td>
                    <td className="p-4">{review.customers?.profiles?.full_name || 'N/A'}</td>
                    <td className="p-4">{review.rating} / 5</td>
                      <td className="p-4">{review.comment}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase ${review.status === 'approved' ? 'bg-green-100 text-green-700' : review.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {review.status}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2">
                        {review.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleModerate(review.id, 'approved')} className="text-green-600 border-green-600 hover:bg-green-50">Approve</Button>
                            <Button size="sm" variant="outline" onClick={() => handleModerate(review.id, 'rejected')} className="text-red-600 border-red-600 hover:bg-red-50">Reject</Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
