/*
  # Fix Waitlist Entries Policies
  
  1. Changes
    - Update RLS policies for waitlist_entries table
    - Allow public access for creating entries
    - Allow owners to manage entries
    - Allow public to view entries for active waitlists
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view entries for their waitlists" ON waitlist_entries;
DROP POLICY IF EXISTS "Users can create entries for their waitlists" ON waitlist_entries;

-- Create new policies
CREATE POLICY "Allow public to join active waitlists"
  ON waitlist_entries
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM waitlists
      WHERE id = waitlist_id
      AND status = 'active'
    )
  );

CREATE POLICY "Allow owners to manage entries"
  ON waitlist_entries
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM waitlists
      WHERE waitlists.id = waitlist_id
      AND waitlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow public to view entries for active waitlists"
  ON waitlist_entries
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM waitlists
      WHERE waitlists.id = waitlist_id
      AND waitlists.status = 'active'
    )
  );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_created_at 
ON waitlist_entries(created_at);