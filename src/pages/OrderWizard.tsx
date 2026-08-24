import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { catalogService, LaundryItem, Service } from '@/features/catalog/catalogService';

export const OrderWizard = () => {
  const [step, setStep] = useState(1);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [laundryItems, setLaundryItems] = useState<LaundryItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [cart, setCart] = useState<{ laundry_item_id: string; service_id: string; quantity: number }[]>([]);
  
  const [formData, setFormData] = useState({
    pickup_address: '',
    pickup_city: '',
    delivery_address: '',
    delivery_city: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setErrorMsg('Authentication required'); return; }

      const [customerRes, itemsData, servicesData] = await Promise.all([
        (supabase.from('customers').select('id').eq('profile_id', user.id).single() as any),
        catalogService.getLaundryItems(),
        catalogService.getServices()
      ]);

      if (customerRes.error) {
        console.error('Error fetching customer record:', customerRes.error);
        setErrorMsg('Could not find customer record.');
        return;
      }

      setCustomerId(customerRes.data.id);
      setLaundryItems(itemsData);
      setServices(servicesData);
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!customerId) return;
    
    // Validation
    if (!formData.pickup_address.trim() || !formData.pickup_city.trim()) { setErrorMsg('Pickup address and city required.'); return; }
    if (!formData.delivery_address.trim() || !formData.delivery_city.trim()) { setErrorMsg('Delivery address and city required.'); return; }
    if (cart.length === 0) { setErrorMsg('Add at least one item to cart.'); return; }

    setSubmitting(true);
    setErrorMsg(null);
    
    // Call atomic RPC
    const { data: result, error: rpcError } = await (supabase.rpc as any)('submit_order_atomic', {
        p_customer_id: customerId,
        p_items: JSON.stringify(cart),
        p_pickup_address_data: { 
            address_line1: formData.pickup_address, 
            city: formData.pickup_city 
        },
        p_delivery_address_data: { 
            address_line1: formData.delivery_address, 
            city: formData.delivery_city 
        }
    });

    if (rpcError) {
      console.error('SERVER ERROR (RPC SUBMISSION):', rpcError);
      setErrorMsg(`Order submission failed: ${rpcError.message}`);
      setSubmitting(false);
      return;
    }

    alert('Order submitted successfully! Order ID: ' + result.order_id);
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

      <Card className="p-6">
        {errorMsg && <div className="p-4 mb-4 bg-red-100 text-red-700 text-sm rounded">{errorMsg}</div>}
        
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">What are we cleaning?</h2>
            {/* Simple selection UI for items */}
            <select className="w-full p-2 border rounded" onChange={(e) => {
                const item = JSON.parse(e.target.value);
                setCart([...cart, { laundry_item_id: item.id, service_id: services[0]?.id || '', quantity: 1 }]);
            }}>
                <option value="">Select an Item</option>
                {laundryItems.map(i => <option key={i.id} value={JSON.stringify(i)}>{i.name}</option>)}
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
            {/* Order Summary display */}
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
