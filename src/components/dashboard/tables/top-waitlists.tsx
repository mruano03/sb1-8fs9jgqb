import { BarChart2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface TopWaitlist {
  id: string;
  name: string;
  total_entries: number;
  conversion_rate: number;
  trend: 'up' | 'down';
  change: number;
}

export function TopWaitlists() {
  const { user } = useAuth();
  const [waitlists, setWaitlists] = useState<TopWaitlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopWaitlists = async () => {
      if (!user) return;

      try {
        // First get all waitlists
        const { data: waitlistsData, error: waitlistsError } = await supabase
          .from('waitlists')
          .select('id, name')
          .eq('user_id', user.id)
          .limit(5);

        if (waitlistsError) throw waitlistsError;

        if (!waitlistsData?.length) {
          setWaitlists([]);
          setLoading(false);
          return;
        }

        // For each waitlist, get entry counts and calculate metrics
        const waitlistsWithMetrics = await Promise.all(
          waitlistsData.map(async (waitlist) => {
            // Get all entries for this waitlist
            const { data: entries, error: entriesError } = await supabase
              .from('waitlist_entries')
              .select('status, created_at')
              .eq('waitlist_id', waitlist.id);

            if (entriesError) throw entriesError;

            const total_entries = entries?.length || 0;
            const approved_entries = entries?.filter(e => e.status === 'approved').length || 0;
            const conversion_rate = total_entries > 0 
              ? (approved_entries / total_entries) * 100 
              : 0;

            // Calculate trend
            const recent = entries?.filter(e => 
              new Date(e.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length || 0;

            const older = entries?.filter(e => {
              const date = new Date(e.created_at);
              const now = new Date();
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
              return date >= twoWeeksAgo && date < weekAgo;
            }).length || 0;

            const change = older > 0 ? ((recent - older) / older) * 100 : 0;

            return {
              id: waitlist.id,
              name: waitlist.name,
              total_entries,
              conversion_rate,
              trend: change >= 0 ? 'up' : 'down',
              change: Math.abs(change)
            };
          })
        );

        // Sort by total entries descending
        const sortedWaitlists = waitlistsWithMetrics.sort(
          (a, b) => b.total_entries - a.total_entries
        );

        setWaitlists(sortedWaitlists);
      } catch (err) {
        console.error('Error fetching top waitlists:', err);
        setError('Failed to load top waitlists');
      } finally {
        setLoading(false);
      }
    };

    fetchTopWaitlists();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-600">
        {error}
      </div>
    );
  }

  if (!waitlists.length) {
    return (
      <div className="text-center py-6 text-gray-500">
        No waitlists yet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Waitlist
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Total Entries
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Conversion Rate
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Trend
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {waitlists.map((waitlist) => (
            <tr key={waitlist.id}>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                <div className="flex items-center">
                  <BarChart2 className="h-4 w-4 text-gray-400 mr-2" />
                  {waitlist.name}
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {waitlist.total_entries}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {waitlist.conversion_rate.toFixed(1)}%
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                    waitlist.trend === 'up'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  )}
                >
                  {waitlist.trend === 'up' ? (
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-3 w-3" />
                  )}
                  {waitlist.change.toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}