-- User profiles policies
CREATE POLICY "user_profiles_select"
    ON public.user_profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "user_profiles_update"
    ON public.user_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "user_profiles_insert"
    ON public.user_profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Notifications policies
CREATE POLICY "notifications_select"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "notifications_update"
    ON public.notifications FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "notifications_insert"
    ON public.notifications FOR INSERT
    TO authenticated
    WITH CHECK (true);