import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface AnalyticsFiltersProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onExport: (format: 'csv' | 'excel' | 'pdf') => void;
}

export function AnalyticsFilters({
  dateRange,
  onDateRangeChange,
  onExport,
}: AnalyticsFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <select
        value={dateRange}
        onChange={(e) => onDateRangeChange(e.target.value)}
        className="rounded-md border-gray-300 text-sm"
      >
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
        <option value="12m">Last 12 months</option>
      </select>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onExport('csv')}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}