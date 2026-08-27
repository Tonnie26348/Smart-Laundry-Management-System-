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

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface AdminAnalytics extends DashboardMetrics {
  revenue_data: RevenueData[];
}

export const analyticsService = {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const { data, error } = await supabase.rpc('get_admin_dashboard_metrics');
    if (error) throw error;
    return data[0];
  },
  async getAdminAnalytics(): Promise<AdminAnalytics> {
    const { data, error } = await supabase.rpc('get_admin_analytics');
    if (error) throw error;
    return data[0];
  }
};
