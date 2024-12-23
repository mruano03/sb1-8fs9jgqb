import { useState, useEffect } from 'react';
import type { Waitlist } from '@/lib/types';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';

export function useWaitlists() {
  const [waitlists, setWaitlists] = useState<Waitlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWaitlists = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('waitlists')
          .select(`
            *,
            waitlist_entries (count)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setWaitlists(data || []);
      } catch (err) {
        console.error('Error fetching waitlists:', err);
        setError('Failed to load waitlists');
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlists();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('waitlists_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'waitlists',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchWaitlists();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return { waitlists, loading, error };
}