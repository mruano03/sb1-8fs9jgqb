import { supabase } from '@/lib/supabase';
import type { CreateNotificationData, Notification } from './types';

export const notificationService = {
  async create(data: CreateNotificationData): Promise<Notification> {
    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          user_id: data.user_id,
          title: data.title,
          message: data.message,
          type: data.type,
          read: false
        })
        .select()
        .single();

      if (error) throw error;
      return notification;
    } catch (err) {
      console.error('Error creating notification:', err);
      throw err;
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      throw err;
    }
  },

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch (err) {
      console.error('Error getting unread count:', err);
      throw err;
    }
  }
};