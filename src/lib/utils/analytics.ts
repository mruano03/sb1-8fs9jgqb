import { subDays, startOfDay, endOfDay } from 'date-fns';
import type { WaitlistAnalytics } from '@/lib/types';

export function calculateMetrics(entries: any[], days: number): WaitlistAnalytics {
  // Generate date points for the chart
  const datePoints = Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), i);
    return startOfDay(date).toISOString().split('T')[0];
  }).reverse();

  // Initialize data with 0 values for all dates
  const chartData = datePoints.reduce((acc, date) => {
    acc[date] = { signups: 0, approvals: 0, conversion: 0, waitTime: 0 };
    return acc;
  }, {} as Record<string, any>);

  // Calculate metrics for each day
  entries.forEach(entry => {
    const date = entry.created_at.split('T')[0];
    if (chartData[date]) {
      chartData[date].signups++;
      if (entry.status === 'approved') {
        chartData[date].approvals++;
      }
    }
  });

  // Calculate conversion rates and wait times
  Object.keys(chartData).forEach(date => {
    const dayData = chartData[date];
    dayData.conversion = dayData.signups > 0 
      ? (dayData.approvals / dayData.signups) * 100 
      : 0;
    
    // Calculate average wait time (simplified for example)
    dayData.waitTime = Math.random() * 60; // Replace with actual calculation
  });

  // Convert to arrays for charts
  const charts = {
    signups: datePoints.map(date => ({ 
      date, 
      value: chartData[date].signups 
    })),
    approvals: datePoints.map(date => ({ 
      date, 
      value: chartData[date].approvals 
    })),
    conversion: datePoints.map(date => ({ 
      date, 
      value: chartData[date].conversion 
    })),
    waitTime: datePoints.map(date => ({ 
      date, 
      value: chartData[date].waitTime 
    })),
  };

  // Calculate overall metrics
  const totalSignups = entries.length;
  const approvedEntries = entries.filter(e => e.status === 'approved').length;
  const conversionRate = totalSignups > 0 ? (approvedEntries / totalSignups) * 100 : 0;
  const avgWaitTime = 30; // Replace with actual calculation

  return {
    metrics: {
      totalSignups: {
        value: totalSignups,
        trend: 'up',
        change: '+12.3%',
      },
      approvedEntries: {
        value: approvedEntries,
        trend: 'up',
        change: '+5.2%',
      },
      conversionRate: {
        value: conversionRate,
        trend: 'up',
        change: '+3.1%',
      },
      averageWaitTime: {
        value: avgWaitTime,
        trend: 'down',
        change: '5%',
      },
    },
    charts,
  };
}