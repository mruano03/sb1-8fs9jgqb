import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/use-subscription';
import { Loader2 } from 'lucide-react';

export function SubscriptionPage() {
  const navigate = useNavigate();
  const { subscription, loading, updateSubscription } = useSubscription();
  const [processing, setProcessing] = useState(false);

  const handleSubscribe = async (planId: string) => {
    try {
      setProcessing(true);
      await updateSubscription(planId);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error subscribing:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Your Subscription</h1>
        <p className="mt-2 text-gray-600">
          Manage your subscription and billing details
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Current Plan: {subscription?.subscription_plans?.name || 'Free'}
            </h2>
            <p className="mt-1 text-gray-500">
              {subscription?.status === 'active'
                ? 'Your subscription is active'
                : 'No active subscription'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/pricing')}
            disabled={processing}
          >
            Change Plan
          </Button>
        </div>

        {subscription?.status === 'active' && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Subscription Details
            </h3>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Billing Period</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(subscription.current_period_start).toLocaleDateString()} -{' '}
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Next Payment</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  ${subscription.subscription_plans.price}/month
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Card>
    </div>
  );
}