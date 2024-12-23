import { motion } from 'framer-motion';

interface ProgressBarProps {
  total: number;
  remaining: number;
}

export function ProgressBar({ total, remaining }: ProgressBarProps) {
  const percentage = ((total - remaining) / total) * 100;

  return (
    <div className="mt-8">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>{remaining} spots remaining</span>
        <span>{percentage.toFixed(1)}% claimed</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}