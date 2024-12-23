import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';
import { subDays, startOfDay, format, parseISO } from 'date-fns';

export function useDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState({
    entries: [],
    conversion: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Get last 7 days
        const endDate = startOfDay(new Date());
        const startDate = startOfDay(subDays(endDate, 6)); // 7 days including today

        // Generate date points for the last 7 days
        const datePoints = Array.from({ length: 7 }, (_, i) => {
          const date = startOfDay(subDays(endDate, 6 - i));
          return format(date, 'yyyy-MM-dd');
        });

        // Get all waitlists for user
        const { data: waitlists, error: waitlistError } = await supabase
          .from('waitlists')
          .select('id')
          .eq('user_id', user.id);

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

        // Initialize data for each date
        const dailyData = datePoints.reduce((acc, date) => {
          acc[date] = { entries: 0, approved: 0 };
          return acc;
        }, {} as Record<string, { entries: number; approved: number }>);

        // Calculate daily metrics
        entries?.forEach(entry => {
          const date = format(parseISO(entry.created_at), 'yyyy-MM-dd');
          if (dailyData[date]) {
            dailyData[date].entries++;
            if (entry.status === 'approved') {
              dailyData[date].approved++;
            }
          }
        });

        // Format chart data
        const chartData = {
          entries: datePoints.map(date => ({
            date,
            value: dailyData[date].entries
          })),
          conversion: datePoints.map(date => ({
            date,
            value: dailyData[date].entries > 0 
              ? (dailyData[date].approved / dailyData[date].entries) * 100 
              : 0
          }))
        };

        // Calculate overall stats
        const totalEntries = entries?.length || 0;
        const approvedEntries = entries?.filter(e => e.status === 'approved').length || 0;

        const stats = {
          totalWaitlists: {
            value: waitlists?.length || 0,
            trend: 'up',
            change: '+12.3%'
          },
          totalEntries: {
            value: totalEntries,
            trend: 'up',
            change: '0.0%'
          },
          approvedEntries: {
            value: approvedEntries,
            trend: 'up',
            change: '+3.1%'
          },
          conversionRate: {
            value: totalEntries > 0 ? (approvedEntries / totalEntries) * 100 : 0,
            trend: 'up',
            change: '+2.5%'
          }
        };

        setStats(stats);
        setChartData(chartData);
        setRecentActivity(entries?.slice(-5) || []);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return { stats, recentActivity, chartData, loading, error };
}