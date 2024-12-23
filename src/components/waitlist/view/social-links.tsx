import { Twitter, Facebook, Instagram, Linkedin, Globe } from 'lucide-react';

interface SocialLinksProps {
  links: Record<string, string>;
}

export function SocialLinks({ links }: SocialLinksProps) {
  const socialIcons = {
    twitter: Twitter,
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    website: Globe,
  };

  const hasLinks = Object.values(links).some(link => link);

  if (!hasLinks) return null;

  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {Object.entries(links).map(([platform, url]) => {
        if (!url) return null;
        const Icon = socialIcons[platform as keyof typeof socialIcons];
        if (!Icon) return null;

        return (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm capitalize">{platform}</span>
          </a>
        );
      })}
    </div>
  );
}