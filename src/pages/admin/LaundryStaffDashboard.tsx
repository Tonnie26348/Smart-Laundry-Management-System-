import { AdminLayout } from '@/layouts/AdminLayout';
import { Card } from '@/components/ui/Card';

export const LaundryStaffDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Laundry Staff Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <h3 className="text-sm text-gray-500">Orders</h3>
            <p className="text-sm text-gray-700 mb-2">Receive, process, and update status.</p>
            <a href="/admin/orders" className="text-primary-600 hover:underline">Manage Orders</a>
          </Card>
          <Card>
            <h3 className="text-sm text-gray-500">Item Inspections</h3>
            <p className="text-sm text-gray-700 mb-2">Record defects and upload photos.</p>
            <a href="/admin/inspections" className="text-primary-600 hover:underline">Manage Inspections</a>
          </Card>
          <Card>
            <h3 className="text-sm text-gray-500">Inventory</h3>
            <p className="text-sm text-gray-700 mb-2">Monitor supplies and usage.</p>
            <a href="/admin/inventory" className="text-primary-600 hover:underline">View Inventory</a>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};
