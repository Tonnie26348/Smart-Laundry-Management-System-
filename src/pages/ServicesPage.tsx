import { ServiceBrowser } from '@/components/ServiceBrowser';
import { ThematicHero } from '@/components/layout/ThematicHero';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const ServicesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white flex justify-between items-center px-6 py-4 border-b">
        <div 
          className="text-2xl font-bold text-primary-600 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          Smart Laundry
        </div>
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
          <Button onClick={() => navigate('/register')}>Get Started</Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Hero Section with requested image */}
        <ThematicHero
          title="Our Premium Laundry Services"
          subtitle="We offer a comprehensive range of laundry solutions tailored to your needs. From deep washing to delicate dry cleaning, we handle every item with professional care."
          imageUrl="/images/laundry/landing/services-hero.jpg"
          imageAlt="Professional Laundry Services"
          variant="split"
        >
          <div className="pt-4">
            <Button size="lg" onClick={() => navigate('/register')}>
              Book a Service Now
            </Button>
          </div>
        </ThematicHero>

        {/* Services List */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Explore Our Services</h2>
            <p className="text-gray-600 mt-2">Quality care for all your garments</p>
          </div>
          
          <ServiceBrowser />
        </section>

        {/* Features/Trust Section */}
        <section className="bg-primary-600 text-white rounded-2xl p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold">Why Choose Smart Laundry?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-2">Expert Care</h3>
              <p className="text-primary-100">Our team uses professional-grade equipment and eco-friendly detergents.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-primary-100">We prioritize your time with efficient pickup and quick turnaround times.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Transparent Pricing</h3>
              <p className="text-primary-100">No hidden fees. You see exactly what you pay for each service.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Smart Laundry. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
