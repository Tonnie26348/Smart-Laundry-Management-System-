/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '../lib/supabase';

export interface Order {
  id: string;
  customer_id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total_amount: number;
  order_number: string;
  delivery_fee: number;
  discount_amount: number;
}

export interface OrderItem {
  item_id: string;
  quantity: number;
  price_at_time: number;
}

export const orderService = {
  async createOrder(order: Omit<Order, 'id' | 'order_number'>, _items: OrderItem[]) {
    const { data, error } = await (supabase.from('orders') as any)
      .insert(order)
      .select()
      .single();
    if (error) throw error;

    // Add items...
    return data;
  },
  async getOrderHistory(customerId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', customerId);
    if (error) throw error;
    return data as Order[];
  }
};
