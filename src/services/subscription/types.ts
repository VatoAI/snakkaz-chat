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
