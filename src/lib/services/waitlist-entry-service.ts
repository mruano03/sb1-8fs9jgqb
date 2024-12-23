import { supabase } from '@/lib/supabase';
import { emailService } from './email-service';
import { notificationService } from './notification-service';

export const waitlistEntryService = {
  async create(waitlistId: string, data: { name: string; email: string }) {
    try {
      // 1. Get current max position
      const { data: maxPositionData } = await supabase
        .from('waitlist_entries')
        .select('position')
        .eq('waitlist_id', waitlistId)
        .order('position', { ascending: false })
        .limit(1)
        .single();

      const nextPosition = (maxPositionData?.position || 0) + 1;

      // 2. Create entry
      const { data: entry, error: entryError } = await supabase
        .from('waitlist_entries')
        .insert({
          waitlist_id: waitlistId,
          name: data.name,
          email: data.email,
          position: nextPosition,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select('*, waitlists(name, user_id)')
        .single();

      if (entryError) throw entryError;

      // 3. Send welcome email
      await emailService.sendWelcomeEmail(
        data.email,
        entry.waitlists.name,
        nextPosition
      );

      // 4. Create notification for waitlist owner
      if (entry.waitlists?.user_id) {
        await notificationService.createNotification({
          user_id: entry.waitlists.user_id,
          title: 'New Waitlist Entry',
          message: `${data.name} has joined "${entry.waitlists.name}"`,
          type: 'info'
        });
      }

      return entry;
    } catch (error) {
      console.error('Error creating waitlist entry:', error);
      throw error;
    }
  },

  async getEntriesByWaitlistId(waitlistId: string) {
    try {
      const { data, error } = await supabase
        .from('waitlist_entries')
        .select('*')
        .eq('waitlist_id', waitlistId)
        .order('position', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching waitlist entries:', error);
      throw error;
    }
  }
};