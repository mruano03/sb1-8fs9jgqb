-- Enable RLS
ALTER TABLE public.waitlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view active waitlists" ON public.waitlists;
DROP POLICY IF EXISTS "Anyone can create waitlist entries" ON public.waitlist_entries;
DROP POLICY IF EXISTS "Waitlist owners can update entries" ON public.waitlist_entries;

-- Waitlist policies
CREATE POLICY "Public can view active waitlists"
  ON public.waitlists FOR SELECT
  USING (status = 'active');

CREATE POLICY "Owners can manage their waitlists"
  ON public.waitlists 
  USING (auth.uid() = user_id);

-- Waitlist entries policies
CREATE POLICY "Public can view entries for active waitlists"
  ON public.waitlist_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.waitlists
      WHERE waitlists.id = waitlist_id
      AND waitlists.status = 'active'
    )
  );

CREATE POLICY "Anyone can join active waitlists"
  ON public.waitlist_entries FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.waitlists
      WHERE waitlists.id = waitlist_id
      AND waitlists.status = 'active'
    )
  );

CREATE POLICY "Owners can manage entries"
  ON public.waitlist_entries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.waitlists
      WHERE waitlists.id = waitlist_id
      AND waitlists.user_id = auth.uid()
    )
  );

-- Email notifications policies
CREATE POLICY "System can manage email notifications"
  ON public.email_notifications
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_waitlists_status ON public.waitlists(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_waitlist_id ON public.waitlist_entries(waitlist_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_email ON public.waitlist_entries(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_status ON public.waitlist_entries(status);