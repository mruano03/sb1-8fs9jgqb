import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';

export interface WaitlistLimits {
  totalWaitlists: number;
  maxWaitlists: number;
  canCreateMore: boolean;
  isLoading: boolean;
}

export function useWaitlistLimits() {
  const { user } = useAuth();
  const [limits, setLimits] = useState<WaitlistLimits>({
    totalWaitlists: 0,
    maxWaitlists: 3,
    canCreateMore: true,
    isLoading: true,
  });

  useEffect(() => {
    if (!user) {
      setLimits(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const checkLimits = async () => {
      try {
        // Get user's subscription and current waitlist count
        const [{ data: subscription }, { count: totalWaitlists }] = await Promise.all([
          supabase
            .from('user_subscriptions')
            .select(`
              subscription_plans (
                limits
              )
            `)
            .eq('user_id', user.id)
            .maybeSingle(),
          supabase
            .from('waitlists')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
        ]);

        const maxWaitlists = subscription?.subscription_plans?.limits?.waitlists || 3;

        setLimits({
          totalWaitlists: totalWaitlists || 0,
          maxWaitlists,
          canCreateMore: maxWaitlists === -1 || (totalWaitlists || 0) < maxWaitlists,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error checking waitlist limits:', error);
        setLimits(prev => ({
          ...prev,
          isLoading: false,
          canCreateMore: false,
        }));
      }
    };

    checkLimits();
  }, [user]);

  return limits;
}