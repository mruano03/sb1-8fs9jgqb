import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Settings, ExternalLink } from 'lucide-react';
import { ShareModal } from '../share/share-modal';
import { SocialLinks } from './social-links';
import type { Waitlist } from '@/lib/types';

interface WaitlistHeaderProps {
  waitlist: Waitlist;
}

export function WaitlistHeader({ waitlist }: WaitlistHeaderProps) {
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{waitlist.name}</h1>
            {waitlist.tagline && (
              <p className="mt-1 text-sm text-blue-600">{waitlist.tagline}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">{waitlist.description}</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShareModal(true)}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              to={`/waitlist/${waitlist.id}`}
              target="_blank"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Page
            </Button>
            <Button
              variant="outline"
              size="sm"
              to={`/dashboard/waitlists/${waitlist.id}/settings`}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <SocialLinks links={waitlist.social_links || {}} />
      </div>

      {showShareModal && (
        <ShareModal
          waitlist={waitlist}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
}