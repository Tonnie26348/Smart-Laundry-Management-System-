/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase';

export interface OrderItem {
  laundry_item_id: string;
  quantity: number;
  price: number;
}

export const orderService = {
  async createOrder(customerId: string, items: OrderItem[]) {
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const { data: order, error: orderError } = await (supabase.from('orders') as any)
      .insert({ customer_id: customerId, total_price: totalPrice, status: 'pending' })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map(item => ({
      order_id: order.id,
      ...item
    }));

    const { error: itemsError } = await (supabase.from('order_items') as any).insert(orderItems);
    if (itemsError) throw itemsError;

    return order;
  },
  async getOrders() {
    const { data, error } = await supabase.from('orders').select('*, order_items(*)');
    if (error) throw error;
    return data;
  },
  async updateStatus(orderId: string, status: string) {
    const { error } = await (supabase.from('orders') as any).update({ status }).eq('id', orderId);
    if (error) throw error;
  }
};
