import type { ChartDataPoint } from '../types';

export const groupByDate = (entries: any[], getValue: (item: any) => number) => {
  return entries.reduce((acc, item) => {
    const date = item.created_at.split('T')[0];
    if (!acc[date]) {
      acc[date] = { total: 0 };
    }
    acc[date].total += getValue(item);
    return acc;
  }, {} as Record<string, { total: number }>);
};

export const formatChartData = (
  groupedData: Record<string, { total: number }>,
  dateRange: string[]
): ChartDataPoint[] => {
  return dateRange.map(date => ({
    date,
    value: groupedData[date]?.total || 0
  }));
};

export const calculateConversionData = (
  signupsData: Record<string, { total: number }>,
  approvalsData: Record<string, { total: number }>,
  dateRange: string[]
): ChartDataPoint[] => {
  return dateRange.map(date => ({
    date,
    value: signupsData[date]?.total > 0
      ? (approvalsData[date]?.total || 0) / signupsData[date].total * 100
      : 0
  }));
};

export const calculateWaitTimeData = (
  entries: any[],
  dateRange: string[]
): ChartDataPoint[] => {
  const waitTimeByDate = entries.reduce((acc, entry) => {
    if (entry.status !== 'approved') return acc;
    
    const date = entry.created_at.split('T')[0];
    const created = new Date(entry.created_at);
    const approved = new Date(entry.updated_at);
    const waitTime = (approved.getTime() - created.getTime()) / (1000 * 60); // Minutes
    
    if (!acc[date]) {
      acc[date] = { total: 0, count: 0 };
    }
    acc[date].total += waitTime;
    acc[date].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  return dateRange.map(date => ({
    date,
    value: waitTimeByDate[date]?.count > 0
      ? Math.round(waitTimeByDate[date].total / waitTimeByDate[date].count)
      : 0
  }));
};