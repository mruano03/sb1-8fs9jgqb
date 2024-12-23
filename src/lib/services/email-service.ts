import { supabase } from '@/lib/supabase';

export const emailService = {
  async sendWelcomeEmail(email: string, waitlistName: string, position: number) {
    try {
      // En un ambiente real, aquí integrarías con un servicio de email como SendGrid o Amazon SES
      // Por ahora, simularemos guardando la notificación en la base de datos
      const { error } = await supabase
        .from('notifications')
        .insert({
          type: 'email',
          recipient: email,
          subject: `Welcome to ${waitlistName}`,
          content: `Thank you for joining ${waitlistName}! Your position is #${position}.`,
          status: 'pending'
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error sending welcome email:', err);
      throw err;
    }
  }
};