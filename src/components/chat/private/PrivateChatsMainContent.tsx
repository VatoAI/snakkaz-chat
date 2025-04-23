
import { GroupList } from "../groups/GroupList";
import { ConversationList } from "../friends/ConversationList";
import { Group } from "@/types/group";
import { Friend } from "../friends/types";
import { DecryptedMessage } from "@/types/message";

interface PrivateChatsMainContentProps {
  groups: Group[];
  groupConversations: Record<string, DecryptedMessage[]>;
  currentUserId: string;
  userProfiles: Record<string, {username: string | null, avatar_url: string | null}>;
  setSelectedGroup: (g: Group) => void;
  searchQuery: string;
  sortedConversations: [string, DecryptedMessage[]][];
  userProfilesAll: Record<string, {username: string | null, avatar_url: string | null}>;
  currentUserIdAll: string;
  setSelectedConversation: (f: Friend) => void;
}

export function PrivateChatsMainContent({
  groups,
  groupConversations,
  currentUserId,
  userProfiles,
  setSelectedGroup,
  searchQuery,
  sortedConversations,
  userProfilesAll,
  currentUserIdAll,
  setSelectedConversation,
}: PrivateChatsMainContentProps) {
  return (
    <>
      <GroupList
        groups={groups}
        groupConversations={groupConversations}
        currentUserId={currentUserId}
        userProfiles={userProfiles}
        setSelectedGroup={setSelectedGroup}
        searchQuery={searchQuery}
      />
      <ConversationList
        conversations={sortedConversations}
        userProfiles={userProfilesAll}
        currentUserId={currentUserIdAll}
        setSelectedConversation={setSelectedConversation}
        searchQuery={searchQuery}
      />
    </>
  );
}
