import { supabase } from '../lib/supabase';

export const invoiceService = {
  async getInvoiceData(orderId: string) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *, 
        customers(*, profiles(*)), 
        order_items(
          *, 
          laundry_item_services(
            *, 
            services(*)
          )
        ), 
        payments(*)
      `)
      .eq('id', orderId)
      .single();

    console.log('DEBUG: Full order object:', JSON.stringify(order, null, 2));

    if (orderError) throw orderError;
    return order;
  },

  generateReceiptText(order: any): string {
    console.log('Generating receipt for order:', order);
    
    // The items are in order.order_items. 
    // They are linked to laundry_item_services via laundry_item_service_id.
    const items = order.order_items.map((item: any) => {
      const serviceName = item.laundry_item_services?.services?.name || 'Unknown Item';
      const quantity = item.quantity || 0;
      // Based on 20260824_submit_order_atomic.sql, order_items table has 'price_at_time'.
      // However, the mapping uses 'line_total'. Let's check the items log again.
      // The previous debug log showed total_amount but no line_total in order_items.
      // Wait, order_items returned from the select is likely different than the insertion payload.
      // If the RPC inserted 'line_total', it should be there.
      const price = item.line_total || (item.price_at_time * item.quantity);
      
      return `${serviceName.padEnd(16)} ${quantity.toString().padEnd(7)} ${price.toLocaleString()}`;
    }).join('\n');

    return `
           SMART LAUNDRY
        Laundry Management System

Order: ${order.order_number || order.id.slice(0, 8)}
Customer: ${order.customers.profiles.full_name}
Date: ${new Date(order.created_at).toLocaleDateString()}

--------------------------------
Item             Qty       Price
--------------------------------
${items}
--------------------------------
Subtotal                   ${order.total_amount.toLocaleString()}
Delivery                   ${order.delivery_fee || 0}
Discount                   ${order.discount_amount || 0}
--------------------------------
TOTAL                      ${order.total_amount.toLocaleString()}
--------------------------------

Payment: ${order.payments?.[0]?.payment_method || 'N/A'}
Status: ${order.status.toUpperCase()}

Thank you for choosing us!
`;
  },
  downloadReceipt(order: any) {
    const text = this.generateReceiptText(order);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt_${order.order_number || order.id.slice(0, 8)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }
};
