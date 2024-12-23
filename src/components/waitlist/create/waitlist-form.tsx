import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ToggleSwitch } from '@/components/ui/toggle-switch';

interface WaitlistFormData {
  name: string;
  description: string;
  total_spots: string;
  launch_date: string;
  image_url: string;
  settings: {
    enableReferrals: boolean;
    enablePriority: boolean;
    enableNotifications: boolean;
  };
}

interface WaitlistFormProps {
  data: WaitlistFormData;
  onChange: (data: WaitlistFormData) => void;
}

export function WaitlistForm({ data, onChange }: WaitlistFormProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Waitlist Details</h3>
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Waitlist Name
          </label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            required
            className="mt-1"
            placeholder="e.g., Product Launch Beta"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Describe your waitlist and what participants can expect"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="total_spots" className="block text-sm font-medium text-gray-700">
              Total Spots
            </label>
            <Input
              id="total_spots"
              type="number"
              value={data.total_spots}
              onChange={(e) => onChange({ ...data, total_spots: e.target.value })}
              required
              min="1"
              className="mt-1"
              placeholder="100"
            />
          </div>

          <div>
            <label htmlFor="launch_date" className="block text-sm font-medium text-gray-700">
              Launch Date
            </label>
            <Input
              id="launch_date"
              type="date"
              value={data.launch_date}
              onChange={(e) => onChange({ ...data, launch_date: e.target.value })}
              required
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
            Cover Image URL
          </label>
          <Input
            id="image_url"
            type="url"
            value={data.image_url}
            onChange={(e) => onChange({ ...data, image_url: e.target.value })}
            className="mt-1"
            placeholder="https://example.com/image.jpg"
          />
          <p className="mt-1 text-sm text-gray-500">Optional: Add a cover image for your waitlist</p>
        </div>

        <div className="border-t pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Additional Features</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Referral System</label>
                <p className="text-sm text-gray-500">Allow participants to refer others and gain priority</p>
              </div>
              <ToggleSwitch
                checked={data.settings?.enableReferrals}
                onCheckedChange={(checked) => 
                  onChange({
                    ...data,
                    settings: { ...data.settings, enableReferrals: checked }
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Priority Queue</label>
                <p className="text-sm text-gray-500">Enable VIP and priority access features</p>
              </div>
              <ToggleSwitch
                checked={data.settings?.enablePriority}
                onCheckedChange={(checked) => 
                  onChange({
                    ...data,
                    settings: { ...data.settings, enablePriority: checked }
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                <p className="text-sm text-gray-500">Send automated updates to participants</p>
              </div>
              <ToggleSwitch
                checked={data.settings?.enableNotifications}
                onCheckedChange={(checked) => 
                  onChange({
                    ...data,
                    settings: { ...data.settings, enableNotifications: checked }
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}