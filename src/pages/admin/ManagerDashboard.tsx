import { AdminLayout } from '@/layouts/AdminLayout';
import { Card } from '@/components/ui/Card';

export const ManagerDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Manager Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <h3 className="text-sm text-gray-500">Orders Management</h3>
            <a href="/admin/orders" className="text-primary-600 hover:underline">View Orders</a>
          </Card>
          <Card>
            <h3 className="text-sm text-gray-500">Inventory Management</h3>
            <a href="/admin/inventory" className="text-primary-600 hover:underline">View Inventory</a>
          </Card>
          <Card>
            <h3 className="text-sm text-gray-500">Payments & Reports</h3>
            <a href="/admin/payments" className="text-primary-600 hover:underline">View Payments</a>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};
