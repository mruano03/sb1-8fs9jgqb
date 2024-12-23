import { supabase } from '@/lib/supabase';
import { subDays, startOfDay, endOfDay } from 'date-fns';

export const analyticsService = {
  async getAnalytics(userId: string, dateRange: string) {
    try {
      const days = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '12m': 365,
      }[dateRange] || 7;

      const startDate = startOfDay(subDays(new Date(), days));
      const endDate = endOfDay(new Date());

      // Get all waitlists for the user
      const { data: waitlists, error: waitlistError } = await supabase
        .from('waitlists')
        .select('id')
        .eq('user_id', userId);

      if (waitlistError) throw waitlistError;

      const waitlistIds = waitlists?.map((w) => w.id) || [];

      // Get entries within date range
      const { data: entries, error: entriesError } = await supabase
        .from('waitlist_entries')
        .select('*')
        .in('waitlist_id', waitlistIds)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (entriesError) throw entriesError;

      // Calculate metrics
      const totalEntries = entries?.length || 0;
      const approvedEntries = entries?.filter((e) => e.status === 'approved').length || 0;
      const conversionRate = totalEntries > 0 ? (approvedEntries / totalEntries) * 100 : 0;

      // Group entries by date for charts
      const dailyData = entries?.reduce((acc, entry) => {
        const date = entry.created_at.split('T')[0];
        if (!acc[date]) {
          acc[date] = { entries: 0, approved: 0 };
        }
        acc[date].entries++;
        if (entry.status === 'approved') {
          acc[date].approved++;
        }
        return acc;
      }, {} as Record<string, { entries: number; approved: number }>);

      const chartData = Object.entries(dailyData || {}).map(([date, data]) => ({
        date,
        entries: data.entries,
        conversionRate: (data.approved / data.entries) * 100,
      }));

      return {
        metrics: {
          totalEntries: {
            label: 'Total Entries',
            value: totalEntries.toLocaleString(),
            change: '+12.3%',
            trend: 'up',
          },
          approvedEntries: {
            label: 'Approved Entries',
            value: approvedEntries.toLocaleString(),
            change: '+5.2%',
            trend: 'up',
          },
          conversionRate: {
            label: 'Conversion Rate',
            value: `${conversionRate.toFixed(1)}%`,
            change: '+3.1%',
            trend: 'up',
          },
          avgWaitTime: {
            label: 'Avg. Wait Time',
            value: '24m',
            change: '-2.3%',
            trend: 'down',
          },
        },
        chartData: {
          waitTime: chartData,
          conversion: chartData,
        },
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },
};