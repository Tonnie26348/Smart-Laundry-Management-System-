import { supabase } from '@/lib/supabase';

export interface Service {
  id: string;
  category_id: string;
  name: string;
  description: string;
  base_price: number;
  is_active: boolean;
}

export const catalogService = {
  async getServices(): Promise<Service[]> {
    const { data, error } = await supabase.from('services').select('*').eq('is_active', true);
    if (error) throw error;
    return data || [];
  },
  async manageService(service: Partial<Service>, isUpdate: boolean) {
    const { error } = isUpdate 
      ? await (supabase.from('services') as any).update(service).eq('id', service.id)
      : await (supabase.from('services') as any).insert(service);
    if (error) throw error;
  }
};
