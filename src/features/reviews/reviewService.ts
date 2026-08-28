/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase';

export interface Review {
  id: string;
  order_id: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const reviewService = {
  async getAllReviews(): Promise<Review[]> {
    const { data, error } = await (supabase.from('reviews') as any).select('*, orders(order_number), customers(full_name)');
    if (error) throw error;
    return data || [];
  },
  async submitReview(review: Omit<Review, 'id' | 'status'>) {
    const { data, error } = await (supabase.from('reviews') as any).insert(review).select().single();
    if (error) throw error;
    return data;
  },
  async moderateReview(reviewId: string, status: 'approved' | 'rejected') {
    const { error } = await (supabase.from('reviews') as any).update({ status }).eq('id', reviewId);
    if (error) throw error;
  }
};
