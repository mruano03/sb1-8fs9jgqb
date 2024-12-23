/*
  # Fix Notification Policies
  
  1. Changes
    - Update RLS policies for notifications table
    - Allow system to create notifications
    - Allow users to manage their notifications
    - Add policies for notification templates
  
  2. Security
    - Enable RLS on all tables
    - Restrict access based on user_id
    - Allow system-level operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;

-- Create comprehensive notification policies
CREATE POLICY "Allow system to create notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow users to view own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow users to update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow users to delete own notifications"
  ON notifications
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for notification templates
CREATE POLICY "Allow system to manage templates"
  ON notification_templates
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default notification templates
INSERT INTO notification_templates (name, subject, body, variables)
VALUES 
  ('waitlist_welcome', 
   'Welcome to {{waitlist_name}}',
   'Thank you for joining! Your position is #{{position}}.',
   '["waitlist_name", "position"]'::jsonb),
  ('waitlist_approved',
   'You''ve been approved!',
   'Great news! You''ve been approved to join {{waitlist_name}}.',
   '["waitlist_name"]'::jsonb)
ON CONFLICT (name) DO NOTHING;