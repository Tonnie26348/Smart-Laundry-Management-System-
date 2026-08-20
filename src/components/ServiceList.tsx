import { useState, useEffect } from 'react';
import { serviceService, Service } from '../services/serviceService';
import { Card } from './ui/Card';

export const ServiceList = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    serviceService.getServices()
      .then(setServices)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading services...</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <Card key={s.id}>
          <h3 className="text-lg font-semibold">{s.name}</h3>
          <p className="text-sm text-gray-600">{s.description}</p>
          <p className="mt-2 font-bold">Base Price: ${s.base_price}</p>
        </Card>
      ))}
    </div>
  );
};
