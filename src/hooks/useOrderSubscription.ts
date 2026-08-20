import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Order } from '../services/orderService';

export const useOrderSubscription = (orderId: string) => {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Initial fetch
    supabase.from('orders').select('*').eq('id', orderId).single()
      .then(({ data }) => setOrder(data));

    // Realtime subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        (payload) => setOrder(payload.new as Order)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return order;
};
