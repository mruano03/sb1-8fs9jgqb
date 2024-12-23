import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type WaitlistProduct = Database['public']['Tables']['waitlist_products']['Row'];
type WaitlistProductInsert =
  Database['public']['Tables']['waitlist_products']['Insert'];
type WaitlistProductUpdate =
  Database['public']['Tables']['waitlist_products']['Update'];

export const waitlistProductService = {
  async create(product: WaitlistProductInsert) {
    const { data, error } = await supabase
      .from('waitlist_products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getByWaitlistId(waitlistId: string) {
    const { data, error } = await supabase
      .from('waitlist_products')
      .select('*')
      .eq('waitlist_id', waitlistId)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: WaitlistProductUpdate) {
    const { data, error } = await supabase
      .from('waitlist_products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
