import { supabase } from '@/lib/supabaseClient';
import { Json } from '@/types/supabase';

/**
 * Subscription plan definition
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: string; // 'monthly', 'yearly', etc.
  features: Record<string, boolean | string | number>;
  created_at?: string;
  description?: string;
  badge_text?: string; // For "Popular" or "Best Value" badges
  highlighted?: boolean; // For highlighting recommended plans
}

/**
 * Active user subscription
 */
export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  created_at: string;
  updated_at: string | null;
  current_period_end: string | null;
  // The related plan data
  subscription_plans?: SubscriptionPlan;
}

/**
 * The possible statuses of a subscription
 */
export type SubscriptionStatus = 'active' | 'canceled' | 'trial' | 'past_due' | 'incomplete';

/**
 * Premium features available to subscribers
 */
export enum PremiumFeature {
  EXTENDED_STORAGE = 'extended_storage',
  PREMIUM_GROUPS = 'premium_groups',
  CUSTOM_EMAIL = 'custom_email',
  END_TO_END_ENCRYPTION = 'e2ee',
  PRIORITY_SUPPORT = 'priority_support',
  UNLIMITED_MESSAGES = 'unlimited_messages',
  ADVANCED_SECURITY = 'advanced_security',
  FILE_SHARING = 'file_sharing',
  CUSTOM_THEMES = 'custom_themes',
  API_ACCESS = 'api_access',
  ELECTRUM_INTEGRATION = 'electrum_integration'
}

/**
 * Service for managing user subscriptions and premium features
 */
class SubscriptionService {
  /**
   * Get all available subscription plans
   * @returns {Promise<SubscriptionPlan[]>} The list of subscription plans
   */
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      // Log in development to verify headers
      if (import.meta.env.DEV) {
        console.log('Fetching subscription plans...');
      }
      
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true });
      
      if (error) {
        // Log additional information about 406 errors
        if (error.message?.includes('406') || error.message?.includes('Not Acceptable')) {
          console.error('406 Not Acceptable error detected - this is likely a header issue:', error);
          console.info('Make sure the Supabase client has proper Accept: application/json headers');
        } else {
          console.error('Error fetching subscription plans:', error);
        }
        
        // If table doesn't exist, provide fallback plans
        if (error.code === 'PGRST116' || error.code === 'PGRST200') {
          console.warn('Subscription_plans table may be missing, using fallback plans');
          
          // Return fallback plans
          return [
            {
              id: 'basic',
              name: 'Basic',
              price: 0,
              interval: 'monthly',
              features: {
                'e2ee': true,
                'extended_storage': false,
                'premium_groups': false
              }
            },
            {
              id: 'premium',
              name: 'Premium',
              price: 5.99,
              interval: 'monthly',
              features: {
                'e2ee': true,
                'extended_storage': true,
                'premium_groups': true,
                'advanced_security': true,
                'file_sharing': true
              },
              badge_text: 'Popular',
              highlighted: true
            }
          ] as SubscriptionPlan[];
        }
        
        return [];
      }
      
      return data as SubscriptionPlan[];
    } catch (err) {
      console.error('Exception fetching subscription plans:', err);
      return [];
    }
  }

  /**
   * Get a user's active subscription
   * @param {string} userId - The user ID to check for subscription
   * @returns {Promise<Subscription | null>} The subscription or null if none exists
   */
  async getUserSubscription(userId: string): Promise<Subscription | null> {
    if (!userId) return null;

    try {
      // Log in development to verify headers
      if (import.meta.env.DEV) {
        console.log('Fetching user subscription for userId:', userId);
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*, subscription_plans(*)')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();
      
      if (error) {
        // PGRST116 is "no rows returned" which is not a true error
        if (error.code !== 'PGRST116') {
          // Log additional information about 406 errors
          if (error.message?.includes('406') || error.message?.includes('Not Acceptable')) {
            console.error('406 Not Acceptable error detected - this is likely a header issue:', error);
            console.info('Make sure the Supabase client has proper Accept: application/json headers');
          } else {
            console.error('Error fetching user subscription:', error);
          }
          
          // If there's a relationship error, tables might be missing
          if (error.code === 'PGRST200') {
            console.warn('Subscription tables may be missing or have incorrect schema');
            console.info('Run ./fix-subscription-schema.sh to fix database schema');
          }
        }
        return null;
      }
      
      return data as Subscription;
    } catch (err) {
      console.error('Exception fetching subscription:', err);
      return null;
    }
  }

  /**
   * Check if a user has an active premium subscription
   * @param {string} userId - The user ID to check
   * @returns {Promise<boolean>} True if the user has an active subscription
   */
  async hasActivePremium(userId: string): Promise<boolean> {
    if (!userId) return false;
    
    try {
      const subscription = await this.getUserSubscription(userId);
      
      // If database error or missing tables, assume basic functionality
      if (subscription === null) {
        console.info('No subscription found, using fallback basic features');
        return false;
      }
      
      return !!subscription;
    } catch (error) {
      console.error('Error checking active premium:', error);
      return false;
    }
  }

  /**
   * Create a new subscription for a user
   * @param {string} userId - The user ID for the subscription
   * @param {string} planId - The plan ID to subscribe to
   * @returns {Promise<Subscription | null>} The created subscription or null on error
   */
  async createSubscription(userId: string, planId: string): Promise<Subscription | null> {
    if (!userId || !planId) return null;

    const currentDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // Default to 1 month subscription
    
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([
        {
          user_id: userId,
          plan_id: planId,
          status: 'active',
          created_at: currentDate.toISOString(),
          updated_at: currentDate.toISOString(),
          current_period_end: endDate.toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating subscription:', error);
      return null;
    }
    
    return data as Subscription;
  }

  /**
   * Cancel a user's subscription
   * @param {string} userId - The user ID 
   * @returns {Promise<boolean>} Success or failure
   */
  async cancelSubscription(userId: string): Promise<boolean> {
    if (!userId) return false;

    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'canceled', updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('status', 'active');
    
    if (error) {
      console.error('Error canceling subscription:', error);
      return false;
    }
    
    return true;
  }
  
  /**
   * Check if a user has access to a specific premium feature
   * @param {string} userId - The user ID
   * @param {string} featureKey - The feature key to check
   * @returns {Promise<boolean>} True if the user has access to the feature
   */
  async hasFeatureAccess(userId: string, featureKey: string): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription || !subscription.subscription_plans) return false;
    
    const planFeatures = subscription.subscription_plans.features;
    return planFeatures && planFeatures[featureKey] === true;
  }

  /**
   * Create or update a trial subscription for a user
   * @param {string} userId - The user ID for the trial
   * @param {number} daysToExpire - Number of days the trial should last
   * @returns {Promise<boolean>} Success or failure
   */
  async createTrialSubscription(userId: string, daysToExpire = 14): Promise<boolean> {
    if (!userId) return false;
    
    // Find the base premium plan
    const { data: plans, error: planError } = await supabase
      .from('subscription_plans')
      .select('id')
      .eq('name', 'Premium')
      .single();
      
    if (planError || !plans) {
      console.error('Error finding premium plan:', planError);
      return false;
    }
    
    const currentDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysToExpire);
    
    const { error } = await supabase
      .from('subscriptions')
      .insert([
        {
          user_id: userId,
          plan_id: plans.id,
          status: 'trial',
          created_at: currentDate.toISOString(),
          updated_at: currentDate.toISOString(),
          current_period_end: endDate.toISOString()
        }
      ]);
    
    if (error) {
      console.error('Error creating trial subscription:', error);
      return false;
    }
    
    return true;
  }

  /**
   * Check if a user's subscription is about to expire
   * @param {string} userId - The user ID to check
   * @param {number} daysThreshold - Days threshold for warning (default: 5)
   * @returns {Promise<boolean>} True if subscription is expiring soon
   */
  async isSubscriptionExpiringSoon(userId: string, daysThreshold = 5): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription) return false;
    
    const expiryDate = new Date(subscription.current_period_end);
    const currentDate = new Date();
    
    // Calculate difference in days
    const diffTime = expiryDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= daysThreshold && diffDays >= 0;
  }
}

// Export a singleton instance
export const subscriptionService = new SubscriptionService();
export default subscriptionService;
