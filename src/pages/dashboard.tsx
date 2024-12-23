import { KPICards } from '@/components/dashboard/kpi-cards';
import { MainContent } from '@/components/dashboard/main-content';
import { useDashboard } from '@/hooks/use-dashboard';
import { Loader2 } from 'lucide-react';

export function DashboardPage() {
  const { stats, recentActivity, chartData, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !chartData || chartData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">
          {error || "No hay datos disponibles para mostrar en el gráfico"}
        </p>
      </div>
    );
  }

  const validChartData = Array.isArray(chartData) ? chartData : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your waitlists and key metrics
        </p>
      </div>

      <KPICards stats={stats} />
      <MainContent recentActivity={recentActivity} chartData={validChartData} />
    </div>
  );
}