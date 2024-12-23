import { supabase } from '@/lib/supabase';
import { emailService } from '../email/email-service';
import { notificationService } from '../notification/notification-service';
import type { CreateWaitlistEntryData, WaitlistEntryResponse } from './types';

export const waitlistEntryService = {
  async getNextPosition(waitlistId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('waitlist_entries')
        .select('position')
        .eq('waitlist_id', waitlistId)
        .order('position', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return (data?.position || 0) + 1;
    } catch (error) {
      console.error('Error getting next position:', error);
      return 1; // Start from 1 if there's an error or no entries
    }
  },

  async create(waitlistId: string, data: CreateWaitlistEntryData): Promise<WaitlistEntryResponse> {
    try {
      // First get the waitlist details including settings
      const { data: waitlist, error: waitlistError } = await supabase
        .from('waitlists')
        .select('id, name, user_id, status, settings')
        .eq('id', waitlistId)
        .eq('status', 'active')
        .single();

      if (waitlistError) throw waitlistError;
      if (!waitlist) throw new Error('Waitlist not found or inactive');

      // Check if auto-approve is enabled in settings
      const autoApprove = waitlist.settings?.autoApprove ?? false;
      const nextPosition = await this.getNextPosition(waitlistId);

      // Create the entry with appropriate status
      const { data: entry, error: entryError } = await supabase
        .from('waitlist_entries')
        .insert({
          waitlist_id: waitlistId,
          name: data.name,
          email: data.email,
          position: nextPosition,
          status: autoApprove ? 'approved' : 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (entryError) throw entryError;

      // Send welcome email
      await emailService.sendWelcomeEmail({
        email: data.email,
        waitlistName: waitlist.name,
        position: nextPosition,
        status: autoApprove ? 'approved' : 'pending'
      });

      // Notify waitlist owner
      await notificationService.create({
        user_id: waitlist.user_id,
        title: 'New Waitlist Entry',
        message: `${data.name} has joined "${waitlist.name}"${autoApprove ? ' and was automatically approved' : ''}`,
        type: 'info'
      });

      return {
        ...entry,
        waitlists: waitlist
      };
    } catch (error) {
      console.error('Error creating waitlist entry:', error);
      throw error;
    }
  }
};