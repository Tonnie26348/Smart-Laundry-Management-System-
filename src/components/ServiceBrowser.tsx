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
    return (
      <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
        <p className="text-gray-500">No services available at the moment. Please check back later.</p>
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
