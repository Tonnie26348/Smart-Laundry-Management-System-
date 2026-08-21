import { Card } from './ui/Card';

interface InvoiceProps {
  data: {
    order_number: string;
    created_at: string;
    total_price: number;
    delivery_fee: number;
    discount_amount: number;
    customers: {
      phone: string;
      address: string;
    };
    order_items: {
      id: string;
      quantity: number;
      price: number; // Snapshot of price at time of order
      laundry_items: {
        name: string;
      };
    }[];
    payments: {
      status: string;
      transaction_id: string;
    }[];
  };
}

export const Invoice = ({ data }: InvoiceProps) => {
  const payment = data.payments?.[0];

  return (
    <Card className="max-w-3xl mx-auto print:shadow-none print:border-none">
      {/* Business Details */}
      <div className="flex justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-600">Smart Laundry Ltd.</h1>
          <p className="text-sm text-gray-500">123 Laundry Avenue, Nairobi</p>
          <p className="text-sm text-gray-500">support@smartlaundry.co.ke</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold">Receipt</h2>
          <p className="text-sm text-gray-500">Invoice #{data.order_number}</p>
          <p className="text-sm text-gray-500">Date: {new Date(data.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Customer Details */}
      <div className="mt-4">
        <h3 className="font-bold text-gray-700">Bill To:</h3>
        <p className="text-sm">Phone: {data.customers?.phone}</p>
        <p className="text-sm">Address: {data.customers?.address}</p>
      </div>

      {/* Items & Services */}
      <table className="w-full mt-6 text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="pb-2">Item/Service</th>
            <th className="pb-2 text-center">Qty</th>
            <th className="pb-2 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {data.order_items?.map((item) => (
            <tr key={item.id} className="border-b text-sm">
              <td className="py-2">{item.laundry_items?.name}</td>
              <td className="py-2 text-center">{item.quantity}</td>
              <td className="py-2 text-right">KSh {item.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals & Payments */}
      <div className="mt-6 flex justify-between">
        <div>
          <h3 className="font-bold text-gray-700">Payment Information:</h3>
          <p className="text-sm">Status: <span className="font-semibold uppercase">{payment?.status || 'unpaid'}</span></p>
          {payment?.transaction_id && (
            <p className="text-sm">M-Pesa Ref: <span className="font-mono font-semibold">{payment.transaction_id}</span></p>
          )}
        </div>
        <div className="text-right space-y-1">
          <p className="text-sm">Delivery Fee: KSh {data.delivery_fee ? data.delivery_fee.toFixed(2) : '0.00'}</p>
          <p className="text-sm text-red-500">Discount: -KSh {data.discount_amount ? data.discount_amount.toFixed(2) : '0.00'}</p>
          <p className="text-xl font-bold text-primary-600 pt-2 border-t">Total: KSh {data.total_price.toFixed(2)}</p>
        </div>
      </div>

      {/* Print Trigger */}
      <div className="mt-8 text-center print:hidden">
        <button 
          onClick={() => window.print()} 
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Print Receipt
        </button>
      </div>
    </Card>
  );
};
