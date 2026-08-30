import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Card } from '@/components/ui/Card';
import { ThematicHero } from '@/components/layout/ThematicHero';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';

export const DeliveryStaffDashboard = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDeliveryStats = async () => {
    setLoading(true);
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) {
            setLoading(false);
            return;
        }

        // Fetch counts
        const { count: pending, error: pendingError } = await supabase
          .from('deliveries')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_to', user.id)
          .neq('status', 'delivered');
        
        console.log('Debug: Current User ID:', user.id);
        console.log('Debug: Pending count result:', pending, 'Error:', pendingError);

        const { count: completed, error: completedError } = await supabase
          .from('deliveries')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_to', user.id)
          .eq('status', 'delivered');

        console.log('Debug: Completed count result:', completed, 'Error:', completedError);

        if (pendingError) throw pendingError;
        if (completedError) throw completedError;

        setPendingCount(pending || 0);
        setCompletedCount(completed || 0);
    } catch (err) {
        console.error('Error fetching delivery stats:', err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryStats();
  }, []);

  const updateDeliveryStatus = async (id: string, status: string) => {
    const { error } = await (supabase.from('deliveries') as any)
      .update({ status })
      .eq('id', id);

    if (error) {
        alert('Failed to update status: ' + error.message);
    } else {
        fetchDeliveryStats();
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'picked_up': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <ThematicHero 
          title="Delivery Staff Dashboard"
          subtitle="Fresh laundry, delivered on time."
          imageUrl="/images/laundry/delivery/laundry-delivery-worker.jpg"
          imageAlt="Delivery worker"
          variant="overlay"
        />
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Delivery Tasks</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.location.href='/admin/deliveries/pending'}>Pending Deliveries</Button>
            <Button variant="outline" size="sm" onClick={() => window.location.href='/admin/deliveries/completed'}>Completed Deliveries</Button>
            <Button onClick={fetchDeliveryStats} variant="outline" size="sm">Refresh</Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-700">Pending Deliveries</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
              {pendingCount === 0 && <p className="text-gray-500 mt-2">No pending deliveries.</p>}
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-700">Completed Deliveries</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{completedCount}</p>
              {completedCount === 0 && <p className="text-gray-500 mt-2">No completed deliveries.</p>}
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
