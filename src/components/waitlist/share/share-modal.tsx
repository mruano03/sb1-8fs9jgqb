import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, ExternalLink, QrCode, X } from 'lucide-react';
import type { Waitlist } from '@/lib/types';

interface ShareModalProps {
  waitlist: Waitlist;
  onClose: () => void;
}

export function ShareModal({ waitlist, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/waitlist/${waitlist.id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openPreview = () => {
    window.open(`${shareUrl}?preview=true`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg p-6 m-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Share Waitlist</h2>
            <p className="mt-1 text-sm text-gray-500">
              Share this link with your customers to join the waitlist
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Waitlist URL
            </label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={openPreview}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Preview Page
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {/* Implement QR code generation */}}
            >
              <QrCode className="h-4 w-4 mr-2" />
              Show QR Code
            </Button>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Preview Mode Indicator
            </h3>
            <p className="text-sm text-blue-600">
              When viewing the preview, you'll see a banner at the top indicating you're in preview mode.
              This banner won't be visible to your customers.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}