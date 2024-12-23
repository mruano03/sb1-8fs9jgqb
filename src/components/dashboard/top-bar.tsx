import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { NotificationMenu } from './top-bar/notification-menu';
import { UserMenu } from './top-bar/user-menu';

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className="flex items-center space-x-4">
          <select
            className="rounded-md border-gray-300 text-sm"
            defaultValue="7d"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationMenu />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}