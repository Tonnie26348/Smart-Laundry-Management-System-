import { supabase } from '../lib/supabase';

export interface Customer {
  id: string;
  user_id: string;
  phone: string;
  address: string;
  loyalty_points: number;
}

export const customerService = {
  async getCustomers() {
    const { data, error } = await supabase.from('customers').select('*');
    if (error) throw error;
    return data as Customer[];
  },
  async getCustomer(id: string) {
    const { data, error } = await supabase.from('customers').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Customer;
  },
  async updateCustomer(id: string, updates: Partial<Customer>) {
    const { data, error } = await supabase.from('customers').update(updates).eq('id', id);
    if (error) throw error;
    return data;
  }
};
