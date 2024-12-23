import { supabase } from '@/lib/supabase';

export const subscriptionService = {
  async getCurrentPlan(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (
            id,
            name,
            description,
            price,
            interval,
            features,
            limits
          )
        `)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  },

  async updateSubscription(userId: string, paypalSubscriptionId: string) {
    try {
      // Get the Pro plan ID
      const { data: proPlan } = await supabase
        .from('subscription_plans')
        .select('id')
        .eq('name', 'Pro')
        .single();

      if (!proPlan) throw new Error('Pro plan not found');

      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      const { data, error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          plan_id: proPlan.id,
          paypal_subscription_id: paypalSubscriptionId,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd.toISOString(),
          cancel_at_period_end: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  },

  async checkSubscriptionAccess(userId: string, feature: string): Promise<boolean> {
    try {
      const subscription = await this.getCurrentPlan(userId);
      
      if (!subscription) return false;
      
      const now = new Date();
      const periodEnd = new Date(subscription.current_period_end);
      
      if (subscription.status !== 'active' || now > periodEnd) {
        return false;
      }

      return subscription.subscription_plans.features.includes(feature);
    } catch (error) {
      console.error('Error checking subscription access:', error);
      return false;
    }
  }
};