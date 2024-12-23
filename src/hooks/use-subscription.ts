import { useState, useEffect } from 'react';
import { subscriptionService } from '@/lib/services/subscription-service';
import { useAuth } from '@/contexts/auth-context';

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const data = await subscriptionService.getCurrentPlan(user.id);
        setSubscription(data);
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError('Failed to load subscription data');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const updateSubscription = async (planId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await subscriptionService.updateSubscription(user.id, planId);
      setSubscription(data);
      return data;
    } catch (err) {
      console.error('Error updating subscription:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    subscription,
    loading,
    error,
    updateSubscription,
  };
}