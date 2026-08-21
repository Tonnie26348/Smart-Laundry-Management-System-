import { Card } from '@/components/ui/Card';

export const ManagerDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Manager Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Active Operations</h3>
          <p className="text-2xl font-bold mt-2">Optimal</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold mt-2">142</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Low Stock Items</h3>
          <p className="text-2xl font-bold mt-2 text-red-600">3</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Pending Deliveries</h3>
          <p className="text-2xl font-bold mt-2">12</p>
        </Card>
      </div>
    </div>
  );
};
