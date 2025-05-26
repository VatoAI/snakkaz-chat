
import { Group, GroupMember } from "@/types/groups";

export interface GroupInviteButtonProps {
  isOpen: boolean;
  onClose: () => void;
  userProfiles: Record<string, any>;
  friendsList: string[];
  currentUserId: string;
  onInvite: (userId: string) => Promise<void>;
  groupMembers: string[];
  isMobile?: boolean; 
}

export interface PremiumMembershipCardProps {
  group: Group;
  currentUserId: string;
  currentMembership: GroupMember | undefined;
  onUpgradeComplete: () => void;
  isMobile?: boolean;
}

export interface GroupMembersListProps {
  members: GroupMember[];
  currentUserId: string;
  userProfiles: Record<string, any>;
  isAdmin: boolean;
  groupId: string;
  onMemberUpdated?: () => void;
  isMobile?: boolean;
}
