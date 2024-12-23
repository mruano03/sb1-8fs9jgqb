/*
  # User Profiles Schema
  
  1. Tables
    - user_profiles
    - user_settings
  
  2. Functions & Triggers
    - Auto-create profile on signup
    
  3. Security
    - RLS policies for profiles
*/

-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    full_name TEXT,
    company_name TEXT,
    website TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_number TEXT,
    phone_verified BOOLEAN DEFAULT FALSE
);

-- Create user settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    email_notifications JSONB DEFAULT '{"waitlist_updates": true, "new_signups": true, "system_updates": true}'::jsonb,
    notification_preferences JSONB DEFAULT '{"email": true, "browser": false, "mobile": false}'::jsonb,
    theme TEXT DEFAULT 'light',
    language TEXT DEFAULT 'en',
    dashboard_layout JSONB DEFAULT '{}'::jsonb
);

-- Create triggers
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Users can view their own settings"
    ON user_settings FOR SELECT
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Users can update their own settings"
    ON user_settings FOR UPDATE
    TO authenticated
    USING (id = auth.uid());

-- Create indexes
CREATE INDEX idx_user_profiles_email_verified ON user_profiles(email_verified);
CREATE INDEX idx_user_profiles_phone_verified ON user_profiles(phone_verified);