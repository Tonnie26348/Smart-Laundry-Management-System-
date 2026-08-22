import { AdminLayout } from '@/layouts/AdminLayout';
import { Card } from '@/components/ui/Card';

export const DeliveryStaffDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Delivery Staff Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="text-sm text-gray-500">Deliveries</h3>
            <p className="text-sm text-gray-700 mb-2">View and manage your assigned deliveries.</p>
            <a href="/admin/deliveries" className="text-primary-600 hover:underline">Manage Deliveries</a>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};
