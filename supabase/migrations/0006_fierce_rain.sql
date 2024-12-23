/*
  # Add Missing Columns
  
  1. Changes
    - Add tagline column to waitlists table
    - Add analytics columns
*/

-- Add tagline column to waitlists
ALTER TABLE public.waitlists
ADD COLUMN IF NOT EXISTS tagline TEXT;

-- Add analytics columns
ALTER TABLE public.waitlist_analytics 
ADD COLUMN IF NOT EXISTS daily_signups JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS daily_approvals JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS daily_conversion JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS daily_wait_time JSONB DEFAULT '[]'::jsonb;

-- Create index for analytics
CREATE INDEX IF NOT EXISTS idx_waitlist_analytics_updated_at 
ON waitlist_analytics(updated_at);