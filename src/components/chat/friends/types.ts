export interface UserProfile {
  id: string;
  username: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  isPremium?: boolean;
  is_premium?: boolean; // Database field name
  subscription_type?: string;
}

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
  profile?: UserProfile;
  created_at?: string;
  updated_at?: string;
}
