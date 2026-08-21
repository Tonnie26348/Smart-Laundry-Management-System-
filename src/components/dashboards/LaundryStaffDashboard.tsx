import { Card } from '@/components/ui/Card';

export const LaundryStaffDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Laundry Staff Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Incoming Orders</h3>
          <p className="text-2xl font-bold mt-2">8</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500">In Processing</h3>
          <p className="text-2xl font-bold mt-2 text-primary-600">14</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Quality Check</h3>
          <p className="text-2xl font-bold mt-2 text-yellow-600">5</p>
        </Card>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Recent Inspection Tasks</h2>
        <Card className="flex items-center justify-center h-32 text-gray-400 border-dashed border-2">
          Inspection queue is empty.
        </Card>
      </div>
    </div>
  );
};
