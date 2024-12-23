import { supabase } from '@/lib/supabase';
import type { WelcomeEmailData } from './types';

export const emailService = {
  async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    try {
      const subject = data.status === 'approved' 
        ? `Welcome to ${data.waitlistName}!`
        : `You've joined the waitlist for ${data.waitlistName}`;

      const body = data.status === 'approved'
        ? `You've been automatically approved! Your position is #${data.position}.`
        : `Thank you for joining! Your position is #${data.position}. We'll notify you when you're approved.`;

      const { error } = await supabase
        .from('email_notifications')
        .insert({
          recipient: data.email,
          subject,
          body,
          status: 'pending',
          metadata: {
            waitlist_name: data.waitlistName,
            position: data.position,
            entry_status: data.status
          }
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error sending welcome email:', err);
      // Don't throw - we don't want to fail the registration if email fails
    }
  }
};