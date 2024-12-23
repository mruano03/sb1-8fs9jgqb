import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { WaitlistMetrics } from '@/components/waitlist/analytics/metrics';
import { WaitlistCharts } from '@/components/waitlist/analytics/charts';
import { Button } from '@/components/ui/button';
import { useWaitlistAnalytics } from '@/hooks/use-waitlist-analytics';
import { Download, Loader2 } from 'lucide-react';

export function WaitlistAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const [dateRange, setDateRange] = useState('7d');
  const { data, loading, error } = useWaitlistAnalytics(id!, dateRange);

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    // TODO: Implement export functionality
    console.log(`Exporting data in ${format} format`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Waitlist Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Detailed insights and metrics for your waitlist
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-md border-gray-300 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('csv')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <WaitlistMetrics metrics={data.metrics} />
      <WaitlistCharts data={data.charts} />
    </div>
  );
}