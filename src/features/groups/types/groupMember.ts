
import { GroupRole } from './group';

export interface GroupMember {
  id: string;
  userId: string;
  user_id?: string; // For backward compatibility
  groupId: string;
  group_id?: string; // For backward compatibility
  role: GroupRole;
  joinedAt: string;
  joined_at?: string; // For backward compatibility
  isPremium?: boolean;
  is_premium?: boolean; // For backward compatibility
  isActive?: boolean;
  is_active?: boolean;
  lastActive?: string;
  last_active?: string;
  can_write?: boolean;
  permissions?: any; // Add missing field reported in error
}
