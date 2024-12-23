import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { calculateMetrics } from '@/lib/utils/analytics';
import { handleError, retryOperation } from '@/lib/utils/error';
import type { WaitlistAnalytics } from '@/lib/types';

export function useWaitlistAnalytics(waitlistId: string, dateRange: string) {
  const [data, setData] = useState<WaitlistAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const days = {
          '7d': 7,
          '30d': 30,
          '90d': 90,
          '12m': 365,
        }[dateRange] || 7;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Get entries within date range with retry logic
        const entries = await retryOperation(async () => {
          const { data, error } = await supabase
            .from('waitlist_entries')
            .select('*')
            .eq('waitlist_id', waitlistId)
            .gte('created_at', startDate.toISOString())
            .order('created_at', { ascending: true });

          if (error) throw error;
          return data;
        });

        // Calculate metrics and prepare chart data
        const analyticsData = calculateMetrics(entries, days);
        setData(analyticsData);
      } catch (err) {
        handleError('Error fetching analytics', err);
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [waitlistId, dateRange]);

  return { data, loading, error };
}