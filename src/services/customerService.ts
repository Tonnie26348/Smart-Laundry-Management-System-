/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '../lib/supabase';

export interface Customer {
  id: string;
  profile_id: string;
  phone: string;
  address: string;
  loyalty_points: number;
}

export const customerService = {
  async getCustomers() {
    const { data, error } = await (supabase.from('customers') as any).select('id, profile_id, phone, address, loyalty_points');
    if (error) throw error;
    return data as Customer[];
  },
  async getCustomer(id: string) {
    const { data, error } = await (supabase.from('customers') as any).select('id, profile_id, phone, address, loyalty_points').eq('id', id).single();
    if (error) throw error;
    return data as Customer;
  },
  async updateCustomer(id: string, updates: Partial<Customer>) {
    const { data, error } = await (supabase.from('customers') as any).update(updates).eq('id', id);
    if (error) throw error;
    return data;
  }
};
