import { useMemo } from 'react';
import { AreaChart as RechartsArea, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

interface AreaChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
  color?: string;
  label?: string;
  valueFormatter?: (value: number) => string;
}

export function AreaChart({ 
  data = [], 
  color = '#3b82f6', 
  label = 'Value',
  valueFormatter = (value) => value.toString()
}: AreaChartProps) {
  const chartData = useMemo(() => {
    if (!data?.length) return [];
    return data.map(item => ({
      ...item,
      formattedDate: format(parseISO(item.date), 'MMM d'),
      originalDate: item.date
    }));
  }, [data]);

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data available
      </div>
    );
  }

  // Calculate domain for Y axis
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const yDomain = [
    Math.floor(minValue * 0.9),
    Math.ceil(maxValue * 1.1)
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsArea
        data={chartData}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <defs>
          <linearGradient id={`colorGradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="formattedDate"
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={valueFormatter}
          domain={yDomain}
          padding={{ top: 20, bottom: 20 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            padding: '12px'
          }}
          labelFormatter={(_, data) => {
            const item = data[0]?.payload;
            return item ? format(parseISO(item.originalDate), 'MMM d, yyyy') : '';
          }}
          formatter={(value: number) => [valueFormatter(value), label]}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#colorGradient-${color.replace('#', '')})`}
          dot={{ fill: color, strokeWidth: 2 }}
          activeDot={{ r: 6, strokeWidth: 2 }}
          isAnimationActive={true}
          animationDuration={1000}
          animationBegin={0}
        />
      </RechartsArea>
    </ResponsiveContainer>
  );
}