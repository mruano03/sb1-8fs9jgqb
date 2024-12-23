import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SocialLoginButtonProps {
  icon: LucideIcon;
  provider: string;
  onClick: () => void;
  className?: string;
}

export function SocialLoginButton({
  icon: Icon,
  provider,
  onClick,
  className,
}: SocialLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        className
      )}
    >
      <Icon className="h-5 w-5" />
      <span>Continue with {provider}</span>
    </button>
  );
}