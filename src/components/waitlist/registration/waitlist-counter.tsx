import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WaitlistCounterProps {
  count?: number;
  className?: string;
}

export function WaitlistCounter({ count = 1250, className }: WaitlistCounterProps) {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds animation
    const steps = 50;
    const increment = count / steps;
    const stepDuration = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= count) {
        setDisplayCount(count);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [count]);

  return (
    <div className={cn("flex items-center justify-center gap-2 text-gray-600", className)}>
      <Users className="h-5 w-5" />
      <span className="text-sm font-medium">
        {displayCount.toLocaleString()} people already joined
      </span>
    </div>
  );
}