import { Card } from './ui/Card';

interface InvoiceProps {
  data: {
    order_number: string;
    created_at: string;
    customers: { phone: string };
    order_items: { id: string; quantity: number; laundry_items: { name: string }; price_at_time: number }[];
    delivery_fee: number;
    discount_amount: number;
    total_amount: number;
  };
}

export const Invoice = ({ data }: InvoiceProps) => {
  return (
    <Card className="max-w-3xl mx-auto print:shadow-none print:border-none">
      <h1 className="text-2xl font-bold">Invoice #{data.order_number}</h1>
      <div className="mt-4 border-t pt-4">
        <p><strong>Customer:</strong> {data.customers.phone}</p>
        <p><strong>Date:</strong> {new Date(data.created_at).toLocaleDateString()}</p>
      </div>
      <table className="w-full mt-6">
        <thead>
          <tr className="border-b">
            <th className="text-left pb-2">Item</th>
            <th className="text-right pb-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {data.order_items.map((item) => (
            <tr key={item.id}>
              <td className="py-2">{item.laundry_items.name} x {item.quantity}</td>
              <td className="text-right">${item.price_at_time.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 border-t pt-4 text-right">
        <p><strong>Delivery Fee:</strong> ${data.delivery_fee.toFixed(2)}</p>
        <p><strong>Discount:</strong> -${data.discount_amount.toFixed(2)}</p>
        <p className="text-xl font-bold mt-2">Total: ${data.total_amount.toFixed(2)}</p>
      </div>
      <div className="mt-8 text-center print:hidden">
        <button onClick={() => window.print()} className="bg-primary-600 text-white px-4 py-2 rounded">
          Print Invoice
        </button>
      </div>
    </Card>
  );
};
