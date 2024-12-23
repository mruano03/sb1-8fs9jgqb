import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Mail, Shield, Database } from 'lucide-react';
import { ExportDataModal } from '@/components/settings/export-data-modal';
import { useAuth } from '@/contexts/auth-context';

export function SettingsPage() {
  const { user } = useAuth();
  const [showExportModal, setShowExportModal] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      browser: false,
      slack: false,
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
    },
    email: {
      fromName: 'WaitlistPro',
      fromEmail: 'notifications@waitlistpro.com',
    },
  });

  const handleSave = async () => {
    try {
      // Implement settings save logic here
      console.log('Saving settings:', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account and application preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="flex items-center text-lg font-medium">
            <Bell className="h-5 w-5 mr-2" />
            Notification Settings
          </h2>
          <div className="mt-4 space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  {key.charAt(0).toUpperCase() + key.slice(1)} Notifications
                </label>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        [key]: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center text-lg font-medium">
            <Shield className="h-5 w-5 mr-2" />
            Security Settings
          </h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Two-Factor Authentication
              </label>
              <input
                type="checkbox"
                checked={settings.security.twoFactor}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    security: {
                      ...settings.security,
                      twoFactor: e.target.checked,
                    },
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Session Timeout (minutes)
              </label>
              <Input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    security: {
                      ...settings.security,
                      sessionTimeout: parseInt(e.target.value),
                    },
                  })
                }
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center text-lg font-medium">
            <Mail className="h-5 w-5 mr-2" />
            Email Settings
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                From Name
              </label>
              <Input
                value={settings.email.fromName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    email: {
                      ...settings.email,
                      fromName: e.target.value,
                    },
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                From Email
              </label>
              <Input
                type="email"
                value={settings.email.fromEmail}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    email: {
                      ...settings.email,
                      fromEmail: e.target.value,
                    },
                  })
                }
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center text-lg font-medium">
            <Database className="h-5 w-5 mr-2" />
            Data Management
          </h2>
          <div className="mt-4 space-y-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowExportModal(true)}
            >
              Export All Data
            </Button>
            <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
              Delete Account
            </Button>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      {showExportModal && user && (
        <ExportDataModal
          userId={user.id}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}