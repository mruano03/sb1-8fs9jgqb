import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { WaitlistStats } from '@/components/waitlist/view/waitlist-stats';
import { WaitlistHeader } from '@/components/waitlist/view/waitlist-header';
import { WaitlistEntries } from '@/components/waitlist/view/waitlist-entries';
import { WaitlistChart } from '@/components/waitlist/view/waitlist-chart';
import { WaitlistDetails } from '@/components/waitlist/view/waitlist-details';
import { supabase } from '@/lib/supabase';
import type { Waitlist } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export function WaitlistViewPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [waitlist, setWaitlist] = useState<Waitlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWaitlist = async () => {
      if (!id || !user) return;

      try {
        const { data, error } = await supabase
          .from('waitlists')
          .select(`
            *,
            waitlist_entries (count)
          `)
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            navigate('/dashboard/waitlists', { replace: true });
            return;
          }
          throw error;
        }

        setWaitlist(data);
      } catch (err) {
        console.error('Error fetching waitlist:', err);
        setError('Failed to load waitlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlist();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !waitlist) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Waitlist not found</h2>
        <p className="mt-2 text-gray-600">The waitlist you're looking for doesn't exist or you don't have access to it.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WaitlistHeader waitlist={waitlist} />
      <WaitlistStats waitlistId={waitlist.id} />
      <WaitlistDetails waitlist={waitlist} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Signup Trends</h3>
          <div className="h-80">
            <WaitlistChart waitlistId={waitlist.id} />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          <WaitlistEntries waitlistId={waitlist.id} limit={5} />
        </Card>
      </div>
    </div>
  );
}