export interface MetricData {
  value: number;
  trend: 'up' | 'down';
  change: string;
}

export interface WaitlistMetrics {
  totalSignups: MetricData;
  approvedEntries: MetricData;
  conversionRate: MetricData;
  averageWaitTime: MetricData;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface WaitlistChartData {
  signups: ChartDataPoint[];
  approvals: ChartDataPoint[];
  conversion: ChartDataPoint[];
  waitTime: ChartDataPoint[];
}

export interface WaitlistAnalytics {
  metrics: WaitlistMetrics;
  charts: WaitlistChartData;
}