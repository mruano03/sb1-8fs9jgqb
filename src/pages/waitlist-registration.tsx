import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RegistrationForm } from '@/components/waitlist/registration/registration-form';
import { ProductDetails } from '@/components/waitlist/registration/product-details';
import { PreviewBanner } from '@/components/waitlist/preview/preview-banner';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export function WaitlistRegistrationPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const [waitlist, setWaitlist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWaitlistData = async () => {
      if (!id) return;

      try {
        // For public access, we only need to check if the waitlist is active
        const { data: waitlistData, error: waitlistError } = await supabase
          .from('waitlists')
          .select(`
            id,
            name,
            description,
            tagline,
            status,
            total_spots,
            spots_remaining,
            launch_date,
            image_url,
            features,
            benefits,
            pricing,
            social_links,
            settings
          `)
          .eq('id', id)
          .eq('status', 'active')
          .single();

        if (waitlistError) {
          if (waitlistError.code === 'PGRST116') {
            setError('This waitlist is not available or has been closed');
            return;
          }
          throw waitlistError;
        }

        setWaitlist(waitlistData);
      } catch (err) {
        console.error('Error fetching waitlist data:', err);
        setError('Failed to load waitlist information');
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlistData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !waitlist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Waitlist Not Available</h2>
          <p className="text-gray-600">
            {error || "The waitlist you're looking for doesn't exist or has been closed."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {isPreview && <PreviewBanner />}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-8"
          >
            <RegistrationForm 
              waitlistId={id!} 
              waitlistName={waitlist.name}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-3xl transform -rotate-1" />
            <div className="relative bg-white rounded-2xl p-8 shadow-xl">
              <ProductDetails waitlist={waitlist} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}