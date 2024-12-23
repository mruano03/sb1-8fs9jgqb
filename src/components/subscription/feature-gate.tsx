import { ReactNode } from 'react';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';

interface FeatureGateProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { status, loading } = useSubscriptionStatus();

  if (loading) {
    return null;
  }

  if (!status.isActive || !status.features.includes(feature)) {
    return fallback || null;
  }

  return <>{children}</>;
}