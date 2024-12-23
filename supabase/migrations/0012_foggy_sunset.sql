/*
  # Add Social Media and Image Specifications
  
  1. Changes
    - Add social media fields to user profiles
    - Add image specifications to waitlists
    
  2. Security
    - Only Pro users can use social media features
*/

-- Add social media fields to user profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{
  "twitter": null,
  "facebook": null,
  "instagram": null,
  "linkedin": null,
  "github": null
}'::jsonb;

-- Add image specifications to waitlists
ALTER TABLE public.waitlists
ADD COLUMN IF NOT EXISTS logo_specs JSONB DEFAULT '{
  "max_size": 2097152,
  "allowed_types": ["image/jpeg", "image/png", "image/gif"],
  "recommended_size": {
    "width": 200,
    "height": 200
  }
}'::jsonb,
ADD COLUMN IF NOT EXISTS cover_specs JSONB DEFAULT '{
  "max_size": 5242880,
  "allowed_types": ["image/jpeg", "image/png"],
  "recommended_size": {
    "width": 1200,
    "height": 630
  }
}'::jsonb;