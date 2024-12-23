import { supabase } from '@/lib/supabase';
import type { AnalyticsData } from './types';
import { emptyAnalyticsData } from './types';
import { getDateRange, getPeriods } from './utils/date';
import { calculateMetric, calculateWaitTimeMetric } from './utils/metrics';
import { groupByDate, formatChartData, calculateConversionData, calculateWaitTimeData } from './utils/charts';
import { handleError } from '@/lib/utils/error';

export const analyticsService = {
  async getAnalytics(userId: string, dateRange: string): Promise<AnalyticsData> {
    try {
      const days = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '12m': 365,
      }[dateRange] || 7;

      const { startDate, endDate, dateRange: dates } = getDateRange(days);

      // Get all waitlists for the user
      const { data: waitlists, error: waitlistError } = await supabase
        .from('waitlists')
        .select('id, status')
        .eq('user_id', userId);

      if (waitlistError) throw waitlistError;

      const waitlistIds = waitlists?.map(w => w.id) || [];
      if (!waitlistIds.length) return emptyAnalyticsData;

      // Get entries within date range
      const { data: entries, error: entriesError } = await supabase
        .from('waitlist_entries')
        .select('*')
        .in('waitlist_id', waitlistIds)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });

      if (entriesError) throw entriesError;
      if (!entries?.length) return emptyAnalyticsData;

      // Calculate periods for metrics
      const { currentPeriod, previousPeriod } = getPeriods(entries, days);

      // Group data by date for charts
      const signupsData = groupByDate(entries, () => 1);
      const approvalsData = groupByDate(entries.filter(e => e.status === 'approved'), () => 1);

      // Calculate metrics
      const totalSignups = calculateMetric(
        currentPeriod.length,
        previousPeriod.length
      );

      const currentApproved = currentPeriod.filter(e => e.status === 'approved').length;
      const previousApproved = previousPeriod.filter(e => e.status === 'approved').length;
      const conversionRate = calculateMetric(
        (currentApproved / currentPeriod.length) * 100 || 0,
        (previousApproved / previousPeriod.length) * 100 || 0
      );

      const averageWaitTime = calculateWaitTimeMetric(entries);

      const activeWaitlists = calculateMetric(
        waitlists.filter(w => w.status === 'active').length,
        waitlists.length
      );

      return {
        metrics: {
          totalSignups,
          conversionRate,
          averageWaitTime,
          activeWaitlists
        },
        charts: {
          signups: formatChartData(signupsData, dates),
          approvals: formatChartData(approvalsData, dates),
          conversion: calculateConversionData(signupsData, approvalsData, dates),
          waitTime: calculateWaitTimeData(entries, dates)
        }
      };
    } catch (error) {
      handleError('Error fetching analytics', error);
      return emptyAnalyticsData;
    }
  }
};