-- Drop existing tables and triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP TABLE IF EXISTS public.user_subscriptions CASCADE;
DROP TABLE IF EXISTS public.subscription_plans CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.waitlist_entries CASCADE;
DROP TABLE IF EXISTS public.waitlists CASCADE;

-- Create waitlists table with all required columns
CREATE TABLE IF NOT EXISTS public.waitlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    tagline TEXT,
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
    pricing JSONB DEFAULT '{}'::jsonb,
    social_links JSONB DEFAULT '{}'::jsonb,
    custom_domain TEXT
);

-- Create waitlist entries table
CREATE TABLE IF NOT EXISTS public.waitlist_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    waitlist_id UUID NOT NULL REFERENCES public.waitlists(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    position INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    custom_fields JSONB DEFAULT '{}'::jsonb
);

-- Create subscription plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL NOT NULL,
    interval TEXT NOT NULL CHECK (interval IN ('month', 'year')),
    features JSONB DEFAULT '[]'::jsonb,
    limits JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
    paypal_subscription_id TEXT,
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT user_subscriptions_user_id_key UNIQUE (user_id)
);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    full_name TEXT,
    company_name TEXT,
    email TEXT NOT NULL,
    avatar_url TEXT,
    CONSTRAINT user_profiles_email_key UNIQUE (email)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
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
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Create indexes
CREATE INDEX idx_waitlists_user_id ON public.waitlists(user_id);
CREATE INDEX idx_waitlist_entries_waitlist_id ON public.waitlist_entries(waitlist_id);
CREATE INDEX idx_waitlist_entries_email ON public.waitlist_entries(email);
CREATE INDEX idx_waitlist_entries_status ON public.waitlist_entries(status);
CREATE INDEX idx_waitlists_features ON public.waitlists USING gin (features);
CREATE INDEX idx_waitlists_benefits ON public.waitlists USING gin (benefits);
CREATE INDEX idx_waitlists_pricing ON public.waitlists USING gin (pricing);
CREATE INDEX idx_waitlists_social_links ON public.waitlists USING gin (social_links);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, price, interval, features, limits) 
VALUES 
    ('Free', 'Perfect for getting started', 0, 'month', 
     '["Basic analytics", "Email notifications", "Standard support"]'::jsonb,
     '{"waitlists": 3, "entries_per_waitlist": 100}'::jsonb),
    ('Pro', 'Best for growing businesses', 10, 'month',
     '["Advanced analytics", "Priority management", "Custom branding", "Priority support"]'::jsonb,
     '{"waitlists": -1, "entries_per_waitlist": 1000}'::jsonb)
ON CONFLICT (name) DO UPDATE 
SET 
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    features = EXCLUDED.features,
    limits = EXCLUDED.limits;

-- Function to handle new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    free_plan_id UUID;
BEGIN
    -- Create profile
    INSERT INTO public.user_profiles (id, email)
    VALUES (NEW.id, NEW.email);
    
    -- Get Free plan ID
    SELECT id INTO free_plan_id FROM public.subscription_plans WHERE name = 'Free';
    
    -- Create subscription
    INSERT INTO public.user_subscriptions (
        user_id,
        plan_id,
        status,
        current_period_start,
        current_period_end
    ) VALUES (
        NEW.id,
        free_plan_id,
        'active',
        NOW(),
        NOW() + INTERVAL '999 years'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();