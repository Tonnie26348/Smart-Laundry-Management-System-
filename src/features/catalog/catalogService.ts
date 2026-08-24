/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase';

export interface ServiceCategory {
  id: string;
  name: string;
  created_at: string;
}

export interface Service {
  id: string;
  category_id: string;
  name: string;
  description: string;
  base_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ItemCategory {
  id: string;
  name: string;
  created_at: string;
}

export interface LaundryItem {
  id: string;
  category_id: string;
  name: string;
  price_adjustment: number; // Legacy, do not use for new pricing
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LaundryItemService {
  id: string;
  laundry_item_id: string;
  service_id: string;
  price_adjustment: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LaundryItemServiceWithDetails extends LaundryItemService {
  laundry_items: { name: string };
  services: { name: string, base_price: number };
}

export const catalogService = {
  // Service Categories
  async getServiceCategories(): Promise<ServiceCategory[]> {
    const { data, error } = await supabase.from('service_categories').select('*').order('name');
    if (error) throw error;
    return data || [];
  },

  // Services
  async getServices(activeOnly = true): Promise<Service[]> {
    let query = supabase.from('services').select('*').order('name');
    if (activeOnly) query = query.eq('is_active', true);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  async manageService(service: Partial<Service>, isUpdate: boolean) {
    const { error } = isUpdate 
      ? await (supabase.from('services') as any).update(service).eq('id', service.id)
      : await (supabase.from('services') as any).insert(service);
    if (error) throw error;
  },

  // Item Categories
  async getItemCategories(): Promise<ItemCategory[]> {
    const { data, error } = await supabase.from('item_categories').select('*').order('name');
    if (error) throw error;
    return data || [];
  },

  // Laundry Items
  async getLaundryItems(activeOnly = true): Promise<LaundryItem[]> {
    let query = supabase.from('laundry_items').select('*').order('name');
    if (activeOnly) query = query.eq('is_active', true);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  async manageLaundryItem(item: Partial<LaundryItem>, isUpdate: boolean) {
    const { error } = isUpdate 
      ? await (supabase.from('laundry_items') as any).update(item).eq('id', item.id)
      : await (supabase.from('laundry_items') as any).insert(item);
    if (error) throw error;
  },

  // Laundry Item-Service Mappings
  async getLaundryItemServices(): Promise<LaundryItemServiceWithDetails[]> {
    const { data, error } = await supabase
      .from('laundry_item_services')
      .select('*, laundry_items(name), services(name, base_price)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async manageLaundryItemService(mapping: Partial<LaundryItemService>, isUpdate: boolean) {
    const { error } = isUpdate 
      ? await (supabase.from('laundry_item_services') as any).update(mapping).eq('id', mapping.id)
      : await (supabase.from('laundry_item_services') as any).insert(mapping);
    
    if (error) {
      if (error.code === '23505') throw new Error('This service is already assigned to this laundry item.');
      throw error;
    }
  },

  // Pricing Calculation Helper
  calculateFinalPrice(basePrice: number, adjustment: number): number {
    return Number((basePrice + adjustment).toFixed(2));
  }
};
