import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';

export const DeliveryStaffDashboard = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<string>('');

  const appendDebug = (msg: string) => {
    setDebugLog(prev => prev + `\n[${new Date().toLocaleTimeString()}] ${msg}`);
  };

  const fetchAssignedDeliveries = async () => {
    setLoading(true);
    appendDebug('Initiating fetchAssignedDeliveries...');
    
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
            appendDebug(`Error getting user: ${userError.message}`);
            throw userError;
        }
        if (!user) {
            appendDebug('No user logged in according to supabase.auth.getUser()');
            setUserId(null);
            setLoading(false);
            return;
        }

        setUserId(user.id);
        appendDebug(`Logged in user ID: ${user.id}`);

        appendDebug('Querying "deliveries" table...');
        const { data, error } = await supabase
          .from('deliveries')
          .select('*, orders(order_number)')
          .eq('assigned_to', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
            appendDebug(`Database Query Error: ${error.message}`);
            throw error;
        } else {
            appendDebug(`Query successful. Found ${data?.length || 0} matching rows.`);
            setDeliveries(data || []);
        }
    } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Unknown error';
        appendDebug(`Caught exception: ${errMsg}`);
        alert('Failed to refresh deliveries: ' + errMsg);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedDeliveries();
  }, []);

  const updateDeliveryStatus = async (id: string, status: string) => {
    const { error } = await (supabase.from('deliveries') as any)
      .update({ status })
      .eq('id', id);

    if (error) {
        alert('Failed to update status: ' + error.message);
    } else {
        fetchAssignedDeliveries();
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
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Delivery Staff</h2>
          <Button onClick={fetchAssignedDeliveries} variant="outline" size="sm">Refresh</Button>
        </div>

        {/* Visual Debug Panel */}
        <Card className="p-4 bg-gray-900 text-gray-100 font-mono text-xs space-y-2">
          <div className="flex justify-between items-center border-b border-gray-700 pb-2">
            <span className="font-bold text-yellow-400">🔍 Visual Debug Panel</span>
            <Button 
              size="xs" 
              variant="outline" 
              className="text-white border-gray-600 hover:bg-gray-800"
              onClick={() => setDebugLog(`[${new Date().toLocaleTimeString()}] Log cleared.`)}
            >
              Clear Logs
            </Button>
          </div>
          <div>
            <span className="text-gray-400">User ID:</span> {userId || 'No user logged in'}
          </div>
          <div>
            <span className="text-gray-400">Supabase Endpoint:</span> {import.meta.env.VITE_SUPABASE_URL || 'Not specified'}
          </div>
          <div className="space-y-1">
            <span className="text-gray-400">Execution Logs:</span>
            <pre className="p-2 bg-black rounded overflow-x-auto max-h-40 overflow-y-auto whitespace-pre-wrap">
              {debugLog || 'No logs generated yet. Click Refresh to test.'}
            </pre>
          </div>
        </Card>
        
        {loading ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Assigned Deliveries ({deliveries.length})</h3>
            {deliveries.length === 0 ? (
              <Card className="p-8 text-center text-gray-500">
                No deliveries found. Please ensure you are logged in as delivery staff and have assigned deliveries.
              </Card>
            ) : (
              deliveries.map(delivery => (
                <Card key={delivery.id} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-primary-700">Order #{delivery.orders?.order_number}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(delivery.status)}`}>
                          {delivery.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Type: <span className="font-medium capitalize">{delivery.delivery_type}</span>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Pickup Information</h4>
                      <p className="text-sm text-gray-700">{delivery.pickup_address || 'Not specified'}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Delivery Information</h4>
                      <p className="text-sm text-gray-700">{delivery.delivery_address || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                    {delivery.status !== 'delivered' && (
                      <>
                        <div className="flex items-center gap-2 mr-auto">
                          <span className="text-xs font-semibold text-gray-500 uppercase">Update Status:</span>
                          <select 
                            className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            value={delivery.status}
                            onChange={(e) => updateDeliveryStatus(delivery.id, e.target.value)}
                          >
                            <option value="assigned">Assigned</option>
                            <option value="picked_up">Picked Up</option>
                            <option value="in_transit">In Transit</option>
                            <option value="failed">Failed</option>
                          </select>
                        </div>
                        
                        <Button 
                          size="sm" 
                          onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Confirm Delivery
                        </Button>
                      </>
                    )}
                    {delivery.status === 'delivered' && (
                      <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                        ✓ Delivery Completed
                      </span>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
