import { supabase } from '@/lib/supabase';

export const analyticsService = {
  async getDashboardMetrics() {
    const { data, error } = await supabase.rpc('get_admin_analytics');
    if (error) throw error;
    return data[0];
  }
};
