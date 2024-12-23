/*
  # Upgrade User to Pro Plan
  
  1. Changes
    - Update user's subscription to Pro plan
    - Set subscription status to active
    - Set subscription period
    
  2. Security
    - Only affects specific user
    - Maintains RLS policies
*/

DO $$ 
DECLARE
  pro_plan_id UUID;
BEGIN
  -- Get Pro plan ID
  SELECT id INTO pro_plan_id 
  FROM subscription_plans 
  WHERE name = 'Pro';

  -- Update or insert user subscription
  INSERT INTO user_subscriptions (
    user_id,
    plan_id,
    status,
    current_period_start,
    current_period_end
  )
  VALUES (
    (SELECT id FROM auth.users WHERE email = 'mynordavidruano2003@gmail.com'),
    pro_plan_id,
    'active',
    NOW(),
    NOW() + INTERVAL '1 year'
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    plan_id = EXCLUDED.plan_id,
    status = EXCLUDED.status,
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    updated_at = NOW();

  -- Create notification for user
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type
  )
  VALUES (
    (SELECT id FROM auth.users WHERE email = 'mynordavidruano2003@gmail.com'),
    'Welcome to Pro Plan!',
    'Your account has been upgraded to Pro. Enjoy all premium features!',
    'success'
  );
END $$;