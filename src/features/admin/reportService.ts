import { supabase } from '@/lib/supabase';

export interface BusinessReportData {
  total_revenue: number;
  total_orders: number;
  avg_order_value: number;
  status_distribution: Record<string, number>;
  service_distribution: Array<{
    service_name: string;
    revenue: number;
    order_count: number;
  }>;
  daily_revenue: Array<{
    date: string;
    revenue: number;
  }>;
}

export const reportService = {
  async getBusinessReport(startDate: string, endDate: string): Promise<BusinessReportData | null> {
    const { data, error } = await supabase.rpc('get_business_reports_data', {
      p_start_date: startDate,
      p_end_date: endDate,
    } as any);
    if (error) throw error;
    return data ? (data as unknown as BusinessReportData) : null;
  },

  async exportToCSV(data: Record<string, unknown>[], fileName: string) {
    console.log('Exporting data:', data, 'Filename:', fileName);
    if (data.length === 0) {
      console.log('No data to export.');
      return;
    }
    
    const headers = Object.keys(data[0]);
    console.log('Headers:', headers);
    
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ];
    
    const csvContent = csvRows.join('\n');
    console.log('CSV Content:', csvContent);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    console.log('Triggering click...');
    link.click();
    document.body.removeChild(link);
    console.log('Export complete.');
  }
};
