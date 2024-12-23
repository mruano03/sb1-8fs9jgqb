import { Input } from '@/components/ui/input';
import { Twitter, Facebook, Instagram, Linkedin, Globe } from 'lucide-react';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';

interface SocialMediaSectionProps {
  socialLinks: Record<string, string>;
  onChange: (links: Record<string, string>) => void;
}

export function SocialMediaSection({ socialLinks, onChange }: SocialMediaSectionProps) {
  const { status } = useSubscriptionStatus();
  const isPro = status.plan === 'Pro';

  const socialIcons = {
    twitter: Twitter,
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    website: Globe,
  };

  if (!isPro) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Social Media Links</h3>
        <p className="text-sm text-gray-600">
          Upgrade to Pro to add social media links to your waitlist page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Social Media Links</h3>
      <div className="space-y-4">
        {Object.entries(socialIcons).map(([platform, Icon]) => (
          <div key={platform} className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Icon className="h-4 w-4 text-gray-600" />
            </div>
            <Input
              value={socialLinks[platform] || ''}
              onChange={(e) => onChange({
                ...socialLinks,
                [platform]: e.target.value
              })}
              placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
              className="flex-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
}