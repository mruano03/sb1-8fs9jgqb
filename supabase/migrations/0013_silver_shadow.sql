-- Create storage bucket if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'waitlist-images'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('waitlist-images', 'waitlist-images', true);
    END IF;
END $$;

-- Ensure storage policies exist
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Authenticated users can upload waitlist images" ON storage.objects;
    DROP POLICY IF EXISTS "Public read access for waitlist images" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update their own waitlist images" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their own waitlist images" ON storage.objects;

    -- Create new policies
    CREATE POLICY "Authenticated users can upload waitlist images"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'waitlist-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

    CREATE POLICY "Public read access for waitlist images"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'waitlist-images');

    CREATE POLICY "Users can update their own waitlist images"
    ON storage.objects FOR UPDATE TO authenticated
    USING (
        bucket_id = 'waitlist-images' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

    CREATE POLICY "Users can delete their own waitlist images"
    ON storage.objects FOR DELETE TO authenticated
    USING (
        bucket_id = 'waitlist-images' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );
END $$;