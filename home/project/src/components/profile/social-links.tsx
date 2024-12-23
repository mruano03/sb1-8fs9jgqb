import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Twitter, Facebook, Instagram, Linkedin, Github, Loader2 } from 'lucide-react';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';

interface SocialLinksProps {
  links: Record<string, string | null>;
  onSave: (links: Record<string, string | null>) => Promise<void>;
}

export function SocialLinks({ links, onSave }: SocialLinksProps) {
  const { status } = useSubscriptionStatus();
  const [socialLinks, setSocialLinks] = useState(links);
  const [saving, setSaving] = useState(false);
  const isPro = status.plan === 'Pro';

  const socialIcons = {
    twitter: Twitter,
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    github: Github,
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(socialLinks);
    } finally {
      setSaving(false);
    }
  };

  if (!isPro) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Social Media Links</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upgrade to Pro to add your social media links and build a stronger presence.
        </p>
        <Button variant="outline" to="/pricing">
          Upgrade to Pro
        </Button>
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
              onChange={(e) => setSocialLinks({
                ...socialLinks,
                [platform]: e.target.value || null
              })}
              placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
              className="flex-1"
            />
          </div>
        ))}
      </div>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Social Links'
        )}
      </Button>
    </div>
  );
}