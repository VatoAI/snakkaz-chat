
import { User } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: any; // Add session property to fix type errors
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: any) => Promise<void>;
  error: string | null;
  isAuthenticated: boolean;
}
