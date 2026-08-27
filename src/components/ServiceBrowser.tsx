import { useState, useEffect } from 'react';
import { catalogService, Service } from '../features/catalog/catalogService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const ServiceBrowser = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    catalogService.getServices()
      .then(setServices)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12">Loading services...</div>;

  if (services.length === 0) {
    const staticServices = [
      { id: '1', name: 'Wash & Fold', description: 'Professionals wash, dry, and fold your clothes for you.', base_price: 500 },
      { id: '2', name: 'Pick-Up & Delivery', description: 'A driver collects your dirty laundry and brings it back clean.', base_price: 300 },
      { id: '3', name: 'Dry Cleaning', description: 'A water-free chemical process for delicate fabrics like suits and silk.', base_price: 800 },
      { id: '4', name: 'Self-Service', description: 'You use coin- or card-operated machines at a public laundromat.', base_price: 200 },
      { id: '5', name: 'Commercial Laundry', description: 'Large-scale, bulk cleaning for businesses like hotels and hospitals.', base_price: 1500 },
    ];

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {staticServices.map((s) => (
          <Card key={s.id} className="hover:shadow-md transition-shadow p-6 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-900">{s.name}</h3>
              <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-sm font-semibold">
                KSh {s.base_price}
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed">{s.description}</p>
            <Button variant="outline" className="w-full mt-4" onClick={() => window.location.href = '/register'}>
              Select Service
            </Button>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <Card key={s.id} className="hover:shadow-md transition-shadow p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-900">{s.name}</h3>
            <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-sm font-semibold">
              KSh {s.base_price}
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed">{s.description}</p>
          <Button variant="outline" className="w-full mt-4" onClick={() => window.location.href = '/register'}>
            Select Service
          </Button>
        </Card>
      ))}
    </div>
  );
};
