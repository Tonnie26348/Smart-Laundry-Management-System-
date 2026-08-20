import { supabase } from '../lib/supabase';
import { Order } from './orderService';

export const invoiceService = {
  async getInvoiceData(orderId: string) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, customers(*), order_items(*, laundry_items(*, services(*))), payments(*)')
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;
    return order;
  }
};
