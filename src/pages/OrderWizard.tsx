import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export const OrderWizard = () => {
  const [step, setStep] = useState(1);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    items: 'Wash & Fold',
    pickup_address: '',
    pickup_city: '',
    delivery_address: '',
    delivery_city: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setErrorMsg('Authentication required');
        return;
      }

      const { data, error } = await (supabase
        .from('customers')
        .select('id')
        .eq('profile_id', user.id)
        .single() as any);

      if (error) {
        console.error('Error fetching customer record:', error);
        setErrorMsg('Could not find customer record. Please contact support.');
        return;
      }

      setCustomerId(data.id);
    };
    fetchCustomerId();
  }, []);

  const handleSubmit = async () => {
    if (!customerId) return;
    
    // Validation
    if (!formData.pickup_address.trim()) { setErrorMsg('Please enter pickup address.'); return; }
    if (!formData.pickup_city.trim()) { setErrorMsg('Please enter pickup city.'); return; }
    if (!formData.delivery_address.trim()) { setErrorMsg('Please enter delivery address.'); return; }
    if (!formData.delivery_city.trim()) { setErrorMsg('Please enter delivery city.'); return; }

    setSubmitting(true);
    setErrorMsg(null);
    
    // Call atomic RPC
    const { data: orderId, error: rpcError } = await (supabase.rpc('submit_order', {
        p_customer_id: customerId,
        p_items: JSON.stringify([{item_id: '00000000-0000-0000-0000-000000000000', quantity: 1, price: 1200}]), // Simplified for now
        p_pickup_address_line1: formData.pickup_address,
        p_pickup_city: formData.pickup_city,
        p_delivery_address_line1: formData.delivery_address,
        p_delivery_city: formData.delivery_city,
        p_total_amount: 1200
    }) as any);

    if (rpcError) {
      console.error('SERVER ERROR (RPC SUBMISSION):', rpcError);
      setErrorMsg(`Order submission failed: ${rpcError.message}`);
      setSubmitting(false);
      return;
    }

    alert('Order submitted successfully! Order ID: ' + orderId);
    navigate('/dashboard');
    setSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">New Order</h1>
        <span className="text-sm text-gray-500 font-medium">Step {step} of 3</span>
      </div>

      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-primary-600' : 'bg-gray-200'}`} />
        ))}
      </div>

      <Card>
        {errorMsg && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 text-sm rounded">
            <strong>Submission Failed:</strong> {errorMsg}
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">What are we cleaning?</h2>
            <select className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, items: e.target.value})}>
                <option>Wash & Fold</option>
                <option>Dry Clean</option>
                <option>Ironing Only</option>
            </select>
            <Button className="w-full" onClick={() => setStep(2)}>Next: Delivery Details</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Where?</h2>
            <input placeholder="Pickup Address" className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, pickup_address: e.target.value})} />
            <input placeholder="Pickup City" className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, pickup_city: e.target.value})} />
            <input placeholder="Delivery Address" className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, delivery_address: e.target.value})} />
            <input placeholder="Delivery City" className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, delivery_city: e.target.value})} />
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1" onClick={() => setStep(3)}>Next: Review</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Review Your Order</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
                <p>Items: {formData.items}</p>
                <p>Pickup: {formData.pickup_address}, {formData.pickup_city}</p>
                <p>Delivery: {formData.delivery_address}, {formData.delivery_city}</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Order'}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
