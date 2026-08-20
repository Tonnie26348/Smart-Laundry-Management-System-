import { supabase } from '../lib/supabase';

export const paymentService = {
  async initiateSTKPush(orderId: string, phoneNumber: string) {
    const { data, error } = await supabase.functions.invoke('mpesa-stk-push', {
      body: { orderId, phoneNumber },
    });
    if (error) throw error;
    return data;
  }
};
