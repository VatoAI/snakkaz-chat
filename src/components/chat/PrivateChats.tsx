import { useState, useEffect } from "react";
import { MessageSquare, Search, Users, Plus, Mail, Lock, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DirectMessage } from '@/components/chat/friends/DirectMessage';
import { GroupChat } from '@/components/chat/groups/GroupChat';
import { GroupChatCreator } from '@/components/chat/security/GroupChatCreator';
import { Friend } from "@/components/chat/friends/types";
import { Group, GroupInvite, GroupMember } from "@/types/group";
import { DecryptedMessage } from "@/types/message";
import { WebRTCManager } from "@/utils/webrtc";
import { SecurityLevel } from "@/types/security";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { GroupList } from "./groups/GroupList";
import { ConversationList } from "./friends/ConversationList";
import { ChatDialogs } from "./ChatDialogs";
import { useGroups } from "./hooks/useGroups";
import { useGroupInvites } from "./hooks/useGroupInvites";
import { reduceConversations, reduceGroupConversations } from "./hooks/useConversationUtils";

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

  const filteredConversations = sortedConversations.filter(([partnerId]) => {
    const profile = userProfiles[partnerId];
    if (!searchQuery) return true;
    return profile?.username?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredGroups = groups.filter(group => {
    if (!searchQuery) return true;
    return group.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleAcceptInvite = async (invite: GroupInvite) => {
    try {
      const { error: joinError } = await supabase
        .from('group_members')
        .insert({
          user_id: currentUserId,
          group_id: invite.group_id,
          role: 'member'
        });

      if (joinError) throw joinError;

      const { error: deleteError } = await supabase
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
      const { error } = await supabase
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

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-cybergold-500/30">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-cybergold-300">Private samtaler</h2>
          <div className="flex space-x-2">
            {groupInvites.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="border-cybergold-500/30 text-cybergold-300 hover:bg-cyberdark-800 flex items-center gap-1 relative"
                onClick={() => setIsInviteDialogOpen(true)}
              >
                <Mail className="h-4 w-4" />
                <span>Invitasjoner</span>
                <Badge
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-cybergold-500 text-black"
                >
                  {groupInvites.length}
                </Badge>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="border-cybergold-500/30 text-cybergold-300 hover:bg-cyberdark-800 flex items-center gap-1"
              onClick={() => setIsGroupCreatorOpen(true)}
            >
              <Users className="h-4 w-4" />
              <span>Ny gruppe</span>
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyberdark-400" />
          <input
            type="text"
            placeholder="Søk i samtaler..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-cyberdark-800 border border-cybergold-500/30 rounded-md text-cybergold-200 placeholder:text-cybergold-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
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
          userProfiles={userProfiles}
          currentUserId={currentUserId}
          setSelectedConversation={setSelectedConversation}
          searchQuery={searchQuery}
        />
        {sortedConversations.length === 0 && groups.length === 0 && (
          <div className="text-center text-cybergold-500 py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-cybergold-400/50" />
            <p className="text-lg font-medium">Ingen samtaler ennå</p>
            <p className="text-sm mt-1">Gå til Venner-fanen for å starte en ny chat</p>
          </div>
        )}
      </div>

      <GroupChatCreator
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
