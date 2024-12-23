import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';
import { format } from 'date-fns';

export function SubscriptionAlert() {
  const { status } = useSubscriptionStatus();

  if (status.isActive) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            {status.expiresAt ? (
              <>
                Your subscription expired on{' '}
                {format(status.expiresAt, 'MMMM d, yyyy')}. Renew now to
                continue accessing premium features.
              </>
            ) : (
              'Upgrade to access premium features and get more from our platform.'
            )}
          </p>
          <div className="mt-4">
            <Button
              size="sm"
              to="/pricing"
              className="bg-yellow-800 hover:bg-yellow-700"
            >
              {status.expiresAt ? 'Renew Subscription' : 'Upgrade Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}