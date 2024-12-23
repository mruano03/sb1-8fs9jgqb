import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface AnalyticsData {
  totalSignups: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  conversionRate: number;
  dailySignups: Array<{
    date: string;
    count: number;
  }>;
}

interface WaitlistAnalyticsProps {
  waitlistId: string;
}

export function WaitlistAnalytics({ waitlistId }: WaitlistAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch all entries for the waitlist
        const { data: entries, error } = await supabase
          .from('waitlist_entries')
          .select('*')
          .eq('waitlist_id', waitlistId);

        if (error) throw error;

        // Process the data
        const analytics: AnalyticsData = {
          totalSignups: entries.length,
          approvedCount: entries.filter(e => e.status === 'approved').length,
          rejectedCount: entries.filter(e => e.status === 'rejected').length,
          pendingCount: entries.filter(e => e.status === 'pending').length,
          conversionRate: 0,
          dailySignups: [],
        };

        // Calculate conversion rate
        analytics.conversionRate = (analytics.approvedCount / analytics.totalSignups) * 100;

        // Process daily signups
        const dailySignups = entries.reduce((acc, entry) => {
          const date = new Date(entry.created_at).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        analytics.dailySignups = Object.entries(dailySignups)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date));

        setData(analytics);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [waitlistId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Signups</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{data.totalSignups}</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Approved</h3>
            <p className="mt-2 text-3xl font-semibold text-green-600">{data.approvedCount}</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <p className="mt-2 text-3xl font-semibold text-yellow-600">{data.pendingCount}</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
            <p className="mt-2 text-3xl font-semibold text-blue-600">
              {data.conversionRate.toFixed(1)}%
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Daily Signups</h3>
          <div className="mt-6" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dailySignups}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
}