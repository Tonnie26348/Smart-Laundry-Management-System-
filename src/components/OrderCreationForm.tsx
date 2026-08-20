import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';

export const OrderCreationForm = () => {
  const [total, setTotal] = useState(0);

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Create New Order</h2>
      <div className="space-y-4">
        {/* Simplified selection - placeholder */}
        <Input label="Select Items" placeholder="e.g., 2 Shirts" />
        <div className="text-lg font-bold">Total: ${total.toFixed(2)}</div>
        <Button>Review Order</Button>
      </div>
    </Card>
  );
};
