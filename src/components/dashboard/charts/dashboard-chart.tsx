import { Card } from '@/components/ui/card';
import { AreaChart } from '@/components/charts/area-chart';
import { LineChart } from '@/components/charts/line-chart';
import { Loader2 } from 'lucide-react';

interface DashboardChartProps {
  title: string;
  data: Array<{ date: string; value: number }>;
  type?: 'area' | 'line';
  color?: string;
  label?: string;
  valueFormatter?: (value: number) => string;
  loading?: boolean;
  emptyMessage?: string;
}

export function DashboardChart({
  title,
  data = [],
  type = 'area',
  color = '#3b82f6',
  label = 'Value',
  valueFormatter = (value) => value.toString(),
  loading = false,
  emptyMessage = 'No data available',
}: DashboardChartProps) {
  const Chart = type === 'area' ? AreaChart : LineChart;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="h-[300px] w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          <Chart
            data={data}
            color={color}
            label={label}
            valueFormatter={valueFormatter}
          />
        )}
      </div>
    </Card>
  );
}