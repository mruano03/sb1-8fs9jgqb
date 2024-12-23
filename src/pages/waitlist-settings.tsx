import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Mail, Clock, Users, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';
import { useAuth } from '@/contexts/auth-context';

interface WaitlistSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    autoReminders: boolean;
  };
  priorities: {
    vipEnabled: boolean;
    familyPriority: boolean;
    elderlyPriority: boolean;
  };
  timing: {
    maxWaitTime: number;
    reminderInterval: number;
    noShowTimeout: number;
  };
  emailTemplates: {
    welcome: string;
    reminder: string;
  };
}

export function WaitlistSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { status } = useSubscriptionStatus();
  const isPro = status.plan === 'Pro';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<WaitlistSettings>({
    notifications: {
      email: true,
      sms: false,
      autoReminders: true,
    },
    priorities: {
      vipEnabled: true,
      familyPriority: true,
      elderlyPriority: true,
    },
    timing: {
      maxWaitTime: 120,
      reminderInterval: 30,
      noShowTimeout: 15,
    },
    emailTemplates: {
      welcome: '',
      reminder: '',
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      if (!id || !user) return;

      try {
        const { data, error } = await supabase
          .from('waitlists')
          .select('settings')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data?.settings) {
          setSettings(prevSettings => ({
            ...prevSettings,
            ...data.settings,
          }));
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [id, user]);

  const handleSave = async () => {
    if (!id || !user) return;

    try {
      setSaving(true);
      setError(null);

      const { error } = await supabase
        .from('waitlists')
        .update({ settings })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Show success feedback
      const timeout = setTimeout(() => {
        setSaving(false);
      }, 1000);

      return () => clearTimeout(timeout);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Waitlist Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your waitlist preferences and automation settings
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="flex items-center text-lg font-medium">
            <Bell className="h-5 w-5 mr-2" />
            Notification Settings
          </h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Email Notifications
              </label>
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      email: e.target.checked,
                    },
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            {isPro && (
              <>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    SMS Notifications
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.sms}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          sms: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Automatic Reminders
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.autoReminders}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          autoReminders: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>
        </Card>

        {isPro && (
          <Card className="p-6">
            <h2 className="flex items-center text-lg font-medium">
              <Users className="h-5 w-5 mr-2" />
              Priority Settings
            </h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  VIP Priority
                </label>
                <input
                  type="checkbox"
                  checked={settings.priorities.vipEnabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      priorities: {
                        ...settings.priorities,
                        vipEnabled: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Family Priority
                </label>
                <input
                  type="checkbox"
                  checked={settings.priorities.familyPriority}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      priorities: {
                        ...settings.priorities,
                        familyPriority: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          </Card>
        )}

        <Card className="p-6">
          <h2 className="flex items-center text-lg font-medium">
            <Clock className="h-5 w-5 mr-2" />
            Timing Settings
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum Wait Time (minutes)
              </label>
              <Input
                type="number"
                value={settings.timing.maxWaitTime}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    timing: {
                      ...settings.timing,
                      maxWaitTime: parseInt(e.target.value),
                    },
                  })
                }
                className="mt-1"
              />
            </div>
            {isPro && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reminder Interval (minutes)
                  </label>
                  <Input
                    type="number"
                    value={settings.timing.reminderInterval}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        timing: {
                          ...settings.timing,
                          reminderInterval: parseInt(e.target.value),
                        },
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    No-Show Timeout (minutes)
                  </label>
                  <Input
                    type="number"
                    value={settings.timing.noShowTimeout}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        timing: {
                          ...settings.timing,
                          noShowTimeout: parseInt(e.target.value),
                        },
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </div>
        </Card>

        {isPro && (
          <Card className="p-6">
            <h2 className="flex items-center text-lg font-medium">
              <Mail className="h-5 w-5 mr-2" />
              Email Templates
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Welcome Email
                </label>
                <textarea
                  rows={3}
                  value={settings.emailTemplates.welcome}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      emailTemplates: {
                        ...settings.emailTemplates,
                        welcome: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter welcome email template..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reminder Email
                </label>
                <textarea
                  rows={3}
                  value={settings.emailTemplates.reminder}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      emailTemplates: {
                        ...settings.emailTemplates,
                        reminder: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter reminder email template..."
                />
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </div>
    </div>
  );
}