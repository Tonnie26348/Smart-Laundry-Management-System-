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
    delivery_address: '',
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
    setSubmitting(true);
    setErrorMsg(null);
    
    // 1. Insert order
    const payload = {
        customer_id: customerId,
        status: 'pending',
        total_amount: 1200
    };

    const { data: order, error: orderError } = await (supabase.from('orders') as any)
      .insert(payload)
      .select('id')
      .single();

    if (orderError) {
      console.error('SERVER ERROR (ORDER INSERT):', orderError);
      setErrorMsg(`Order submission failed: ${orderError.message}`);
      setSubmitting(false);
      return;
    }

    // 2. Insert delivery records
    // Create address records first
    const { data: pickupAddr, error: pickupAddrError } = await (supabase.from('delivery_addresses').insert([
        {
            customer_id: customerId,
            address_line1: formData.pickup_address,
            label: 'Pickup'
        }
    ]).select('id').single() as any);

    const { data: deliveryAddr, error: deliveryAddrError } = await (supabase.from('delivery_addresses').insert([
        {
            customer_id: customerId,
            address_line1: formData.delivery_address,
            label: 'Delivery'
        }
    ]).select('id').single() as any);

    if (pickupAddrError || deliveryAddrError) {
        setErrorMsg('Failed to create delivery addresses.');
        setSubmitting(false);
        return;
    }

    const { error: deliveryError } = await (supabase.from('deliveries') as any).insert([
        {
            order_id: order.id,
            delivery_type: 'pickup',
            pickup_address_id: pickupAddr.id,
            pickup_address: formData.pickup_address,
            status: 'pending'
        },
        {
            order_id: order.id,
            delivery_type: 'delivery',
            delivery_address_id: deliveryAddr.id,
            delivery_address: formData.delivery_address,
            status: 'pending'
        }
    ]);

    if (deliveryError) {
        console.error('SERVER ERROR (DELIVERY INSERT):', deliveryError);
        setErrorMsg(`Delivery record creation failed: ${deliveryError.message}`);
    } else {
        alert('Order submitted successfully!');
        navigate('/dashboard');
    }
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
            <input placeholder="Delivery Address" className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, delivery_address: e.target.value})} />
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
                <p>Pickup: {formData.pickup_address}</p>
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
