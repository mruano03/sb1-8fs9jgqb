import { supabase } from '@/lib/supabase';
import type { RegisterData, AuthResponse } from './types';
import { handleError } from '@/lib/utils/error';

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // 1. Create auth user with email confirmation disabled for now
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: data.full_name // Store in user metadata
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('No user returned from sign up');

      return {
        success: true,
        user: authData.user,
      };
    } catch (error) {
      handleError('Registration error', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      handleError('Login error', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  },

  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      handleError('Logout error', error);
    }
  },
};