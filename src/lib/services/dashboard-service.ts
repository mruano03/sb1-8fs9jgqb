import { supabase } from '@/lib/supabase';
import { subDays, startOfDay, endOfDay } from 'date-fns';

export const dashboardService = {
  async getDashboardStats(userId: string) {
    try {
      // Get all waitlists for the user
      const { data: waitlists, error: waitlistError } = await supabase
        .from('waitlists')
        .select('id')
        .eq('user_id', userId);

      if (waitlistError) throw waitlistError;

      const waitlistIds = waitlists?.map(w => w.id) || [];

      // Get entries for all waitlists
      const { data: entries, error: entriesError } = await supabase
        .from('waitlist_entries')
        .select('*')
        .in('waitlist_id', waitlistIds);

      if (entriesError) throw entriesError;

      // Calcular períodos de tiempo
      const today = new Date();
      const currentPeriodStart = subDays(today, 7);
      const previousPeriodStart = subDays(currentPeriodStart, 7);

      // Filtrar entradas por períodos
      const currentPeriodEntries = entries?.filter(e => 
        new Date(e.created_at) >= currentPeriodStart
      ) || [];

      const previousPeriodEntries = entries?.filter(e => 
        new Date(e.created_at) >= previousPeriodStart &&
        new Date(e.created_at) < currentPeriodStart
      ) || [];

      // Calcular estadísticas actuales y previas
      const currentStats = {
        totalEntries: currentPeriodEntries.length,
        approvedEntries: currentPeriodEntries.filter(e => e.status === 'approved').length
      };

      const previousStats = {
        totalEntries: previousPeriodEntries.length,
        approvedEntries: previousPeriodEntries.filter(e => e.status === 'approved').length
      };

      // Calcular tendencias
      const calculateTrend = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      const formatTrend = (trend: number) => {
        return trend === 0 ? '0.0%' : `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`;
      };

      // Calcular tasas de conversión
      const currentConversionRate = currentStats.totalEntries > 0 
        ? (currentStats.approvedEntries / currentStats.totalEntries) * 100 
        : 0;

      const previousConversionRate = previousStats.totalEntries > 0 
        ? (previousStats.approvedEntries / previousStats.totalEntries) * 100 
        : 0;

      // Calcular tendencias finales
      const entryTrend = calculateTrend(currentStats.totalEntries, previousStats.totalEntries);
      const approvedTrend = calculateTrend(currentStats.approvedEntries, previousStats.approvedEntries);
      const conversionTrend = calculateTrend(currentConversionRate, previousConversionRate);
      const waitlistTrend = calculateTrend(waitlists?.length || 0, 0); // Asumiendo que no tenemos datos previos de waitlists

      console.log('Calculated values:', {
        current: currentStats,
        previous: previousStats,
        trends: {
          entry: entryTrend,
          approved: approvedTrend,
          conversion: conversionTrend,
          waitlist: waitlistTrend
        }
      });

      return {
        totalWaitlists: {
          value: waitlists?.length || 0,
          trend: waitlistTrend >= 0 ? 'up' : 'down',
          change: formatTrend(waitlistTrend)
        },
        totalEntries: {
          value: entries?.length || 0,
          trend: entryTrend >= 0 ? 'up' : 'down',
          change: formatTrend(entryTrend)
        },
        approvedEntries: {
          value: entries?.filter(e => e.status === 'approved').length || 0,
          trend: approvedTrend >= 0 ? 'up' : 'down',
          change: formatTrend(approvedTrend)
        },
        conversionRate: {
          value: (currentConversionRate || 0).toFixed(1),
          trend: conversionTrend >= 0 ? 'up' : 'down',
          change: formatTrend(conversionTrend)
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  async getRecentActivity(userId: string, limit = 5) {
    try {
      const { data, error } = await supabase
        .from('waitlist_entries')
        .select(`
          *,
          waitlists!inner (
            name,
            user_id
          )
        `)
        .eq('waitlists.user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  },

  async getChartData(userId: string, days = 7) {
    try {
      const startDate = startOfDay(subDays(new Date(), days));
      const endDate = endOfDay(new Date());

      // Get all waitlists for the user
      const { data: waitlists, error: waitlistError } = await supabase
        .from('waitlists')
        .select('id')
        .eq('user_id', userId);

      if (waitlistError) throw waitlistError;

      const waitlistIds = waitlists?.map(w => w.id) || [];

      // Get entries within date range
      const { data: entries, error: entriesError } = await supabase
        .from('waitlist_entries')
        .select('*')
        .in('waitlist_id', waitlistIds)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });

      if (entriesError) throw entriesError;

      // Group entries by date
      const dailyData = entries?.reduce((acc, entry) => {
        const date = entry.created_at.split('T')[0];
        if (!acc[date]) {
          acc[date] = { total: 0, approved: 0 };
        }
        acc[date].total++;
        if (entry.status === 'approved') {
          acc[date].approved++;
        }
        return acc;
      }, {} as Record<string, { total: number; approved: number }>);

      // Convert to array format for charts
      return Object.entries(dailyData || {}).map(([date, data]) => ({
        date,
        entries: data.total,
        approved: data.approved,
        conversionRate: (data.approved / data.total) * 100
      }));
    } catch (error) {
      console.error('Error fetching chart data:', error);
      throw error;
    }
  }
};