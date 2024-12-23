import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { WaitlistEntry } from '@/lib/types';

export function useWaitlistEntries(waitlistId: string) {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const { data, error } = await supabase
          .from('waitlist_entries')
          .select('*')
          .eq('waitlist_id', waitlistId)
          .order('position', { ascending: true });

        if (error) throw error;
        setEntries(data || []);
      } catch (err) {
        console.error('Error fetching entries:', err);
        setError('Failed to load entries');
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('entries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'waitlist_entries',
          filter: `waitlist_id=eq.${waitlistId}`,
        },
        () => {
          fetchEntries();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [waitlistId]);

  const updateEntryStatus = async (entryId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('waitlist_entries')
        .update({ status })
        .eq('id', entryId);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating entry status:', err);
      throw err;
    }
  };

  return { entries, loading, error, updateEntryStatus };
}