import { AdminLayout } from '@/layouts/AdminLayout';
import { Card } from '@/components/ui/Card';
import { ThematicHero } from '@/components/layout/ThematicHero';

export const LaundryStaffDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <ThematicHero 
          title="Laundry Staff Dashboard"
          subtitle="Where laundry becomes clean, fresh and ready."
          imageUrl="/images/laundry/laundry-staff/laundry-staff-washing.jpg"
          imageAlt="Laundry staff washing"
          variant="overlay"
        />
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
        </div>
      </div>
    </AdminLayout>
  );
};
