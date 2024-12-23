/*
  # Add Logo URL Column to Waitlists

  1. Changes
    - Add logo_url column to waitlists table
    - Add image specifications as JSONB
  
  2. Security
    - No changes to RLS policies needed
    - Storage policies already handle image uploads
*/

-- Add logo_url column if it doesn't exist
ALTER TABLE public.waitlists
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Add image specifications if they don't exist
ALTER TABLE public.waitlists
ADD COLUMN IF NOT EXISTS image_specs JSONB DEFAULT '{
  "logo": {
    "max_size": 2097152,
    "recommended_size": {
      "width": 200,
      "height": 200
    },
    "allowed_types": ["image/jpeg", "image/png", "image/gif"]
  },
  "cover": {
    "max_size": 5242880,
    "recommended_size": {
      "width": 1200,
      "height": 630
    },
    "allowed_types": ["image/jpeg", "image/png"]
  }
}'::jsonb;