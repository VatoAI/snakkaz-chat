import { lazy, Suspense } from "react";
import type { SecurityLevel } from "@/types/security";
import { GroupWritePermission, MessageTTLOption } from "@/types/group";

// Lazy-load the group chat creator dialog - update the path to the correct location
const GroupChatCreator = lazy(() =>
  import("../security/GroupChatCreator").then((module) => ({
    default: module.GroupChatCreator,
  }))
);

interface GroupChatCreatorLoaderProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (
    name: string,
    members: string[],
    securityLevel: SecurityLevel,
    password?: string,
    avatar?: File,
    writePermissions?: GroupWritePermission,
    defaultMessageTtl?: MessageTTLOption,
    memberWritePermissions?: Record<string, boolean>
  ) => Promise<void>;
  currentUserId: string;
  userProfiles: Record<string, { username: string | null; avatar_url: string | null }>;
  friendsList: string[];
}

export const GroupChatCreatorLoader = ({
  isOpen,
  onClose,
  onCreateGroup,
  currentUserId,
  userProfiles,
  friendsList
}: GroupChatCreatorLoaderProps) => {
  // Only render the component when it's open
  if (!isOpen) return null;
  
  return (
    <Suspense fallback={<div className="p-4 text-center text-cybergold-300">Laster...</div>}>
      <GroupChatCreator
        isOpen={isOpen}
        onClose={onClose}
        onCreateGroup={onCreateGroup}
        currentUserId={currentUserId}
        userProfiles={userProfiles}
        friendsList={friendsList}
      />
    </Suspense>
  );
};
