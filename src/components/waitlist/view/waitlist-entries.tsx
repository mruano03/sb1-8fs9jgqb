import { useEffect, useState } from 'react';
import { Check, X, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { WaitlistEntry } from '@/lib/types';
import { formatDateTime } from '@/lib/utils/date';

interface WaitlistEntriesProps {
  waitlistId: string;
  limit?: number;
}

export function WaitlistEntries({ waitlistId, limit }: WaitlistEntriesProps) {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        let query = supabase
          .from('waitlist_entries')
          .select('*')
          .eq('waitlist_id', waitlistId)
          .order('created_at', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setEntries(data || []);
      } catch (err) {
        console.error('Error fetching entries:', err);
        setError('Failed to load entries');
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [waitlistId, limit]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-500">
        Loading entries...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        {error}
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="text-center py-6 text-gray-500">
        No entries yet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Name
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Joined
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                {entry.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <div className="flex items-center">
                  {getStatusIcon(entry.status)}
                  <span className="ml-2 capitalize">{entry.status}</span>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {formatDateTime(entry.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}