import { useState, useEffect } from 'react';
import { customerService, Customer } from '../services/customerService';
import { Card } from './ui/Card';

export const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    customerService.getCustomers()
      .then(setCustomers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (customers.length === 0) return <div>No customers found.</div>;

  return (
    <Card className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="pb-2">Phone</th>
            <th className="pb-2">Address</th>
            <th className="pb-2">Loyalty Points</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td className="py-2">{c.phone}</td>
              <td className="py-2">{c.address}</td>
              <td className="py-2">{c.loyalty_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
