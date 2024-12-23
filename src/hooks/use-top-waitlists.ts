import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Waitlist } from '@/lib/types';

export function useTopWaitlists(userId: string, limit = 5) {
  const [waitlists, setWaitlists] = useState<Waitlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopWaitlists = async () => {
      try {
        const { data, error } = await supabase
          .from('waitlists')
          .select(`
            *,
            waitlist_entries (count),
            waitlist_analytics (conversion_rate)
          `)
          .eq('user_id', userId)
          .order('waitlist_entries(count)', { ascending: false })
          .limit(limit);

        if (error) throw error;
        setWaitlists(data || []);
      } catch (err) {
        console.error('Error fetching top waitlists:', err);
        setError('Failed to load top waitlists');
      } finally {
        setLoading(false);
      }
    };

    fetchTopWaitlists();
  }, [userId, limit]);

  return { waitlists, loading, error };
}