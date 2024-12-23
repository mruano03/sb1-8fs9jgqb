import { DashboardChart } from './dashboard-chart';
import { motion } from 'framer-motion';

interface DashboardChartsProps {
  data: {
    entries: Array<{ date: string; value: number }>;
    conversion: Array<{ date: string; value: number }>;
  };
  loading?: boolean;
}

export function DashboardCharts({ data, loading = false }: DashboardChartsProps) {
  // Ensure we have valid data arrays
  const entriesData = Array.isArray(data?.entries) ? data.entries : [];
  const conversionData = Array.isArray(data?.conversion) ? data.conversion : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DashboardChart
          title="Total Entries"
          data={entriesData}
          type="area"
          color="#3b82f6"
          label="Entries"
          valueFormatter={(value) => value.toString()}
          loading={loading}
          emptyMessage="No entries data available yet"
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DashboardChart
          title="Conversion Rate"
          data={conversionData}
          type="line"
          color="#10b981"
          label="Conversion"
          valueFormatter={(value) => `${value.toFixed(1)}%`}
          loading={loading}
          emptyMessage="No conversion data available yet"
        />
      </motion.div>
    </div>
  );
}