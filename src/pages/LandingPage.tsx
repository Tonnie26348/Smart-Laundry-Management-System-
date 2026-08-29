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
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end sm:space-x-4">
          <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
          <Button onClick={() => navigate('/register')}>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-16">
        <ThematicHero 
            title="Premium Laundry. Delivered to your doorstep."
            subtitle="Enjoy stress-free laundry services in Nairobi. We pick up, clean, and deliver right to your door."
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
                className="px-8 py-6 text-lg font-semibold border-2" 
                onClick={() => navigate('/services')}
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
              {customerCount && customerCount > 0 
                ? `Trusted by ${customerCount}+ satisfied customers.` 
                : 'Join our growing family of satisfied customers.'}
            </p>
        </ThematicHero>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Schedule', desc: 'Book a pickup via our app or website.' },
              { step: '2', title: 'Pickup', desc: 'Our rider picks up your laundry at your convenience.' },
              { step: '3', title: 'Clean', desc: 'We professionally clean and press your garments.' },
              { step: '4', title: 'Deliver', desc: 'Get your fresh laundry delivered to your door.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">{item.step}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Smart Laundry?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'Nairobi-Wide Service', desc: 'We operate across Nairobi, ensuring pickup and delivery wherever you are.' },
              { title: 'Eco-Friendly Cleaning', desc: 'We use gentle, environmentally friendly detergents that are safe for your clothes and the planet.' },
              { title: 'Fast Turnaround', desc: 'Get your laundry back in 24-48 hours, perfect for busy schedules.' },
              { title: 'Affordable Pricing', desc: 'High-quality cleaning services at competitive prices tailored for you.' },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 p-6 border rounded-lg hover:border-primary-600 transition-colors">
                <div className="text-primary-600 text-2xl">✓</div>
                <div>
                  <h3 className="font-bold mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
