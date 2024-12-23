import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type WaitlistAnalytics = Database['public']['Tables']['waitlist_analytics']['Row'];

export const waitlistAnalyticsService = {
  async getByWaitlistId(waitlistId: string) {
    const { data, error } = await supabase
      .from('waitlist_analytics')
      .select('*')
      .eq('waitlist_id', waitlistId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateMetrics(waitlistId: string) {
    // Get current stats
    const { data: entries, error: entriesError } = await supabase
      .from('waitlist_entries')
      .select('status')
      .eq('waitlist_id', waitlistId);

    if (entriesError) throw entriesError;

    const totalSignups = entries.length;
    const approvedCount = entries.filter(e => e.status === 'approved').length;
    const rejectedCount = entries.filter(e => e.status === 'rejected').length;
    const conversionRate = totalSignups > 0 ? (approvedCount / totalSignups) * 100 : 0;

    const { data, error } = await supabase
      .from('waitlist_analytics')
      .upsert({
        waitlist_id: waitlistId,
        total_signups: totalSignups,
        approved_count: approvedCount,
        rejected_count: rejectedCount,
        conversion_rate: conversionRate
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};