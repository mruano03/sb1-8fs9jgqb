import { useState, type ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';
import { SubscriptionAlert } from '../subscription/subscription-alert';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <SubscriptionAlert />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}