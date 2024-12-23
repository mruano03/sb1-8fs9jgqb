import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Bell, Tag, Clock, Users, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import type { WaitlistEntry } from '@/lib/types';

export function WaitlistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('waitlist_entries')
          .select('*')
          .eq('waitlist_id', id)
          .order('position', { ascending: true });

        if (error) throw error;
        setEntries(data || []);
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [id]);

  const sendNotification = async (entryId: string) => {
    try {
      // Implement email notification logic here
      console.log('Sending notification to entry:', entryId);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const updatePriority = async (entryId: string, priority: string) => {
    try {
      const { error } = await supabase
        .from('waitlist_entries')
        .update({ 'customFields.priority': priority })
        .eq('id', entryId);

      if (error) throw error;
      
      // Refresh entries
      const updatedEntries = entries.map(entry => 
        entry.id === entryId 
          ? { ...entry, customFields: { ...entry.customFields, priority } }
          : entry
      );
      setEntries(updatedEntries);
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Waitlist Details</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your waitlist entries and settings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Users className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <Card key={entry.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{entry.name}</h3>
                <p className="text-sm text-gray-500">{entry.email}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => sendNotification(entry.id)}
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updatePriority(entry.id, 'high')}
                >
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              Joined {format(new Date(entry.joinedAt), 'MMM d, yyyy')}
            </div>

            <div className="mt-4 flex gap-2">
              {entry.customFields?.priority && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {entry.customFields.priority}
                </span>
              )}
              {entry.customFields?.isVIP && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  VIP
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}