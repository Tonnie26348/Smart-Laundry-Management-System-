import { supabase } from '@/lib/supabase';

export interface LoyaltyTransaction {
  id: string;
  points_change: number;
  reason: string;
  created_at: string;
}

export const loyaltyService = {
  async getLoyaltyHistory(customerId: string) {
    const { data, error } = await supabase
      .from('loyalty_transactions')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as LoyaltyTransaction[];
  }
};
