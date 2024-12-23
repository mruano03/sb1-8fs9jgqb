import { supabase } from '@/lib/supabase';
import type { Profile, ProfileUpdate } from './types';
import { handleError } from '@/lib/utils/error';

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError('Error fetching profile', error);
      return null;
    }
  },

  async updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError('Error updating profile', error);
      return null;
    }
  },

  async uploadAvatar(userId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await this.updateProfile(userId, { avatar_url: publicUrl });
      return publicUrl;
    } catch (error) {
      handleError('Error uploading avatar', error);
      return null;
    }
  }
};