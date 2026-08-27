import { ThematicHero } from '@/components/layout/ThematicHero';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [customerCount, setCustomerCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCustomerCount = async () => {
      const { count, error } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });
        
      if (!error && count !== null) {
        setCustomerCount(count);
      }
    };
    fetchCustomerCount();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 border-b">
        <div className="text-2xl font-bold text-primary-600">Smart Laundry</div>
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
          <Button onClick={() => navigate('/register')}>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-16">
        <ThematicHero 
            title="Laundry Redefined. Effortless Care."
            subtitle="Experience the future of laundry with on-demand pickup, professional-grade cleaning, and seamless delivery. Focus on your day while we handle the rest."
            imageUrl="/images/laundry/landing/laundry-hero-washing-machine.jpg"
            imageAlt="Professional handling modern laundry"
            variant="split"
            className="items-start"
        >
            {/* Wrapper to control internal spacing and override ThematicHero's space-y-4 */}
            <div className="flex flex-col gap-24 pt-4">
              <div className="flex gap-4">
                <Button size="lg" className="px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all" onClick={() => navigate('/register')}>Get Started</Button>
                <Button 
                size="lg" 
                variant="outline" 
                type="button"
                className="px-8 py-6 text-lg font-semibold border-2" 
                onClick={() => {
                  console.log('Navigating to /services');
                  navigate('/services');
                }}
              >
                Explore Services
              </Button>
              </div>
              
              {/* Logo Section */}
              <div>
                <img 
                  src="/images/laundry/landing/smart-laundry-logo.jpg" 
                  alt="Smart Laundry Logo" 
                  className="w-full max-w-xl h-auto object-contain" 
                />
              </div>
            </div>
            
            <p className="text-sm text-gray-500 pt-4">
              Trusted by {customerCount !== null ? `${customerCount}+` : '...'} satisfied customers.
            </p>
        </ThematicHero>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">1</div>
            <h3 className="text-xl font-bold mb-2">Schedule Pickup</h3>
            <p className="text-gray-600">Tell us when and where. We'll be there to pick up your items.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">2</div>
            <h3 className="text-xl font-bold mb-2">Expert Care</h3>
            <p className="text-gray-600">Our professionals treat your clothes with the highest quality standards.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">3</div>
            <h3 className="text-xl font-bold mb-2">Fresh Delivery</h3>
            <p className="text-gray-600">Clean, folded, and fresh laundry delivered back to your doorstep.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
