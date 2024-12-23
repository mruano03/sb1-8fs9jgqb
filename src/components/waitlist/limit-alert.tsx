import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWaitlistLimits } from '@/hooks/use-waitlist-limits';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';

export function LimitAlert() {
  const { totalWaitlists, maxWaitlists, canCreateMore } = useWaitlistLimits();
  const { status } = useSubscriptionStatus();

  if (canCreateMore || maxWaitlists === -1) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            {status.plan === 'Free' ? (
              <>
                You've reached the free plan limit ({totalWaitlists}/{maxWaitlists}).
                Upgrade to Pro to create unlimited waitlists.
              </>
            ) : (
              <>
                You've reached your waitlist limit ({totalWaitlists}/{maxWaitlists}).
                Please contact support for assistance.
              </>
            )}
          </p>
          {status.plan === 'Free' && (
            <div className="mt-4">
              <Button
                size="sm"
                to="/pricing"
                className="bg-yellow-800 hover:bg-yellow-700"
              >
                Upgrade Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}