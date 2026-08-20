import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { Card } from './ui/Card';

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    analyticsService.getDashboardMetrics().then(setMetrics);
  }, []);

  if (!metrics) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <h3 className="text-sm text-gray-500">Today's Orders</h3>
        <p className="text-2xl font-bold">{metrics.today_orders}</p>
      </Card>
      <Card>
        <h3 className="text-sm text-gray-500">Pending</h3>
        <p className="text-2xl font-bold">{metrics.pending_orders}</p>
      </Card>
      <Card>
        <h3 className="text-sm text-gray-500">Total Revenue</h3>
        <p className="text-2xl font-bold">${metrics.total_revenue}</p>
      </Card>
    </div>
  );
};
