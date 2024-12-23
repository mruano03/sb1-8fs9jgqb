import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { BasicInfoForm } from '@/components/waitlist/create/basic-info-form';
import { LogoUploadSection } from '@/components/waitlist/create/logo-upload-section';
import { SocialMediaSection } from '@/components/waitlist/create/social-media-section';
import { FeaturesSection } from '@/components/waitlist/create/features-section';
import { BenefitsSection } from '@/components/waitlist/create/benefits-section';
import { PreviewCard } from '@/components/waitlist/create/preview-card';
import { LimitAlert } from '@/components/waitlist/limit-alert';
import { useWaitlistLimits } from '@/hooks/use-waitlist-limits';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

const createWaitlistSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  totalSpots: z.string().optional(),
  launchDate: z.string().optional(),
  tagline: z.string().optional(),
  customDomain: z.string().optional(),
  settings: z.object({
    requireEmail: z.boolean().optional(),
    requireReferral: z.boolean().optional(),
    autoApprove: z.boolean().optional(),
    notifyOnJoin: z.boolean().optional(),
  }).optional(),
});

type FormData = z.infer<typeof createWaitlistSchema>;

export function CreateWaitlistPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { status } = useSubscriptionStatus();
  const { canCreateMore } = useWaitlistLimits();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    social_links: {},
    logo_url: '',
    features: [],
    benefits: [],
  });
  const isPro = status.plan === 'Pro';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createWaitlistSchema),
    defaultValues: {
      settings: {
        requireEmail: true,
        autoApprove: true,
      },
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      let imageUrl = null;

      if (coverImage) {
        const fileExt = coverImage.name.split('.').pop();
        const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('waitlist-images')
          .upload(filePath, coverImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('waitlist-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { data: waitlist, error } = await supabase
        .from('waitlists')
        .insert({
          name: data.name,
          description: data.description,
          tagline: isPro ? data.tagline : null,
          total_spots: isPro && data.totalSpots ? parseInt(data.totalSpots) : null,
          launch_date: isPro ? data.launchDate : null,
          user_id: user.id,
          status: 'active',
          image_url: imageUrl,
          logo_url: formData.logo_url,
          features: formData.features,
          benefits: formData.benefits,
          social_links: isPro ? formData.social_links : {},
          settings: {
            ...data.settings,
            customDomain: isPro ? data.customDomain : null,
          },
        })
        .select()
        .single();

      if (error) throw error;

      navigate(`/dashboard/waitlists/${waitlist.id}`);
    } catch (error) {
      console.error('Error creating waitlist:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canCreateMore) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <LimitAlert />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <BasicInfoForm
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
              />
              
              <div className="space-y-8">
                <LogoUploadSection 
                  onLogoSelect={async (file) => {
                    if (!user) return;
                    
                    try {
                      const fileExt = file.name.split('.').pop();
                      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;
                      
                      const { error: uploadError } = await supabase.storage
                        .from('waitlist-images')
                        .upload(filePath, file);

                      if (uploadError) throw uploadError;

                      const { data: { publicUrl } } = supabase.storage
                        .from('waitlist-images')
                        .getPublicUrl(filePath);

                      setFormData(prev => ({
                        ...prev,
                        logo_url: publicUrl
                      }));
                    } catch (error) {
                      console.error('Error uploading logo:', error);
                    }
                  }}
                />

                <FeaturesSection
                  features={formData.features}
                  onChange={(features) => setFormData(prev => ({
                    ...prev,
                    features
                  }))}
                />

                <BenefitsSection
                  benefits={formData.benefits}
                  onChange={(benefits) => setFormData(prev => ({
                    ...prev,
                    benefits
                  }))}
                />

                <SocialMediaSection
                  socialLinks={formData.social_links}
                  onChange={(links) => setFormData(prev => ({
                    ...prev,
                    social_links: links
                  }))}
                />
              </div>

              <div className="mt-8">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Waitlist'
                  )}
                </Button>
              </div>
            </div>

            <div className="lg:sticky lg:top-8 space-y-8">
              <PreviewCard
                formData={{
                  ...watch(),
                  logo_url: formData.logo_url,
                  social_links: formData.social_links,
                  features: formData.features,
                  benefits: formData.benefits,
                }}
                imageUrl={coverImage ? URL.createObjectURL(coverImage) : undefined}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}