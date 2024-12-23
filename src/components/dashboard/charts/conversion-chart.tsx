import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface ConversionChartProps {
  data: Array<{
    date: string;
    conversionRate: number;
  }>;
}

export function ConversionChart({ data }: ConversionChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(date) => format(new Date(date), 'MMM d')}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Conversion Rate']}
        />
        <Area
          type="monotone"
          dataKey="conversionRate"
          stroke="#3b82f6"
          fill="#93c5fd"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}