import { useEffect, useState, useCallback } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { reportService, BusinessReportData } from '@/features/admin/reportService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Download, 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Filter
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export const ReportsPage = () => {
  const [data, setData] = useState<BusinessReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const report = await reportService.getBusinessReport(startDate, endDate);
      setData(report);
      setError(null);
    } catch (err) {
      setError('Failed to load report data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleExport = () => {
    if (!data) return;
    
    // Export Daily Revenue
    reportService.exportToCSV(data.daily_revenue as unknown as Record<string, unknown>[], `revenue_report_${startDate}_to_${endDate}`);
    
    // Export Service Distribution
    reportService.exportToCSV(data.service_distribution as unknown as Record<string, unknown>[], `service_report_${startDate}_to_${endDate}`);
  };

  const statusData = data ? Object.entries(data.status_distribution).map(([name, value]) => ({ name, value })) : [];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Business Reports</h1>
            <p className="text-gray-500">Detailed overview of business performance</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="w-40"
              />
              <span className="text-gray-400">to</span>
              <Input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="w-40"
              />
            </div>
            <Button variant="outline" size="sm" onClick={fetchReport}>
              <Filter size={16} className="mr-2" />
              Apply
            </Button>
            <Button variant="primary" size="sm" onClick={handleExport} disabled={!data}>
              <Download size={16} className="mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading reports...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-600">
            {error}
          </div>
        ) : data && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="flex items-center p-6 space-x-4">
                <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">KSh {data.total_revenue.toLocaleString()}</p>
                </div>
              </Card>

              <Card className="flex items-center p-6 space-x-4">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{data.total_orders}</p>
                </div>
              </Card>

              <Card className="flex items-center p-6 space-x-4">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">KSh {Math.round(data.avg_order_value).toLocaleString()}</p>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend Chart */}
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-6">Revenue Trend</h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.daily_revenue}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(val) => format(new Date(val), 'MMM dd')}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any) => [`KSh ${typeof value === 'number' ? value.toLocaleString() : value}`, 'Revenue']}
                        labelFormatter={(label: any) => label ? format(new Date(label), 'PPP') : ''}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Status Distribution Chart */}
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-6">Order Status Distribution</h2>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Top Services Table/Chart */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-6">Top Performing Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.service_distribution} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="service_name" type="category" width={100} />
                      <Tooltip formatter={(value: any) => [`KSh ${typeof value === 'number' ? value.toLocaleString() : value}`, 'Revenue']} />
                      <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="overflow-hidden border rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.service_distribution.map((service, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.service_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.order_count}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">KSh {service.revenue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};
