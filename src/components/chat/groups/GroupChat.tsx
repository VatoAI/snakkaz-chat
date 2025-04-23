
import { Group } from "@/types/group";
import { DecryptedMessage } from "@/types/message";
import { WebRTCManager } from "@/utils/webrtc";
import { GroupChatHeader } from "./GroupChatHeader";
import { GroupChatEmptyState } from "./GroupChatEmptyState";
import { DirectMessageList } from "../friends/DirectMessageList";
import { DirectMessageForm } from "../friends/DirectMessageForm";
import { useGroupChat } from "./hooks/useGroupChat";
import { ChatGlassPanel } from "../ChatGlassPanel";
import { useState } from "react";
import { GroupInviteButton } from "./GroupInviteButton";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GroupChatProps {
  group: Group;
  currentUserId: string;
  webRTCManager: WebRTCManager | null;
  onBack: () => void;
  messages: DecryptedMessage[];
  onNewMessage: (message: DecryptedMessage) => void;
  userProfiles?: Record<string, {username: string | null, avatar_url: string | null}>;
}

export const GroupChat = ({ 
  group, 
  currentUserId,
  webRTCManager,
  onBack,
  messages,
  onNewMessage,
  userProfiles = {}
}: GroupChatProps) => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { toast } = useToast();

  const groupMessages = messages.filter(msg => 
    msg.group_id === group.id
  );

  const {
    newMessage,
    setNewMessage,
    isLoading,
    securityLevel,
    setSecurityLevel,
    connectionState,
    dataChannelState,
    usingServerFallback,
    connectionAttempts,
    sendError,
    handleSendMessage,
    handleReconnect,
    peerIsTyping,
    isMessageRead,
    editingMessage,
    handleStartEditMessage,
    handleCancelEditMessage,
    handleDeleteMessage
  } = useGroupChat(group, currentUserId, webRTCManager, onNewMessage, groupMessages);

  const isSecureConnection = (securityLevel === 'p2p_e2ee' && connectionState === 'connected' && dataChannelState === 'open') || 
                            securityLevel === 'server_e2ee' || 
                            securityLevel === 'standard';
                            
  const isAdmin = group.creator_id === currentUserId || 
                 group.members.some(member => member.user_id === currentUserId && member.role === 'admin');

  const handleFormSubmit = (e: React.FormEvent, text: string) => {
    handleSendMessage(e);
    return Promise.resolve(true);
  };
  
  const handleInviteUser = async (userId: string) => {
    try {
      // Check if user is already a member
      const isMember = group.members.some(member => member.user_id === userId);
      if (isMember) {
        toast({
          title: "Brukeren er allerede medlem",
          description: "Denne brukeren er allerede med i gruppen",
          variant: "destructive",
        });
        return;
      }
      
      // Check if invite already exists
      const { data: existingInvite, error: checkError } = await supabase
        .from('group_invites')
        .select('id')
        .eq('group_id', group.id)
        .eq('invited_user_id', userId)
        .single();
        
      if (!checkError && existingInvite) {
        toast({
          title: "Invitasjon finnes allerede",
          description: "Denne brukeren har allerede fått en invitasjon til gruppen",
          variant: "destructive",
        });
        return;
      }
      
      // Create the invite
      const { error } = await supabase
        .from('group_invites')
        .insert({
          group_id: group.id,
          invited_by: currentUserId,
          invited_user_id: userId
        });
        
      if (error) throw error;
      
      toast({
        title: "Invitasjon sendt",
        description: "Brukeren har blitt invitert til gruppen",
      });
    } catch (error) {
      console.error("Error inviting user:", error);
      toast({
        title: "Kunne ikke invitere bruker",
        description: "En feil oppstod. Prøv igjen senere.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-cyberdark-950">
      <GroupChatHeader 
        group={group}
        connectionState={connectionState}
        dataChannelState={dataChannelState}
        usingServerFallback={usingServerFallback}
        connectionAttempts={connectionAttempts}
        onBack={onBack}
        onReconnect={handleReconnect}
        securityLevel={securityLevel}
        setSecurityLevel={setSecurityLevel}
        userProfiles={userProfiles}
        isAdmin={isAdmin}
        onShowInvite={() => setShowInviteDialog(true)}
      />
      <div className="flex-1 flex flex-col min-h-0">
        <ChatGlassPanel className="flex-1 flex flex-col min-h-0">
          {groupMessages.length === 0 && isSecureConnection ? (
            <GroupChatEmptyState 
              usingServerFallback={usingServerFallback} 
              securityLevel={securityLevel}
              isAdmin={isAdmin}
              memberCount={group.members.length}
              onShowInvite={() => setShowInviteDialog(true)}
            />
          ) : (
            <DirectMessageList 
              messages={groupMessages} 
              currentUserId={currentUserId}
              peerIsTyping={peerIsTyping}
              isMessageRead={isMessageRead}
              connectionState={connectionState}
              dataChannelState={dataChannelState}
              usingServerFallback={usingServerFallback}
              onEditMessage={handleStartEditMessage}
              onDeleteMessage={handleDeleteMessage}
              securityLevel={securityLevel}
            />
          )}
        </ChatGlassPanel>
      </div>
      <div className="w-full">
        <ChatGlassPanel className="rounded-b-2xl rounded-t-none shadow-neon-gold/10" noPadding>
          <DirectMessageForm 
            usingServerFallback={usingServerFallback}
            sendError={sendError}
            isLoading={isLoading}
            onSendMessage={handleFormSubmit}
            newMessage={newMessage}
            onChangeMessage={setNewMessage}
            connectionState={connectionState}
            dataChannelState={dataChannelState}
            editingMessage={editingMessage}
            onCancelEdit={handleCancelEditMessage}
            securityLevel={securityLevel}
          />
        </ChatGlassPanel>
      </div>
      
      <GroupInviteButton
        isOpen={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
        userProfiles={userProfiles}
        friendsList={Object.keys(userProfiles)}
        currentUserId={currentUserId}
        onInvite={handleInviteUser}
        groupMembers={group.members.map(member => member.user_id)}
      />
    </div>
  );
};
