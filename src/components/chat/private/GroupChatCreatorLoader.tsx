
import { lazy, Suspense } from "react";
import type { SecurityLevel } from "@/types/security";

// Lazy-load the group chat creator dialog
const GroupChatCreator = lazy(() =>
  import("../groups/GroupChatCreator").then((module) => ({
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
    avatar?: File
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
}: GroupChatCreatorLoaderProps) =>
  isOpen ? (
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
  ) : null;

