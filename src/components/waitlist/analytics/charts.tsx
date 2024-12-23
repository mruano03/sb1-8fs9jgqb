import { Card } from '@/components/ui/card';
import { AreaChart } from '@/components/charts/area-chart';
import { LineChart } from '@/components/charts/line-chart';
import { BarChart } from '@/components/charts/bar-chart';
import type { WaitlistChartData } from '@/lib/types';
import { motion } from 'framer-motion';

interface WaitlistChartsProps {
  data: WaitlistChartData;
}

export function WaitlistCharts({ data }: WaitlistChartsProps) {
  // Asegurarse de que hay datos para mostrar
  const hasData = Object.values(data).some(arr => arr.length > 0);

  if (!hasData) {
    return (
      <div className="text-center py-12 text-gray-500">
        No analytics data available yet. Start by getting some signups for your waitlist.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Signups Over Time</h3>
          <div className="h-[300px] w-full">
            <AreaChart
              data={data.signups}
              color="#3b82f6"
              label="Signups"
              valueFormatter={(value) => value.toString()}
            />
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Conversion Rate</h3>
          <div className="h-[300px] w-full">
            <LineChart
              data={data.conversion}
              color="#10b981"
              label="Conversion Rate"
              valueFormatter={(value) => `${value.toFixed(1)}%`}
            />
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Daily Approvals</h3>
          <div className="h-[300px] w-full">
            <BarChart
              data={data.approvals}
              color="#6366f1"
              label="Approvals"
              valueFormatter={(value) => value.toString()}
            />
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Average Wait Time</h3>
          <div className="h-[300px] w-full">
            <LineChart
              data={data.waitTime}
              color="#f59e0b"
              label="Minutes"
              valueFormatter={(value) => `${Math.round(value)}m`}
            />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}