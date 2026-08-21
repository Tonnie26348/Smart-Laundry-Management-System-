import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const navigate = useNavigate();

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
      <section className="px-6 py-16 md:py-32 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Laundry Day, <span className="text-primary-600">Simplified.</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Professional laundry service at your fingertips. From washing to delivery, 
          we handle it all so you can focus on what matters.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/register')}>
            Order Now
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => navigate('/services')}>
            View Services
          </Button>
        </div>
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
