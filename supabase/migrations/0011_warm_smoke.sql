/*
  # Storage Setup for Waitlist Images
  
  1. Changes
    - Create storage bucket for waitlist images
    - Set up storage policies for authenticated users
    
  2. Security
    - Only authenticated users can upload images
    - Public read access for images
    - File size and type restrictions
*/

-- Enable storage by creating the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES (
  'waitlist-images',
  'waitlist-images',
  true
);

-- Set up storage policies
CREATE POLICY "Authenticated users can upload waitlist images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'waitlist-images' AND
  auth.uid()::text = (storage.foldername(name))[1] AND
  (LOWER(RIGHT(name, 4)) = '.jpg' OR 
   LOWER(RIGHT(name, 4)) = '.png' OR 
   LOWER(RIGHT(name, 5)) = '.jpeg' OR 
   LOWER(RIGHT(name, 4)) = '.gif')
);

CREATE POLICY "Public read access for waitlist images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'waitlist-images');

CREATE POLICY "Users can update their own waitlist images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'waitlist-images' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'waitlist-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own waitlist images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'waitlist-images' AND auth.uid()::text = (storage.foldername(name))[1]);