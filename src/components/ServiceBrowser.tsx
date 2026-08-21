import { useState, useEffect } from 'react';
import { catalogService, Service } from '../features/catalog/catalogService';
import { Card } from '@/components/ui/Card';

export const ServiceBrowser = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    catalogService.getServices()
      .then(setServices)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading services...</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <Card key={s.id}>
          <h3 className="text-lg font-bold">{s.name}</h3>
          <p className="text-sm text-gray-600">{s.description}</p>
          <p className="mt-2 text-primary-600 font-bold">KSh {s.base_price}</p>
        </Card>
      ))}
    </div>
  );
};
