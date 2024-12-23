/*
  # Subscription Schema
  
  1. Tables
    - subscription_plans
    - user_subscriptions
  
  2. Functions & Triggers
    - Auto-assign free plan on signup
    
  3. Security
    - RLS policies for subscriptions
*/

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
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    paypal_subscription_id TEXT,
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT user_subscriptions_user_id_key UNIQUE (user_id)
);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price, interval, features, limits) 
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

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow read access to subscription plans"
    ON subscription_plans FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow read access to own subscription"
    ON user_subscriptions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Allow update to own subscription"
    ON user_subscriptions FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_plan_id ON user_subscriptions(plan_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);