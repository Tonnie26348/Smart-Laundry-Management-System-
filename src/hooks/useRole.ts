import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useRole = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single<{ role: string }>();
      
      if (data) {
        setRole(data.role);
      }
      setLoading(false);
    };
    fetchRole();
  }, []);

  return { role, loading };
};
