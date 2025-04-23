
import { useState, lazy, Suspense } from "react";
import { useGroups } from "./hooks/useGroups";
import { useGroupInvites } from "./hooks/useGroupInvites";
import { reduceConversations, reduceGroupConversations } from "./hooks/useConversationUtils";
import { ChatDialogs } from "./ChatDialogs";
import { GroupChat } from '@/components/chat/groups/GroupChat';
import { DirectMessage } from '@/components/chat/friends/DirectMessage';

import { PrivateChatActions } from "./private/PrivateChatActions";
import { PrivateChatsMainContent } from "./private/PrivateChatsMainContent";
import { PrivateChatsEmptyState } from "./private/PrivateChatsEmptyState";

import { DecryptedMessage } from "@/types/message";
import { Friend } from "@/components/chat/friends/types";
import { Group, GroupInvite } from "@/types/group";
import { WebRTCManager } from "@/utils/webrtc";

// Use lazy loading for the GroupChatCreator component
const GroupChatCreator = lazy(() => import("./groups/GroupChatCreator").then(module => ({ 
  default: module.GroupChatCreator 
})));

interface PrivateChatsProps {
  currentUserId: string;
  webRTCManager: WebRTCManager | null;
  directMessages: DecryptedMessage[];
  onNewMessage: (message: DecryptedMessage) => void;
  onStartChat: (userId: string) => void;
  userProfiles: Record<string, {username: string | null, avatar_url: string | null}>;
  friendsList?: string[];
}

export const PrivateChats = ({
  currentUserId,
  webRTCManager,
  directMessages,
  onNewMessage,
  onStartChat,
  userProfiles,
  friendsList = []
}: PrivateChatsProps) => {
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
  } = useGroups({ currentUserId, userProfiles });

  const {
    groupInvites,
    setGroupInvites,
  } = useGroupInvites({ currentUserId, userProfiles });

  const conversations = reduceConversations(directMessages, currentUserId);
  const groupConversations = reduceGroupConversations(directMessages);

  // Sort and filter logic
  const sortedConversations = Object.entries(conversations)
    .sort(([, a], [, b]) => {
      const lastA = a[a.length - 1];
      const lastB = b[b.length - 1];
      return new Date(lastB.created_at).getTime() - new Date(lastA.created_at).getTime();
    });

  const sortedGroupConversations = Object.entries(groupConversations)
    .sort(([, a], [, b]) => {
      const lastA = a[a.length - 1];
      const lastB = b[b.length - 1];
      return new Date(lastB.created_at).getTime() - new Date(lastA.created_at).getTime();
    });

  // Conversation handlers
  const handleAcceptInvite = async (invite: GroupInvite) => {
    try {
      const { error: joinError } = await import("@/integrations/supabase/client").then(m => m.supabase)
        .from('group_members')
        .insert({
          user_id: currentUserId,
          group_id: invite.group_id,
          role: 'member'
        });

      if (joinError) throw joinError;

      const { error: deleteError } = await import("@/integrations/supabase/client").then(m => m.supabase)
        .from('group_invites')
        .delete()
        .eq('id', invite.id);

      if (deleteError) throw deleteError;

      await refreshGroups();
      setGroupInvites(invites => invites.filter(inv => inv.id !== invite.id));

      const joinedGroup = groups.find(g => g.id === invite.group_id);
      if (joinedGroup) {
        setSelectedGroup(joinedGroup);
      }

      setIsInviteDialogOpen(false);
    } catch (error) {
      console.error("Error accepting invite:", error);
      throw error;
    }
  };

  const handleDeclineInvite = async (invite: GroupInvite) => {
    try {
      const { error } = await import("@/integrations/supabase/client").then(m => m.supabase)
        .from('group_invites')
        .delete()
        .eq('id', invite.id);

      if (error) throw error;

      setGroupInvites(invites => invites.filter(inv => inv.id !== invite.id));
    } catch (error) {
      console.error("Error declining invite:", error);
      throw error;
    }
  };

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
      
      {/* Properly render the GroupChatCreator with Suspense */}
      {isGroupCreatorOpen && (
        <Suspense fallback={<div className="p-4 text-center text-cybergold-300">Laster...</div>}>
          <GroupChatCreator
            isOpen={isGroupCreatorOpen}
            onClose={() => setIsGroupCreatorOpen(false)}
            onCreateGroup={handleCreateGroup}
            currentUserId={currentUserId}
            userProfiles={userProfiles}
            friendsList={friendsList}
          />
        </Suspense>
      )}
      
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
