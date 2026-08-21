/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsService } from '../services/analyticsService';
import { Card } from './ui/Card';

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    analyticsService.getDashboardMetrics().then(setMetrics);
  }, []);

  if (!metrics) return <div>Loading...</div>;

  // Transform revenue_data for Recharts
  const chartData = (metrics.revenue_data || []).map((item: any) => ({
    name: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    revenue: item.revenue
  })).reverse();

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <h3 className="text-sm text-gray-500">Today's Orders</h3>
          <p className="text-2xl font-bold">{metrics.today_orders}</p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-500">Pending Orders</h3>
          <p className="text-2xl font-bold">{metrics.pending_orders}</p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-500">Revenue</h3>
          <p className="text-2xl font-bold">KSh {metrics.total_revenue}</p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-500">Low Stock</h3>
          <p className="text-2xl font-bold text-red-600">{metrics.low_stock_count}</p>
        </Card>
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Revenue Trend (Last 7 Days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: any) => [`KSh ${Number(value).toFixed(2)}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
