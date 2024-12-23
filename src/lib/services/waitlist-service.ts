import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';
import type { WaitlistFeature, WaitlistBenefit, WaitlistPricing } from '@/lib/types';
import { notificationService } from './notification-service';

interface CreateWaitlistData extends WaitlistInsert {
  features?: WaitlistFeature[];
  benefits?: WaitlistBenefit[];
  pricing?: WaitlistPricing;
  tagline?: string;
  social_links?: Record<string, string>;
  custom_domain?: string;
}

export const waitlistService = {
  async create(waitlist: CreateWaitlistData) {
    try {
      const { data, error } = await supabase
        .from('waitlists')
        .insert({
          name: waitlist.name,
          tagline: waitlist.tagline,
          description: waitlist.description,
          status: 'active',
          user_id: waitlist.user_id,
          settings: waitlist.settings || {},
          total_spots: waitlist.total_spots,
          spots_remaining: waitlist.total_spots,
          launch_date: waitlist.launch_date,
          image_url: waitlist.image_url,
          features: waitlist.features || [],
          benefits: waitlist.benefits || [],
          pricing: waitlist.pricing || {},
          social_links: waitlist.social_links || {},
          custom_domain: waitlist.custom_domain
        })
        .select('*')
        .single();

      if (error) throw error;

      // Create notification for new waitlist
      await notificationService.createNotification({
        user_id: waitlist.user_id,
        title: 'New Waitlist Created',
        message: `Your waitlist "${waitlist.name}" has been created successfully.`,
        type: 'success'
      });

      return data;
    } catch (error) {
      console.error('Error creating waitlist:', error);
      throw error;
    }
  },

  // ... rest of the service methods
};