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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Fetch a sample record to inspect column names
      const { data, error } = await (supabase
        .from('customers')
        .select('*')
        .limit(1) as any);
        
      if (error) {
        console.error('Error fetching customers:', error);
        return;
      }
        
      if (data && data.length > 0) {
        console.log('Customer record keys:', Object.keys(data[0]));
        // Try to find the user ID based on the logged in user ID
        const customer = data.find((c: any) => 
            Object.values(c).includes(user.id)
        );
        if (customer) {
            setCustomerId(customer.id);
        }
      } else {
        setCustomerId(null);
      }
    };
    fetchCustomerId();
  }, []);

  const handleSubmit = async () => {
    if (!customerId) return;
    setSubmitting(true);
    
    console.log('Submitting order for customer:', customerId);
    
    // 1. Insert order
    const payload = {
        customer_id: customerId,
        status: 'pending',
        total_amount: 1200
    };
    console.log('Order payload:', payload);

    const { data: order, error: orderError } = await (supabase.from('orders') as any)
      .insert(payload)
      .select('id')
      .single();

    if (orderError) {
      console.error('SERVER ERROR (ORDER INSERT):', orderError);
      alert('Order submission failed. Please check console for details.');
      setSubmitting(false);
      return;
    }

    // 2. Insert delivery records
    console.log('Order created, inserting deliveries for order:', order.id);
    const { error: deliveryError } = await (supabase.from('deliveries') as any).insert([
        {
            order_id: order.id,
            delivery_type: 'pickup',
            address: formData.pickup_address,
            status: 'pending'
        },
        {
            order_id: order.id,
            delivery_type: 'delivery',
            address: formData.delivery_address,
            status: 'pending'
        }
    ]);

    if (deliveryError) {
        console.error('SERVER ERROR (DELIVERY INSERT):', deliveryError);
        alert('Order created, but failed to schedule pickup/delivery.');
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
