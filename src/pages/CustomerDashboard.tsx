import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch customer record
        const { data: customer } = await (supabase
          .from('customers')
          .select('id, loyalty_points, phone')
          .eq('profile_id', user.id)
          .single() as any);
        
        if (customer) {
          setLoyaltyPoints(customer.loyalty_points || 0);
          setPhoneNumber(customer.phone || '');

          // Fetch latest active order
          const { data: orders } = await supabase
            .from('orders')
            .select('*')
            .eq('customer_id', customer.id)
            .in('status', ['pending', 'pickup', 'washing', 'delivery'])
            .order('created_at', { ascending: false })
            .limit(1);

          if (orders && orders.length > 0) {
            setActiveOrder(orders[0]);
          }
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Hello!</h1>
        <p className="text-gray-500 mt-1">
            Ready for fresh laundry today? 
            {phoneNumber && <span className="ml-2 font-medium text-gray-700">| Contact: {phoneNumber}</span>}
        </p>
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
          {loading ? (
            <p className="text-3xl font-black">Loading...</p>
          ) : (
            <>
              <p className="text-3xl font-black">{loyaltyPoints}</p>
              <p className="text-sm text-primary-100 mt-2">KSh {Math.floor(loyaltyPoints / 10) * 10} discount available</p>
            </>
          )}
          <Button variant="ghost" className="mt-4 text-white hover:bg-primary-700 p-0 h-auto" onClick={() => navigate('/loyalty')}>View History →</Button>
        </Card>

        <Card>
          <h3 className="text-xl font-bold mb-2">Active Order</h3>
          {loading ? (
            <p>Loading...</p>
          ) : activeOrder ? (
            <>
              <div className="flex items-center gap-3 text-primary-600">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-600"></span>
                </span>
                <span className="font-bold capitalize">{activeOrder.status}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Order #{activeOrder.order_number}</p>
              <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => navigate(`/orders/${activeOrder.id}`)}>Track Order</Button>
            </>
          ) : (
            <p className="text-sm text-gray-500">No active orders.</p>
          )}
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
