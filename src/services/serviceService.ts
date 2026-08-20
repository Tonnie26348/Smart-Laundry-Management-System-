import { supabase } from '../lib/supabase';

export interface Service {
  id: string;
  name: string;
  description: string;
  base_price: number;
}

export interface LaundryItem {
  id: string;
  name: string;
  service_id: string;
  price_adjustment: number;
}

export const serviceService = {
  async getServices() {
    const { data, error } = await supabase.from('services').select('*');
    if (error) throw error;
    return data as Service[];
  },
  async getLaundryItems() {
    const { data, error } = await supabase.from('laundry_items').select('*');
    if (error) throw error;
    return data as LaundryItem[];
  }
};
