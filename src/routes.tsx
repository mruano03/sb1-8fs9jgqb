import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import { LoginPage } from '@/pages/login';
import { RegisterPage } from '@/pages/register';
import { DashboardPage } from '@/pages/dashboard';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AuthGuard } from '@/components/auth/auth-guard';
import { CreateWaitlistPage } from '@/pages/create-waitlist';
import { WaitlistEntriesPage } from '@/pages/waitlist-entries';
import { WaitlistAnalyticsPage } from '@/pages/waitlist-analytics';
import { WaitlistListPage } from '@/pages/waitlist-list';
import { WaitlistViewPage } from '@/pages/waitlist-view';
import { WaitlistSettingsPage } from '@/pages/waitlist-settings';
import { WaitlistRegistrationPage } from '@/pages/waitlist-registration';
import { FormsPage } from '@/pages/forms';
import { CreateFormPage } from '@/pages/create-form';
import { FormViewPage } from '@/pages/form-view';
import { FormSettingsPage } from '@/pages/form-settings';
import { FormPreviewPage } from '@/pages/form-preview-page';
import { PublicFormView } from '@/pages/public-form-view';
import { AnalyticsPage } from '@/pages/analytics';
import { SettingsPage } from '@/pages/settings';
import { DocumentationPage } from '@/pages/documentation';
import { PricingPage } from '@/pages/pricing';
import { PaymentPage } from '@/pages/payment';
import { SubscriptionPage } from '@/pages/subscription';
import { ProfilePage } from '@/pages/profile';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/docs',
    element: <DocumentationPage />,
  },
  {
    path: '/pricing',
    element: <PricingPage />,
  },
  {
    path: '/payment',
    element: (
      <AuthGuard>
        <PaymentPage />
      </AuthGuard>
    ),
  },
  {
    path: '/forms/:id',
    element: <PublicFormView />,
  },
  {
    path: '/waitlist/:id',
    element: <WaitlistRegistrationPage />,
  },
  {
    path: '/dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'subscription',
        element: <SubscriptionPage />,
      },
      {
        path: 'waitlists',
        children: [
          {
            index: true,
            element: <WaitlistListPage />,
          },
          {
            path: 'new',
            element: <CreateWaitlistPage />,
          },
          {
            path: ':id',
            element: <WaitlistViewPage />,
          },
          {
            path: ':id/entries',
            element: <WaitlistEntriesPage />,
          },
          {
            path: ':id/analytics',
            element: <WaitlistAnalyticsPage />,
          },
          {
            path: ':id/settings',
            element: <WaitlistSettingsPage />,
          },
        ],
      },
      {
        path: 'forms',
        children: [
          {
            index: true,
            element: <FormsPage />,
          },
          {
            path: 'new',
            element: <CreateFormPage />,
          },
          {
            path: ':id',
            element: <FormViewPage />,
          },
          {
            path: ':id/settings',
            element: <FormSettingsPage />,
          },
          {
            path: ':id/preview',
            element: <FormPreviewPage />,
          },
        ],
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);