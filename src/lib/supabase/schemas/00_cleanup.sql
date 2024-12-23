-- Drop all existing objects to avoid conflicts
DO $$ 
BEGIN
    -- Drop policies
    DROP POLICY IF EXISTS "user_profiles_select" ON public.user_profiles;
    DROP POLICY IF EXISTS "user_profiles_update" ON public.user_profiles;
    DROP POLICY IF EXISTS "user_profiles_insert" ON public.user_profiles;
    DROP POLICY IF EXISTS "notifications_select" ON public.notifications;
    DROP POLICY IF EXISTS "notifications_update" ON public.notifications;
    DROP POLICY IF EXISTS "notifications_insert" ON public.notifications;
    
    -- Drop triggers
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
    DROP TRIGGER IF EXISTS update_notifications_updated_at ON public.notifications;
    
    -- Drop functions
    DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
    DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
END $$;