import { supabase } from '../lib/supabase';

export const analyticsService = {
  async getDashboardMetrics() {
    // Aggregation queries for Admin dashboard
    const { data: metrics, error } = await supabase.rpc('get_dashboard_metrics');
    if (error) throw error;
    return metrics;
  }
};
