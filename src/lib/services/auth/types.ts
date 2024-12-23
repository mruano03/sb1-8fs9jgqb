import type { User } from '@supabase/supabase-js';

export interface RegisterData {
  email: string;
  password: string;
  full_name?: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User | null;
}