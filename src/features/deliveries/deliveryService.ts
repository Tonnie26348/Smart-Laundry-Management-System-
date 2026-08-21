/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase';

export interface Delivery {
  id: string;
  order_id: string;
  delivery_type: 'pickup' | 'delivery';
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';
  assigned_to?: string;
  pickup_address?: string;
  delivery_address?: string;
}

export const deliveryService = {
  async getDeliveries() {
    const { data, error } = await supabase.from('deliveries').select('*');
    if (error) throw error;
    return data as Delivery[];
  },
  async updateStatus(id: string, status: Delivery['status']) {
    const { error } = await (supabase.from('deliveries') as any).update({ status }).eq('id', id);
    if (error) throw error;
  }
};
