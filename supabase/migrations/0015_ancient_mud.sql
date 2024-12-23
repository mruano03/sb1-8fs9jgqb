/*
  # Update Waitlist Schema

  1. Changes
    - Add social_links JSONB column for storing social media URLs
    - Add features JSONB array for storing waitlist features
    - Add benefits JSONB array for storing waitlist benefits
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add columns if they don't exist
ALTER TABLE public.waitlists
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS benefits JSONB DEFAULT '[]'::jsonb;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_waitlists_features ON waitlists USING gin (features);
CREATE INDEX IF NOT EXISTS idx_waitlists_benefits ON waitlists USING gin (benefits);
CREATE INDEX IF NOT EXISTS idx_waitlists_social_links ON waitlists USING gin (social_links);