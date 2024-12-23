export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string | null;
  company_name: string | null;
  email: string;
  avatar_url: string | null;
}

export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;