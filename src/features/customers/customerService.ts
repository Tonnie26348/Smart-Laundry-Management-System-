/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase';

export interface Customer {
  id: string;
  profile_id: string;
  phone: string;
  address: string;
  loyalty_points: number;
}

export const customerService = {
  async getOwnProfile(): Promise<Customer | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase.from('customers').select('*').eq('profile_id', user.id).single();
    if (error) throw error;
    return data;
  },
  async updateProfile(id: string, data: Partial<Customer>) {
    const { error } = await (supabase.from('customers') as any).update(data).eq('id', id);
    if (error) throw error;
  }
};
