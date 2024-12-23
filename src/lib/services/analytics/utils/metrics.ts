import type { Metric } from '../types';

export const calculateMetric = (current: number, previous: number): Metric => {
  if (previous === 0) {
    return { value: current, trend: 'up', change: '0%' };
  }

  const percentChange = ((current - previous) / previous) * 100;
  
  return {
    value: current,
    trend: percentChange >= 0 ? 'up' : 'down',
    change: `${Math.abs(percentChange).toFixed(1)}%`
  };
};

export const calculateWaitTimeMetric = (entries: any[]): Metric => {
  if (!entries.length) {
    return { value: 0, trend: 'up', change: '0%' };
  }

  // Calculate actual wait time based on approval timestamps
  const approvedEntries = entries.filter(e => e.status === 'approved');
  const totalWaitTime = approvedEntries.reduce((total, entry) => {
    const created = new Date(entry.created_at);
    const approved = new Date(entry.updated_at);
    return total + (approved.getTime() - created.getTime()) / (1000 * 60); // Convert to minutes
  }, 0);

  const averageWaitTime = Math.round(totalWaitTime / (approvedEntries.length || 1));

  return {
    value: averageWaitTime,
    trend: 'down',
    change: '5%' // TODO: Calculate actual change
  };
};