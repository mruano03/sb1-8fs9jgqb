-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_waitlists_user_id ON public.waitlists(user_id);
CREATE INDEX IF NOT EXISTS idx_waitlists_status ON public.waitlists(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_waitlist_id ON public.waitlist_entries(waitlist_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_email ON public.waitlist_entries(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_status ON public.waitlist_entries(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_position ON public.waitlist_entries(position);
CREATE INDEX IF NOT EXISTS idx_waitlist_products_waitlist_id ON public.waitlist_products(waitlist_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_analytics_waitlist_id ON public.waitlist_analytics(waitlist_id);