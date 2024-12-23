import { Card } from '@/components/ui/card';
import { DashboardCharts } from './charts/dashboard-charts';
import { RecentEntries } from './tables/recent-entries';
import { TopWaitlists } from './tables/top-waitlists';

interface MainContentProps {
  recentActivity: any[];
  chartData: {
    waitTime: Array<{ date: string; value: number }>;
    conversion: Array<{ date: string; value: number }>;
  };
  loading?: boolean;
}

export function MainContent({ recentActivity, chartData, loading = false }: MainContentProps) {
  return (
    <div className="space-y-8">
      <DashboardCharts data={chartData} loading={loading} />

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <RecentEntries entries={recentActivity} />
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Top Performing Waitlists</h3>
        <TopWaitlists />
      </Card>
    </div>
  );
}