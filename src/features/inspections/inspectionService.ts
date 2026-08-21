/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase';

export interface Inspection {
  id: string;
  order_item_id: string;
  condition: string;
  damage_notes: string;
}

export const inspectionService = {
  async addInspection(inspection: Omit<Inspection, 'id'>) {
    const { data, error } = await (supabase.from('item_inspections') as any)
      .insert(inspection)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async uploadPhoto(inspectionId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${inspectionId}/${Math.random()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('item-photos')
      .upload(fileName, file);
      
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('item-photos')
      .getPublicUrl(fileName);

    const { error: dbError } = await (supabase.from('item_photos') as any)
      .insert({ inspection_id: inspectionId, photo_url: publicUrl });

    if (dbError) throw dbError;
  }
};
