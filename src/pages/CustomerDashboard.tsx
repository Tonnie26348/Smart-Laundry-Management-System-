import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const CustomerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Hello!</h1>
        <p className="text-gray-500 mt-1">Ready for fresh laundry today?</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">New Order</h3>
            <p className="text-sm text-gray-600 mb-4">Book a pickup and let us handle the rest.</p>
          </div>
          <Button onClick={() => navigate('/orders/new')}>Start Order</Button>
        </Card>

        <Card className="bg-primary-600 text-white">
          <h3 className="text-xl font-bold mb-2">Loyalty Points</h3>
          <p className="text-3xl font-black">240</p>
          <p className="text-sm text-primary-100 mt-2">KSh 60 discount available</p>
          <Button variant="ghost" className="mt-4 text-white hover:bg-primary-700 p-0 h-auto">View History →</Button>
        </Card>

        <Card>
          <h3 className="text-xl font-bold mb-2">Active Order</h3>
          <div className="flex items-center gap-3 text-primary-600">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-600"></span>
            </span>
            <span className="font-bold">Washing</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Estimated delivery: Tomorrow, 10 AM</p>
          <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => navigate('/orders/123')}>Track Order</Button>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Order #</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate('/orders/ORD-001')}>
                <td className="px-6 py-4 font-medium">ORD-001</td>
                <td className="px-6 py-4 text-sm text-gray-500">Aug 20, 2026</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 uppercase">Completed</span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-gray-900">KSh 1,200</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};
