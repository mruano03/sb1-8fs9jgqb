import { subDays } from 'date-fns';
import type { ChartData } from './types';

export const calculateTrend = (current: number, previous: number) => {
  if (previous === 0) return { trend: 'up' as const, change: '0%' };
  const percentChange = ((current - previous) / previous) * 100;
  return {
    trend: percentChange >= 0 ? 'up' as const : 'down' as const,
    change: `${Math.abs(percentChange).toFixed(1)}%`
  };
};

export const groupDataByDate = (data: any[], getValue: (item: any) => number) => {
  return data.reduce((acc, item) => {
    const date = item.created_at.split('T')[0];
    if (!acc[date]) {
      acc[date] = { total: 0 };
    }
    acc[date].total += getValue(item);
    return acc;
  }, {} as Record<string, { total: number }>);
};

export const calculatePeriodMetrics = (data: any[], days: number) => {
  const now = new Date();
  const periodStart = subDays(now, days);
  
  const currentPeriod = data.filter(item => 
    new Date(item.created_at) >= periodStart
  );

  const previousPeriod = data.filter(item => {
    const date = new Date(item.created_at);
    return date >= subDays(periodStart, days) && date < periodStart;
  });

  return { currentPeriod, previousPeriod };
};

export const formatChartData = (
  groupedData: Record<string, { total: number }>,
  dateRange: string[]
): ChartData[] => {
  return dateRange.map(date => ({
    date,
    value: groupedData[date]?.total || 0
  }));
};