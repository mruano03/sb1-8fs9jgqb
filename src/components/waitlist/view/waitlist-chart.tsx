import { useEffect, useState } from 'react';
import { AreaChart } from '@/components/charts/area-chart';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface ChartData {
  date: string;
  value: number;
}

interface WaitlistChartProps {
  waitlistId: string;
}

export function WaitlistChart({ waitlistId }: WaitlistChartProps) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const { data: entries, error } = await supabase
          .from('waitlist_entries')
          .select('created_at')
          .eq('waitlist_id', waitlistId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Group entries by date
        const groupedData = entries.reduce((acc: Record<string, number>, entry) => {
          const date = entry.created_at.split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        // Convert to chart data format and sort by date
        const chartData = Object.entries(groupedData)
          .map(([date, count]) => ({
            date,
            value: count,
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setData(chartData);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [waitlistId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {error}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <AreaChart
      data={data}
      color="#3b82f6"
      label="Signups"
      valueFormatter={(value) => value.toString()}
    />
  );
}