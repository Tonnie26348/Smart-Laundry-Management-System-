/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase';

export interface Discount {
  id: string;
  code: string;
  name: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount: number;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  usage_limit: number | null;
  per_customer_usage_limit: number | null;
}

export const discountService = {
  async getAllDiscounts(): Promise<Discount[]> {
    const { data, error } = await supabase.from('discounts').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async createDiscount(discount: Omit<Discount, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await (supabase.from('discounts') as any).insert(discount).select().single();
    if (error) throw error;
    return data;
  },
  async updateDiscount(id: string, discount: Partial<Discount>) {
    const { error } = await (supabase.from('discounts') as any).update(discount).eq('id', id);
    if (error) throw error;
  },
  async deleteDiscount(id: string) {
    const { error } = await (supabase.from('discounts') as any).delete().eq('id', id);
    if (error) throw error;
  },
  async applyDiscount(orderId: string, code: string) {
    const { data, error } = await supabase.rpc('apply_discount', { order_id_param: orderId, discount_code: code } as any);
    if (error) throw error;
    return data as number; // Returns discount amount
  }
};
