/* eslint-disable @typescript-eslint/no-explicit-any */
import { orderService } from '@/features/orders/orderService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const OrderForm = ({ customerId }: { customerId: string }) => {
  const selectedItems: any[] = [];

  const handleSubmit = async () => {
    try {
      await orderService.createOrder(customerId, selectedItems.map(item => ({
        laundry_item_id: item.id,
        quantity: 1,
        price: item.price_adjustment 
      })));
      alert('Order submitted!');
    } catch (e) {
      alert('Failed to submit order');
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">New Order</h2>
      <Button onClick={handleSubmit}>Submit Order</Button>
    </Card>
  );
};
