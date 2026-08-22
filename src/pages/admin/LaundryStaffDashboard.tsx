import { AdminLayout } from '@/layouts/AdminLayout';
import { Card } from '@/components/ui/Card';

export const LaundryStaffDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Laundry Staff Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <h3 className="text-sm text-gray-500">Incoming Orders</h3>
            <a href="/admin/orders" className="text-primary-600 hover:underline">Process Laundry</a>
          </Card>
          <Card>
            <h3 className="text-sm text-gray-500">Item Inspections</h3>
            <a href="/admin/inspections" className="text-primary-600 hover:underline">View Inspections</a>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};
