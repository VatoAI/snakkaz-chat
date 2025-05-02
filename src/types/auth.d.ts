
import { Session, User } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: any) => Promise<void>;
  isAuthenticated: boolean;
}
