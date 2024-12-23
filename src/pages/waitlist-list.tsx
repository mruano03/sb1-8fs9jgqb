import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3, Settings, Users, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWaitlists } from '@/hooks/use-waitlists';
import { useWaitlistLimits } from '@/hooks/use-waitlist-limits';
import { LimitAlert } from '@/components/waitlist/limit-alert';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/auth-context';

export function WaitlistListPage() {
  const { user } = useAuth();
  const { waitlists, loading, error } = useWaitlists();
  const { canCreateMore, isLoading: limitsLoading } = useWaitlistLimits();
  const [showNoAccessMessage, setShowNoAccessMessage] = useState(false);

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Access Denied</h3>
        <p className="text-gray-500 mb-8">Please log in to view your waitlists.</p>
        <Button to="/login">Log In</Button>
      </div>
    );
  }

  if (loading || limitsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!waitlists?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-4">No waitlists yet</h3>
        <p className="text-gray-500 mb-8">Create your first waitlist to get started.</p>
        {canCreateMore ? (
          <Button to="/dashboard/waitlists/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Waitlist
          </Button>
        ) : (
          <LimitAlert />
        )}
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Your Waitlists</h1>
            <p className="mt-1 text-sm text-gray-500">
              A list of all your waitlists including their status and metrics.
            </p>
          </div>
          <div className="flex-shrink-0">
            {canCreateMore ? (
              <Button to="/dashboard/waitlists/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Waitlist
              </Button>
            ) : (
              <Button
                variant="outline"
                to="/pricing"
                className="text-yellow-700 border-yellow-300 hover:bg-yellow-50"
              >
                Upgrade to Create More
              </Button>
            )}
          </div>
        </div>

        <LimitAlert />

        <div className="mt-6 sm:mt-8">
          <div className="grid gap-4 sm:gap-6">
            {waitlists.map((waitlist) => (
              <div
                key={waitlist.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 truncate">
                      {waitlist.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {waitlist.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        waitlist.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : waitlist.status === 'paused'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {waitlist.status.charAt(0).toUpperCase() + waitlist.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {waitlist.waitlist_entries?.count || 0} entries
                      </span>
                      <span className="text-xs text-gray-500">
                        Created {format(new Date(waitlist.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 sm:gap-3">
                    <Link
                      to={`/dashboard/waitlists/${waitlist.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
                    >
                      <Users className="h-5 w-5" />
                    </Link>
                    <Link
                      to={`/dashboard/waitlists/${waitlist.id}/analytics`}
                      className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
                    >
                      <BarChart3 className="h-5 w-5" />
                    </Link>
                    <Link
                      to={`/dashboard/waitlists/${waitlist.id}/settings`}
                      className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
                    >
                      <Settings className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}