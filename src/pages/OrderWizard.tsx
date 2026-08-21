import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const OrderWizard = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

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
            <p className="text-gray-600">Select the items you'd like us to clean.</p>
            {/* Item selection UI would go here */}
            <div className="h-48 flex items-center justify-center border-2 border-dashed rounded-lg text-gray-400">
              Service/Item Selection List
            </div>
            <Button className="w-full" onClick={() => setStep(2)}>Next: Delivery Details</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Where and When?</h2>
            <p className="text-gray-600">Select your preferred pickup and delivery details.</p>
            {/* Delivery/Address UI would go here */}
            <div className="h-48 flex items-center justify-center border-2 border-dashed rounded-lg text-gray-400">
              Address & Schedule Selector
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1" onClick={() => setStep(3)}>Next: Review</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Review Your Order</h2>
            <p className="text-gray-600">Please confirm everything is correct before submitting.</p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>KSh 1,100</span></div>
              <div className="flex justify-between text-sm"><span>Delivery</span><span>KSh 100</span></div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Total</span><span>KSh 1,200</span></div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1" onClick={() => navigate('/dashboard')}>Submit & Pay</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
