import { Session, User } from '@supabase/supabase-js';
import { Subscription } from '@/services/subscription/types';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  subscription: Subscription | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  loading: boolean;
  loadingSubscription: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  refreshSubscription: () => Promise<void>;
}
