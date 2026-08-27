import { useEffect, useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { analyticsService, AdminAnalytics } from '@/features/admin/analyticsService';
import { Card } from '@/components/ui/Card';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  Truck 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    analyticsService.getAdminAnalytics()
      .then(setAnalytics)
      .catch(() => setError('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><div className="p-6">Loading analytics...</div></AdminLayout>;
  if (error) return <AdminLayout><div className="p-6 text-red-600">{error}</div></AdminLayout>;

  const statCards = [
    { label: 'Today\'s Orders', value: analytics?.today_orders, icon: ShoppingBag, color: 'text-blue-600' },
    { label: 'Pending Orders', value: analytics?.pending_orders, icon: Clock, color: 'text-amber-600' },
    { label: 'Completed Orders', value: analytics?.completed_orders, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Total Revenue', value: `KSh ${analytics?.total_revenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600' },
    { label: 'Total Customers', value: analytics?.customer_count, icon: Users, color: 'text-purple-600' },
    { label: 'Low Stock Items', value: analytics?.low_stock_count, icon: AlertTriangle, color: 'text-red-600' },
    { label: 'Pending Deliveries', value: analytics?.pending_deliveries, icon: Truck, color: 'text-indigo-600' },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Business Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="p-6 flex items-center space-x-4">
              <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-bold mb-6">Revenue Trend (Last 7 Days)</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.revenue_data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`KSh ${value.toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#059669" fill="#10b981" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};
