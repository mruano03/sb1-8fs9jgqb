import { WaitlistEntries } from '@/components/waitlist/waitlist-entries';
import { useParams } from 'react-router-dom';

export function WaitlistEntriesPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Waitlist Entries</h1>
            <p className="mt-2 text-sm text-gray-700">
              View and manage all entries for this waitlist.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <WaitlistEntries />
        </div>
      </div>
    </div>
  );
}