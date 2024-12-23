import { useState } from 'react';
import { AnalyticsCharts } from '@/components/analytics/charts';
import { AnalyticsMetrics } from '@/components/analytics/metrics';
import { AnalyticsFilters } from '@/components/analytics/filters';
import { useAnalytics } from '@/hooks/use-analytics';
import { Loader2 } from 'lucide-react';
import { emptyAnalyticsData } from '@/lib/services/analytics/types';

export function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');
  const { data = emptyAnalyticsData, loading, error } = useAnalytics(dateRange);

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
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Detailed insights and reports for your waitlists
          </p>
        </div>
        <AnalyticsFilters
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onExport={handleExport}
        />
      </div>

      <AnalyticsMetrics metrics={data.metrics} />
      <AnalyticsCharts data={data.charts} />
    </div>
  );
}