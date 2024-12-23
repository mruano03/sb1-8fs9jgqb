-- Enable Row Level Security
ALTER TABLE public.waitlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own waitlists" ON public.waitlists;
DROP POLICY IF EXISTS "Users can create their own waitlists" ON public.waitlists;
DROP POLICY IF EXISTS "Users can update their own waitlists" ON public.waitlists;
DROP POLICY IF EXISTS "Users can delete their own waitlists" ON public.waitlists;

-- Waitlist policies
CREATE POLICY "Enable read access for own waitlists"
ON public.waitlists FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for authenticated users"
ON public.waitlists FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for own waitlists"
ON public.waitlists FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete access for own waitlists"
ON public.waitlists FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Waitlist products policies
CREATE POLICY "Enable read access for waitlist products"
ON public.waitlist_products FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.waitlists
    WHERE waitlists.id = waitlist_products.waitlist_id
    AND waitlists.user_id = auth.uid()
  )
);

CREATE POLICY "Enable insert access for waitlist products"
ON public.waitlist_products FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.waitlists
    WHERE waitlists.id = waitlist_products.waitlist_id
    AND waitlists.user_id = auth.uid()
  )
);

CREATE POLICY "Enable update access for waitlist products"
ON public.waitlist_products FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.waitlists
    WHERE waitlists.id = waitlist_products.waitlist_id
    AND waitlists.user_id = auth.uid()
  )
);

-- Waitlist entries policies
CREATE POLICY "Enable read access for waitlist entries"
ON public.waitlist_entries FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.waitlists
    WHERE waitlists.id = waitlist_entries.waitlist_id
    AND waitlists.user_id = auth.uid()
  )
);

CREATE POLICY "Enable insert access for waitlist entries"
ON public.waitlist_entries FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.waitlists
    WHERE waitlists.id = waitlist_entries.waitlist_id
    AND waitlists.user_id = auth.uid()
  )
);

-- Analytics policies
CREATE POLICY "Enable read access for waitlist analytics"
ON public.waitlist_analytics FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.waitlists
    WHERE waitlists.id = waitlist_analytics.waitlist_id
    AND waitlists.user_id = auth.uid()
  )
);

CREATE POLICY "Enable insert/update access for waitlist analytics"
ON public.waitlist_analytics FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.waitlists
    WHERE waitlists.id = waitlist_analytics.waitlist_id
    AND waitlists.user_id = auth.uid()
  )
);