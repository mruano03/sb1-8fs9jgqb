-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for waitlist entries" ON public.waitlist_entries;
DROP POLICY IF EXISTS "Enable insert for waitlist entries" ON public.waitlist_entries;
DROP POLICY IF EXISTS "Enable update for waitlist entries" ON public.waitlist_entries;

-- Create new RLS policies
CREATE POLICY "Public can view active waitlist entries"
  ON public.waitlist_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.waitlists
      WHERE waitlists.id = waitlist_id
      AND waitlists.status = 'active'
    )
  );

CREATE POLICY "Anyone can create waitlist entries for active waitlists"
  ON public.waitlist_entries FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.waitlists
      WHERE waitlists.id = waitlist_id
      AND waitlists.status = 'active'
    )
  );

CREATE POLICY "Waitlist owners can update entries"
  ON public.waitlist_entries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.waitlists
      WHERE waitlists.id = waitlist_id
      AND waitlists.user_id = auth.uid()
    )
  );