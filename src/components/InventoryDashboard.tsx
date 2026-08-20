import { useState, useEffect } from 'react';
import { inventoryService, InventoryItem } from '../services/inventoryService';
import { Card } from './ui/Card';

export const InventoryDashboard = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inventoryService.getItems()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading inventory...</div>;

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-bold">Inventory Dashboard</h2>
      {items.map((item) => (
        <Card key={item.id} className={item.current_stock < item.min_stock_level ? 'border-red-500' : ''}>
          <div className="flex justify-between">
            <h3 className="font-semibold">{item.name}</h3>
            <span>{item.current_stock} {item.unit}</span>
          </div>
          {item.current_stock < item.min_stock_level && <p className="text-red-500 text-sm">Low Stock!</p>}
        </Card>
      ))}
    </div>
  );
};
