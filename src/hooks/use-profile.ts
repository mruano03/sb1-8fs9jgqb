import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { profileService } from '@/lib/services/profile';
import type { Profile, ProfileUpdate } from '@/lib/services/profile';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await profileService.getProfile(user.id);
        setProfile(data);
        setError(null);
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error in useProfile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: ProfileUpdate) => {
    if (!user) return null;

    try {
      setError(null);
      const updatedProfile = await profileService.updateProfile(user.id, updates);
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
      return updatedProfile;
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
      return null;
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return null;

    try {
      setError(null);
      return await profileService.uploadAvatar(user.id, file);
    } catch (err) {
      setError('Failed to upload avatar');
      console.error('Error uploading avatar:', err);
      return null;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
  };
}