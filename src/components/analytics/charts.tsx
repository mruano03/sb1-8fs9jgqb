import { Card } from '@/components/ui/card';
import { AreaChart } from '@/components/charts/area-chart';
import { LineChart } from '@/components/charts/line-chart';
import { BarChart } from '@/components/charts/bar-chart';
import type { AnalyticsData } from '@/lib/services/analytics/types';

interface AnalyticsChartsProps {
  data: AnalyticsData['charts'];
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const hasData = Object.values(data).some(arr => arr.length > 0);

  if (!hasData) {
    return (
      <div className="text-center py-12 text-gray-500">
        No analytics data available yet. Start by creating a waitlist and getting some signups.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Signups Over Time</h3>
        <div className="h-80">
          <AreaChart
            data={data.signups}
            color="#3b82f6"
            label="Signups"
            valueFormatter={(value) => value.toString()}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Conversion Rate</h3>
        <div className="h-80">
          <LineChart
            data={data.conversion}
            color="#10b981"
            label="Conversion Rate"
            valueFormatter={(value) => `${value.toFixed(1)}%`}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Daily Approvals</h3>
        <div className="h-80">
          <BarChart
            data={data.approvals}
            color="#6366f1"
            label="Approvals"
            valueFormatter={(value) => value.toString()}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Average Wait Time</h3>
        <div className="h-80">
          <LineChart
            data={data.waitTime}
            color="#f59e0b"
            label="Minutes"
            valueFormatter={(value) => `${Math.round(value)}m`}
          />
        </div>
      </Card>
    </div>
  );
}