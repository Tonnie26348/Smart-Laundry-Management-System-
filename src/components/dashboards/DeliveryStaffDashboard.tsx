import { Card } from '@/components/ui/Card';

export const DeliveryStaffDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Delivery Staff Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Assigned Pickups</h3>
          <p className="text-2xl font-bold mt-2">4</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Assigned Deliveries</h3>
          <p className="text-2xl font-bold mt-2 text-primary-600">6</p>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Active Transit Map</h2>
        <Card className="flex items-center justify-center h-48 bg-gray-50 text-gray-400">
          Route visualization optimized for assigned tasks.
        </Card>
      </div>
    </div>
  );
};
