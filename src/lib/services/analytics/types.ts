import { z } from 'zod';

// Chart data types
export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface ChartData {
  signups: ChartDataPoint[];
  approvals: ChartDataPoint[];
  conversion: ChartDataPoint[];
  waitTime: ChartDataPoint[];
}

// Metric types
export interface Metric {
  value: number;
  trend: 'up' | 'down';
  change: string;
}

export interface Metrics {
  totalSignups: Metric;
  conversionRate: Metric;
  averageWaitTime: Metric;
  activeWaitlists: Metric;
}

// Complete analytics data
export interface AnalyticsData {
  metrics: Metrics;
  charts: ChartData;
}

// Empty data constants
export const emptyMetric: Metric = {
  value: 0,
  trend: 'up',
  change: '0%'
};

export const emptyChartData: ChartData = {
  signups: [],
  approvals: [],
  conversion: [],
  waitTime: []
};

export const emptyAnalyticsData: AnalyticsData = {
  metrics: {
    totalSignups: { ...emptyMetric },
    conversionRate: { ...emptyMetric },
    averageWaitTime: { ...emptyMetric },
    activeWaitlists: { ...emptyMetric }
  },
  charts: emptyChartData
};