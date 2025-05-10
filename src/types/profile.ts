
// Profile type definition
export interface Profile {
  id?: string;
  user_id?: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
  bio: string | null;
  website: string | null;
  social_links: Record<string, string> | null;
  
  // Privacy settings
  show_online_status?: boolean;
  read_receipts?: boolean;
  allow_invites?: boolean;
  
  // Security settings
  two_factor_enabled?: boolean;
  
  // Verification
  is_verified?: boolean; 
  
  // Additional fields
  created_at?: string;
  updated_at?: string;
}
