import * as Switch from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

interface ToggleSwitchProps extends React.ComponentPropsWithoutRef<typeof Switch.Root> {
  className?: string;
}

export function ToggleSwitch({ className, ...props }: ToggleSwitchProps) {
  return (
    <Switch.Root
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200',
        className
      )}
      {...props}
    >
      <Switch.Thumb
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
        )}
      />
    </Switch.Root>
  );
}