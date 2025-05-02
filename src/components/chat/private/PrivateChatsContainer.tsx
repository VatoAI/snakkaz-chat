
import { useState } from "react";
import { useGroups } from "../hooks/useGroups";
import { useGroupInvites } from "../hooks/useGroupInvites";
import { reduceConversations, reduceGroupConversations } from "../hooks/useConversationUtils";
import { ChatDialogs } from "../ChatDialogs";
import { GroupChat } from "../groups/GroupChat";
import { DirectMessage } from "../friends/DirectMessage";
import { PrivateChatActions } from "./PrivateChatActions";
import { PrivateChatsMainContent } from "./PrivateChatsMainContent";
import { PrivateChatsEmptyState } from "./PrivateChatsEmptyState";
import { DecryptedMessage } from "@/types/message";
import { Friend } from "../friends/types";
import { Group } from "@/types/group";
import { WebRTCManager } from "@/utils/webrtc";
import { GroupChatCreatorLoader } from "./GroupChatCreatorLoader";
import { usePrivateChatHandlers } from "./usePrivateChatHandlers";

interface PrivateChatsContainerProps {
  currentUserId: string;
  webRTCManager: WebRTCManager | null;
  directMessages: DecryptedMessage[];
  onNewMessage: (message: DecryptedMessage) => void;
  onStartChat: (userId: string) => void;
  userProfiles: Record<string, { username: string | null; avatar_url: string | null }>;
  friendsList?: string[];
}

export const PrivateChatsContainer = ({
  currentUserId,
  webRTCManager,
  directMessages,
  onNewMessage,
  onStartChat,
  userProfiles,
  friendsList = []
}: PrivateChatsContainerProps) => {
  const [selectedConversation, setSelectedConversation] = useState<Friend | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupCreatorOpen, setIsGroupCreatorOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedPasswordGroup, setSelectedPasswordGroup] = useState<Group | null>(null);

  const {
    groups,
    setGroups,
    selectedGroup,
    setSelectedGroup,
    handleCreateGroup,
    handleJoinGroup,
    refreshGroups,
  } = useGroups(currentUserId);

  const {
    invites: groupInvites,
    setGroupInvites,
    acceptInvite,
    declineInvite,
  } = useGroupInvites(currentUserId);

  const { handleAcceptInvite, handleDeclineInvite } = usePrivateChatHandlers({
    currentUserId,
    userProfiles,
    groups,
    setGroupInvites,
    refreshGroups,
    setSelectedGroup,
  });

  const conversations = reduceConversations(directMessages, currentUserId);
  const groupConversations = reduceGroupConversations(directMessages);

  // Sort and filter logic
  const sortedConversations = Object.entries(conversations)
    .sort(([, a], [, b]) => {
      const lastA = a[a.length - 1];
      const lastB = b[b.length - 1];
      return new Date(lastB.created_at).getTime() - new Date(lastA.created_at).getTime();
    });

  // Conversation handlers
  const handlePasswordSubmit = async (password: string) => {
    if (!selectedPasswordGroup) return false;
    return handleJoinGroup(selectedPasswordGroup.id, password);
  };

  // Show direct message UI if selected
  if (selectedConversation) {
    return (
      <DirectMessage
        friend={selectedConversation}
        currentUserId={currentUserId}
        webRTCManager={webRTCManager}
        onBack={() => setSelectedConversation(null)}
        messages={directMessages}
        onNewMessage={onNewMessage}
        userProfiles={userProfiles}
      />
    );
  }

  // Show group chat UI if selected
  if (selectedGroup) {
    return (
      <GroupChat
        group={selectedGroup}
        currentUserId={currentUserId}
        webRTCManager={webRTCManager}
        onBack={() => setSelectedGroup(null)}
        messages={directMessages}
        onNewMessage={onNewMessage}
        userProfiles={userProfiles}
      />
    );
  }

  // Wrapper layout (actions + main content + dialogs)
  return (
    <div className="h-full flex flex-col">
      <PrivateChatActions
        groupInvites={groupInvites}
        setIsInviteDialogOpen={setIsInviteDialogOpen}
        setIsGroupCreatorOpen={setIsGroupCreatorOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="flex-1 overflow-auto p-4">
        <PrivateChatsMainContent
          groups={groups}
          groupConversations={groupConversations}
          currentUserId={currentUserId}
          userProfiles={userProfiles}
          setSelectedGroup={setSelectedGroup}
          searchQuery={searchQuery}
          sortedConversations={sortedConversations}
          userProfilesAll={userProfiles}
          currentUserIdAll={currentUserId}
          setSelectedConversation={setSelectedConversation}
        />
        {sortedConversations.length === 0 && groups.length === 0 && (
          <PrivateChatsEmptyState />
        )}
      </div>
      <GroupChatCreatorLoader
        isOpen={isGroupCreatorOpen}
        onClose={() => setIsGroupCreatorOpen(false)}
        onCreateGroup={handleCreateGroup}
        currentUserId={currentUserId}
        userProfiles={userProfiles}
        friendsList={friendsList}
      />
      <ChatDialogs
        isPasswordDialogOpen={isPasswordDialogOpen}
        isInviteDialogOpen={isInviteDialogOpen}
        selectedPasswordGroup={selectedPasswordGroup}
        groupInvites={groupInvites}
        onClosePassword={() => {
          setIsPasswordDialogOpen(false);
          setSelectedPasswordGroup(null);
        }}
        onCloseInvite={() => setIsInviteDialogOpen(false)}
        onSubmitPassword={handlePasswordSubmit}
        onAcceptInvite={handleAcceptInvite}
        onDeclineInvite={handleDeclineInvite}
        userProfiles={userProfiles}
      />
    </div>
  );
};
