import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/auth-context';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';
import { waitlistService } from '@/lib/services/waitlist-service';
import { Loader2, Lock, Upload } from 'lucide-react';

export function CreateWaitlistForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { status } = useSubscriptionStatus();
  const navigate = useNavigate();
  const isPro = status.plan === 'Pro';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const waitlistData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        user_id: user.id,
        total_spots: parseInt(formData.get('total_spots') as string) || null,
        launch_date: formData.get('launch_date') as string || null,
        image_url: formData.get('image_url') as string || null,
        status: 'active' as const,
        settings: {
          appearance: {
            theme: formData.get('theme') || 'light',
            brandColor: formData.get('brand_color') || '#3B82F6',
            logo_url: formData.get('logo_url') || null,
            customCss: isPro ? formData.get('custom_css') : null,
            layout: isPro ? formData.get('layout') : 'default',
          },
          registration: {
            requireEmail: true,
            requireName: true,
            customFields: isPro ? JSON.parse(formData.get('custom_fields') as string || '[]') : [],
            termsUrl: formData.get('terms_url') || null,
            privacyUrl: formData.get('privacy_url') || null,
          },
          notifications: {
            enabled: formData.get('enable_notifications') === 'on',
            email: {
              enabled: formData.get('enable_email') === 'on',
              welcomeTemplate: formData.get('welcome_email_template') || null,
              approvalTemplate: formData.get('approval_email_template') || null,
            },
            sms: isPro ? {
              enabled: formData.get('enable_sms') === 'on',
              provider: formData.get('sms_provider') || null,
            } : null,
          },
          features: {
            autoApprove: formData.get('auto_approve') === 'on',
            waitingRoom: isPro && formData.get('enable_waiting_room') === 'on',
            referrals: isPro ? {
              enabled: formData.get('enable_referrals') === 'on',
              rewardPoints: parseInt(formData.get('reward_points') as string) || 0,
              maxReferrals: parseInt(formData.get('max_referrals') as string) || 10,
            } : null,
            priorityQueue: isPro ? {
              enabled: formData.get('enable_priority') === 'on',
              vipSpots: parseInt(formData.get('vip_spots') as string) || 0,
              rules: JSON.parse(formData.get('priority_rules') as string || '[]'),
            } : null,
          },
          integrations: isPro ? {
            webhook_url: formData.get('webhook_url') || null,
            zapier_enabled: formData.get('enable_zapier') === 'on',
            slack_webhook: formData.get('slack_webhook') || null,
          } : null,
        }
      };

      const waitlist = await waitlistService.create(waitlistData);
      navigate(`/dashboard/waitlists/${waitlist.id}`);
    } catch (err) {
      console.error('Error creating waitlist:', err);
      setError('Failed to create waitlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Waitlist Name
            </label>
            <Input
              id="name"
              name="name"
              required
              placeholder="e.g., Product Launch Beta"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Describe your waitlist"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="total_spots" className="block text-sm font-medium text-gray-700">
                Total Spots
              </label>
              <Input
                id="total_spots"
                name="total_spots"
                type="number"
                min="1"
                placeholder="Leave empty for unlimited"
              />
            </div>

            <div>
              <label htmlFor="launch_date" className="block text-sm font-medium text-gray-700">
                Launch Date
              </label>
              <Input
                id="launch_date"
                name="launch_date"
                type="date"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cover Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="image_url" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload a file</span>
                    <Input
                      id="image_url"
                      name="image_url"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Appearance</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
              Theme
            </label>
            <select
              id="theme"
              name="theme"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              {isPro && <option value="custom">Custom</option>}
            </select>
          </div>

          <div>
            <label htmlFor="brand_color" className="block text-sm font-medium text-gray-700">
              Brand Color
            </label>
            <Input
              id="brand_color"
              name="brand_color"
              type="color"
              defaultValue="#3B82F6"
              className="h-10"
            />
          </div>

          {isPro && (
            <>
              <div>
                <label htmlFor="layout" className="block text-sm font-medium text-gray-700">
                  Layout Style
                </label>
                <select
                  id="layout"
                  name="layout"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="default">Default</option>
                  <option value="centered">Centered</option>
                  <option value="split">Split</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>

              <div>
                <label htmlFor="custom_css" className="block text-sm font-medium text-gray-700">
                  Custom CSS
                </label>
                <textarea
                  id="custom_css"
                  name="custom_css"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
                  placeholder=".waitlist-form { /* your styles */ }"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Registration Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="auto_approve" className="block text-sm font-medium text-gray-700">
                Auto-approve Entries
              </label>
              <p className="text-sm text-gray-500">Automatically approve new signups</p>
            </div>
            <Switch name="auto_approve" id="auto_approve" />
          </div>

          {isPro && (
            <>
              <div>
                <label htmlFor="custom_fields" className="block text-sm font-medium text-gray-700">
                  Custom Fields
                </label>
                <textarea
                  id="custom_fields"
                  name="custom_fields"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
                  placeholder='[{"name": "company", "label": "Company Name", "type": "text", "required": true}]'
                />
                <p className="mt-1 text-sm text-gray-500">Add custom fields in JSON format</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="enable_waiting_room" className="block text-sm font-medium text-gray-700">
                    Enable Waiting Room
                  </label>
                  <p className="text-sm text-gray-500">Show position in queue and estimated wait time</p>
                </div>
                <Switch name="enable_waiting_room" id="enable_waiting_room" />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="enable_notifications" className="block text-sm font-medium text-gray-700">
                Enable Notifications
              </label>
              <p className="text-sm text-gray-500">Send updates to waitlist members</p>
            </div>
            <Switch name="enable_notifications" id="enable_notifications" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="enable_email" className="block text-sm font-medium text-gray-700">
                Email Notifications
              </label>
              <p className="text-sm text-gray-500">Send email updates</p>
            </div>
            <Switch name="enable_email" id="enable_email" />
          </div>

          {isPro && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="enable_sms" className="block text-sm font-medium text-gray-700">
                    SMS Notifications
                  </label>
                  <p className="text-sm text-gray-500">Send SMS updates</p>
                </div>
                <Switch name="enable_sms" id="enable_sms" />
              </div>

              <div>
                <label htmlFor="welcome_email_template" className="block text-sm font-medium text-gray-700">
                  Welcome Email Template
                </label>
                <textarea
                  id="welcome_email_template"
                  name="welcome_email_template"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Welcome to {{waitlist_name}}! Your position is {{position}}..."
                />
              </div>
            </>
          )}
        </div>
      </div>

      {isPro && (
        <>
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Advanced Features</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="enable_referrals" className="block text-sm font-medium text-gray-700">
                    Enable Referral System
                  </label>
                  <p className="text-sm text-gray-500">Allow members to refer others</p>
                </div>
                <Switch name="enable_referrals" id="enable_referrals" />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="reward_points" className="block text-sm font-medium text-gray-700">
                    Reward Points per Referral
                  </label>
                  <Input
                    id="reward_points"
                    name="reward_points"
                    type="number"
                    min="0"
                    defaultValue="10"
                  />
                </div>

                <div>
                  <label htmlFor="max_referrals" className="block text-sm font-medium text-gray-700">
                    Max Referrals per User
                  </label>
                  <Input
                    id="max_referrals"
                    name="max_referrals"
                    type="number"
                    min="1"
                    defaultValue="10"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="enable_priority" className="block text-sm font-medium text-gray-700">
                    Priority Queue
                  </label>
                  <p className="text-sm text-gray-500">Enable VIP and priority access</p>
                </div>
                <Switch name="enable_priority" id="enable_priority" />
              </div>

              <div>
                <label htmlFor="priority_rules" className="block text-sm font-medium text-gray-700">
                  Priority Rules
                </label>
                <textarea
                  id="priority_rules"
                  name="priority_rules"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
                  placeholder='[{"type": "referral_count", "min": 5, "boost": 2}]'
                />
                <p className="mt-1 text-sm text-gray-500">Define priority rules in JSON format</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium">Integrations</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="webhook_url" className="block text-sm font-medium text-gray-700">
                  Webhook URL
                </label>
                <Input
                  id="webhook_url"
                  name="webhook_url"
                  type="url"
                  placeholder="https://your-domain.com/webhook"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="enable_zapier" className="block text-sm font-medium text-gray-700">
                    Enable Zapier Integration
                  </label>
                  <p className="text-sm text-gray-500">Connect with Zapier workflows</p>
                </div>
                <Switch name="enable_zapier" id="enable_zapier" />
              </div>

              <div>
                <label htmlFor="slack_webhook" className="block text-sm font-medium text-gray-700">
                  Slack Webhook URL
                </label>
                <Input
                  id="slack_webhook"
                  name="slack_webhook"
                  type="url"
                  placeholder="https://hooks.slack.com/services/..."
                />
              </div>
            </div>
          </div>
        </>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          'Create Waitlist'
        )}
      </Button>
    </form>
  );
}