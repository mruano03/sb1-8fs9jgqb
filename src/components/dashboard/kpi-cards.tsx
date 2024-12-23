import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Users, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardsProps {
  stats: {
    totalWaitlists: {
      value: number;
      trend: 'up' | 'down';
      change: string;
    };
    totalEntries: {
      value: number;
      trend: 'up' | 'down';
      change: string;
    };
    approvedEntries: {
      value: number;
      trend: 'up' | 'down';
      change: string;
    };
    conversionRate: {
      value: string;
      trend: 'up' | 'down';
      change: string;
    };
  } | null;
}

export function KPICards({ stats }: KPICardsProps) {
  if (!stats) return null;

  const kpis = [
    {
      name: 'Total Waitlists',
      value: stats.totalWaitlists.value,
      change: stats.totalWaitlists.change,
      trend: stats.totalWaitlists.trend,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      name: 'Total Entries',
      value: stats.totalEntries.value,
      change: stats.totalEntries.change,
      trend: stats.totalEntries.trend,
      icon: Clock,
      color: 'text-yellow-600',
    },
    {
      name: 'Approved Entries',
      value: stats.approvedEntries.value,
      change: stats.approvedEntries.change,
      trend: stats.approvedEntries.trend,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      name: 'Conversion Rate',
      value: `${stats.conversionRate.value}%`,
      change: stats.conversionRate.change,
      trend: stats.conversionRate.trend,
      icon: TrendingUp,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.name} className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{kpi.name}</p>
              <p className="text-2xl font-semibold text-gray-900">{kpi.value}</p>
              <div className="flex items-center mt-1">
                {kpi.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={cn(
                  'text-sm font-medium ml-1',
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                )}>
                  {kpi.change}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}