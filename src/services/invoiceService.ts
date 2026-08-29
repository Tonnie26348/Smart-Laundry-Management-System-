import { supabase } from '../lib/supabase';

export const invoiceService = {
  async getInvoiceData(orderId: string) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, customers(*, profiles(*)), order_items(*, laundry_item_services(*, services(*))), payments(*)')
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;
    return order;
  },

  generateReceiptText(order: any): string {
    console.log('Order object for receipt:', order);
    console.log('Order items:', order.order_items);
    
    const items = order.order_items.map((item: any) => {
      const serviceName = item.laundry_item_services?.services?.name || 'Unknown';
      return `${serviceName.padEnd(16)} ${item.quantity.toString().padEnd(7)} ${item.line_total.toLocaleString()}`;
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
