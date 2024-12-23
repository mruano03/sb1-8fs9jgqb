import { useState, useEffect } from 'react';
import { analyticsService } from '@/lib/services/analytics/analytics-service';
import { useAuth } from '@/contexts/auth-context';
import type { AnalyticsData } from '@/lib/services/analytics/types';
import { emptyAnalyticsData } from '@/lib/services/analytics/types';

export function useAnalytics(dateRange: string) {
  const [data, setData] = useState<AnalyticsData>(emptyAnalyticsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const analyticsData = await analyticsService.getAnalytics(user.id, dateRange);
        setData(analyticsData);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, dateRange]);

  return {
    data,
    loading,
    error,
  };
}