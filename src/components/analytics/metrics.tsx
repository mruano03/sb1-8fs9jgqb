import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Users, Clock, TrendingUp, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Metrics } from '@/lib/services/analytics/types';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

function MetricCard({ title, value, change, trend, icon }: MetricCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
        <div className={`flex items-center ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          <span className="ml-1 text-sm font-medium">{change}</span>
        </div>
      </div>
    </Card>
  );
}

interface AnalyticsMetricsProps {
  metrics: Metrics;
}

export function AnalyticsMetrics({ metrics }: AnalyticsMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <MetricCard
          title="Total Signups"
          value={metrics.totalSignups.value}
          change={metrics.totalSignups.change}
          trend={metrics.totalSignups.trend}
          icon={<Users className="h-6 w-6 text-blue-600" />}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversionRate.value.toFixed(1)}%`}
          change={metrics.conversionRate.change}
          trend={metrics.conversionRate.trend}
          icon={<TrendingUp className="h-6 w-6 text-green-600" />}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <MetricCard
          title="Average Wait Time"
          value={`${metrics.averageWaitTime.value}m`}
          change={metrics.averageWaitTime.change}
          trend={metrics.averageWaitTime.trend}
          icon={<Clock className="h-6 w-6 text-yellow-600" />}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <MetricCard
          title="Active Waitlists"
          value={metrics.activeWaitlists.value}
          change={metrics.activeWaitlists.change}
          trend={metrics.activeWaitlists.trend}
          icon={<ListChecks className="h-6 w-6 text-purple-600" />}
        />
      </motion.div>
    </div>
  );
}