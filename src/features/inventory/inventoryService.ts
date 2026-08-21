/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  current_stock: number;
  min_stock_level: number;
  unit: string;
}

export const inventoryService = {
  async getItems() {
    const { data, error } = await supabase.from('inventory_items').select('*');
    if (error) throw error;
    return data as InventoryItem[];
  },
  async addStock(itemId: string, quantity: number, reason: string) {
    const { error } = await (supabase.from('inventory_transactions') as any)
      .insert({ item_id: itemId, type: 'addition', quantity, reason });
    if (error) throw error;
    
    // Trigger to update stock level (to be added)
  }
};
