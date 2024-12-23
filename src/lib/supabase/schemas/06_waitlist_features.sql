-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_waitlists_updated_at ON public.waitlists;
DROP TRIGGER IF EXISTS update_waitlist_entries_updated_at ON public.waitlist_entries;

-- Add new columns to waitlists table
ALTER TABLE public.waitlists
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS benefits JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS pricing JSONB DEFAULT '{}'::jsonb;

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Recreate triggers
CREATE TRIGGER update_waitlists_updated_at
    BEFORE UPDATE ON public.waitlists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_waitlist_entries_updated_at
    BEFORE UPDATE ON public.waitlist_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_waitlists_features ON public.waitlists USING gin (features);
CREATE INDEX IF NOT EXISTS idx_waitlists_benefits ON public.waitlists USING gin (benefits);
CREATE INDEX IF NOT EXISTS idx_waitlists_pricing ON public.waitlists USING gin (pricing);