import { SecurityLevel } from './security';

export type GroupWritePermission = 'all' | 'admin' | 'selected';
// Fjernet null som et alternativ siden alle meldinger skal slettes 
export type MessageTTLOption = 300 | 1800 | 3600 | 86400 | 604800; // 5min, 30min, 1h, 24h, 7d

export interface Group {
  id: string;
  name: string;
  created_at: string;
  creator_id: string;
  members: GroupMember[];
  security_level: SecurityLevel;
  password?: string;
  avatar_url?: string;
  // Nye felter
  write_permissions: GroupWritePermission; // 'all', 'admin', eller 'selected'
  default_message_ttl: MessageTTLOption; // Standard TTL for meldinger i gruppen, nå påkrevd
}

export interface GroupMember {
  id: string;
  user_id: string;
  group_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  profile?: {
    id: string;
    username: string | null;
    avatar_url: string | null;
    full_name: string | null;
  };
  // Nytt felt
  can_write?: boolean; // Om brukeren kan skrive meldinger, relevant når write_permissions === 'selected'
}

export interface GroupInvite {
  id: string;
  group_id: string;
  invited_by: string;
  invited_user_id: string;
  created_at: string;
  expires_at: string;
  group_name?: string;
  sender_username?: string;
}

