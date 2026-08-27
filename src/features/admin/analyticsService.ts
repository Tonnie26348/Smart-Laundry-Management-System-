import { supabase } from '@/lib/supabase';

export interface DashboardMetrics {
  today_orders: number;
  pending_orders: number;
  completed_orders: number;
  total_revenue: number;
  customer_count: number;
  low_stock_count: number;
  pending_deliveries: number;
}

export const analyticsService = {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const { data, error } = await supabase.rpc('get_admin_dashboard_metrics');
    if (error) throw error;
    return data[0];
  }
};
