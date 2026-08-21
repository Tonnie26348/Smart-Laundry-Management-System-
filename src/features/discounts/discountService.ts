import { supabase } from '@/lib/supabase';

export const discountService = {
  async applyDiscount(orderId: string, code: string) {
    const { data, error } = await (supabase.rpc('apply_discount', { order_id_param: orderId, discount_code: code }) as any);
    if (error) throw error;
    return data as number; // Returns discount amount
  }
};
