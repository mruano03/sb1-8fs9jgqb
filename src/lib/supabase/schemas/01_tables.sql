-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER TABLE auth.users FORCE ROW LEVEL SECURITY;

-- Waitlists table
CREATE TABLE IF NOT EXISTS public.waitlists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    settings JSONB DEFAULT '{}'::jsonb,
    total_spots INTEGER,
    spots_remaining INTEGER,
    launch_date TIMESTAMPTZ,
    image_url TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    pricing JSONB DEFAULT '{}'::jsonb
);

-- Waitlist entries table
CREATE TABLE IF NOT EXISTS public.waitlist_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    waitlist_id UUID NOT NULL REFERENCES public.waitlists(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    position INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    custom_fields JSONB DEFAULT '{}'::jsonb
);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_waitlists_updated_at
    BEFORE UPDATE ON public.waitlists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_waitlist_entries_updated_at
    BEFORE UPDATE ON public.waitlist_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.waitlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own waitlists"
    ON public.waitlists FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own waitlists"
    ON public.waitlists FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own waitlists"
    ON public.waitlists FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own waitlists"
    ON public.waitlists FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- RLS Policies for waitlist entries
CREATE POLICY "Users can view entries for their waitlists"
    ON public.waitlist_entries FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.waitlists
            WHERE waitlists.id = waitlist_id
            AND waitlists.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create entries for their waitlists"
    ON public.waitlist_entries FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.waitlists
            WHERE waitlists.id = waitlist_id
            AND waitlists.user_id = auth.uid()
        )
    );

-- Create indexes
CREATE INDEX idx_waitlists_user_id ON public.waitlists(user_id);
CREATE INDEX idx_waitlist_entries_waitlist_id ON public.waitlist_entries(waitlist_id);
CREATE INDEX idx_waitlist_entries_email ON public.waitlist_entries(email);
CREATE INDEX idx_waitlist_entries_status ON public.waitlist_entries(status);