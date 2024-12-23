import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface WaitTimeChartProps {
  data: Array<{
    date: string;
    entries: number;
    approved: number;
  }>;
}

export function WaitTimeChart({ data }: WaitTimeChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(date) => format(new Date(date), 'MMM d')}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
          formatter={(value: number) => [`${value} entries`, 'Total Entries']}
        />
        <Line
          type="monotone"
          dataKey="entries"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}