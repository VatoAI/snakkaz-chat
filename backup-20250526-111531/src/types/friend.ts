
import { UserProfile } from '@/components/chat/friends/types';

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
  profile?: UserProfile;
  created_at?: string;
  updated_at?: string;
}

export interface FriendRecord {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
  profile?: UserProfile;
  isOnline?: boolean;
  lastActive?: string;
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  sender_profile?: UserProfile;
}
