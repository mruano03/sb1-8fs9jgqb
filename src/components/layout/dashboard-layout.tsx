import { Outlet } from 'react-router-dom';
import { DashboardLayout as NewDashboardLayout } from '@/components/dashboard/layout';

export function DashboardLayout() {
  return (
    <NewDashboardLayout>
      <Outlet />
    </NewDashboardLayout>
  );
}