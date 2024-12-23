import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Users, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { WaitlistMetrics } from '@/lib/types';

interface WaitlistMetricsProps {
  metrics: WaitlistMetrics;
}

export function WaitlistMetrics({ metrics }: WaitlistMetricsProps) {
  const cards = [
    {
      title: 'Total Signups',
      value: metrics.totalSignups.value,
      change: metrics.totalSignups.change,
      trend: metrics.totalSignups.trend,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Conversion Rate',
      value: `${metrics.conversionRate.value.toFixed(1)}%`,
      change: metrics.conversionRate.change,
      trend: metrics.conversionRate.trend,
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Average Wait Time',
      value: `${metrics.averageWaitTime.value}m`,
      change: metrics.averageWaitTime.change,
      trend: metrics.averageWaitTime.trend,
      icon: Clock,
      color: 'text-yellow-600',
    },
    {
      title: 'Approved Entries',
      value: metrics.approvedEntries.value,
      change: metrics.approvedEntries.change,
      trend: metrics.approvedEntries.trend,
      icon: CheckCircle,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                <div className="flex items-center mt-1">
                  {card.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ml-1 ${
                    card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}