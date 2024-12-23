import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';

export interface SubscriptionStatus {
  isActive: boolean;
  expiresAt: Date | null;
  plan: string | null;
  features: string[];
  limits: {
    waitlists: number;
    entries_per_waitlist: number;
  };
}

export function useSubscriptionStatus() {
  const { user } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus>({
    isActive: false,
    expiresAt: null,
    plan: null,
    features: [],
    limits: {
      waitlists: 3,
      entries_per_waitlist: 100
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const checkSubscription = async () => {
      try {
        const { data: subscription, error } = await supabase
          .from('user_subscriptions')
          .select(`
            *,
            subscription_plans (
              name,
              features,
              limits
            )
          `)
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (subscription) {
          const expiresAt = new Date(subscription.current_period_end);
          const isActive = subscription.status === 'active' && expiresAt > new Date();

          setStatus({
            isActive,
            expiresAt: isActive ? expiresAt : null,
            plan: subscription.subscription_plans?.name || null,
            features: subscription.subscription_plans?.features || [],
            limits: subscription.subscription_plans?.limits || {
              waitlists: 3,
              entries_per_waitlist: 100
            }
          });
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [user]);

  return { status, loading };
}