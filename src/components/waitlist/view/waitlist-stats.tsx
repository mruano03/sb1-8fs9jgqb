import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Users, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface WaitlistStats {
  totalSignups: number;
  averageWaitTime: number;
  conversionRate: number;
  activeUsers: number;
}

interface WaitlistStatsProps {
  waitlistId: string;
}

export function WaitlistStats({ waitlistId }: WaitlistStatsProps) {
  const [stats, setStats] = useState<WaitlistStats>({
    totalSignups: 0,
    averageWaitTime: 0,
    conversionRate: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('waitlist_entries')
          .select('*')
          .eq('waitlist_id', waitlistId);

        if (error) throw error;

        const totalSignups = data.length;
        const approvedEntries = data.filter(entry => entry.status === 'approved').length;
        const conversionRate = totalSignups > 0 ? (approvedEntries / totalSignups) * 100 : 0;

        setStats({
          totalSignups,
          averageWaitTime: 24, // This would be calculated based on actual data
          conversionRate,
          activeUsers: data.filter(entry => entry.status === 'pending').length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [waitlistId]);

  const statCards = [
    {
      title: 'Total Signups',
      value: stats.totalSignups,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Average Wait Time',
      value: `${stats.averageWaitTime}h`,
      icon: Clock,
      color: 'text-yellow-600',
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: CheckCircle,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}