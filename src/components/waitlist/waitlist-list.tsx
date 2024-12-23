import { Button } from '@/components/ui/button';
import { BarChart3, Settings, Users, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWaitlists } from '@/hooks/use-waitlists';
import { format } from 'date-fns';

export function WaitlistList() {
  const { waitlists, loading, error } = useWaitlists();

  if (loading) {
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

  if (waitlists.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-4">No waitlists yet</h3>
        <p className="text-gray-500 mb-8">Create your first waitlist to get started.</p>
        <Button to="/dashboard/waitlists/new">
          <Plus className="h-4 w-4 mr-2" />
          Create Waitlist
        </Button>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Your Waitlists</h1>
            <p className="mt-1 text-sm text-gray-500">
              A list of all your waitlists including their status and metrics.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button to="/dashboard/waitlists/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Waitlist
            </Button>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Total Signups
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Created
                </th>
                <th className="relative px-6 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {waitlists.map((waitlist) => (
                <tr key={waitlist.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{waitlist.name}</div>
                    <div className="text-sm text-gray-500">{waitlist.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      waitlist.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : waitlist.status === 'paused'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {waitlist.status.charAt(0).toUpperCase() + waitlist.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {waitlist.waitlist_entries?.count || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(waitlist.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/dashboard/waitlists/${waitlist.id}`}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Users className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/dashboard/waitlists/${waitlist.id}/analytics`}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <BarChart3 className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/dashboard/waitlists/${waitlist.id}/settings`}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Settings className="h-5 w-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}