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
import { useGroupEncryption } from "./hooks/useGroupEncryption";
import { Button } from "@/components/ui/button";
import { Shield, Lock, AlertTriangle } from "lucide-react";

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
    isEncryptionEnabled,
    encryptionStatus,
    isProcessing,
    enableEncryption,
    encryptGroupMessages,
    decryptGroupMessages
  } = useGroupEncryption(group, currentUserId, groupMessages);

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
      const isMember = group.members.some(member => member.user_id === userId);
      if (isMember) {
        toast({
          title: "Brukeren er allerede medlem",
          description: "Denne brukeren er allerede med i gruppen",
          variant: "destructive",
        });
        return;
      }
      
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
  
  const handleEnablePageEncryption = async () => {
    if (!isAdmin) {
      toast({
        title: "Manglende tillatelse",
        description: "Bare administratorer kan aktivere helside-kryptering",
        variant: "destructive",
      });
      return;
    }
    
    await enableEncryption();
  };
  
  const handleEncryptAllMessages = async () => {
    if (!isEncryptionEnabled) {
      toast({
        title: "Kryptering ikke aktivert",
        description: "Aktiver helside-kryptering først",
        variant: "destructive",
      });
      return;
    }
    
    await encryptGroupMessages();
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
        isPageEncryptionEnabled={isEncryptionEnabled}
        onEnablePageEncryption={handleEnablePageEncryption}
        onEncryptAllMessages={handleEncryptAllMessages}
        encryptionStatus={encryptionStatus}
      />
      
      {isEncryptionEnabled && (
        <div className="px-4 py-2 bg-cyberdark-900 border-b border-cybergold-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-cybergold-500" />
            <span className="text-sm text-cybergold-300">Gruppesamtalen er beskyttet med helside-kryptering</span>
          </div>
          {isAdmin && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEncryptAllMessages}
              disabled={isProcessing || encryptionStatus !== 'idle'}
              className="h-7 text-xs bg-cyberdark-800 border-cybergold-500/30 hover:bg-cyberdark-700"
            >
              <Lock className="h-3 w-3 mr-1" />
              Krypter alle meldinger
            </Button>
          )}
        </div>
      )}
      
      {encryptionStatus !== 'idle' && (
        <div className="px-4 py-2 bg-cyberyellow-800/20 border-b border-cyberyellow-500/30 flex items-center">
          <AlertTriangle className="h-4 w-4 text-cyberyellow-500 mr-2" />
          <span className="text-sm text-cyberyellow-300">
            {encryptionStatus === 'encrypting' ? 'Krypterer meldinger...' : 'Dekrypterer meldinger...'}
          </span>
        </div>
      )}
      
      <div className="flex-1 flex flex-col min-h-0">
        <ChatGlassPanel className="flex-1 flex flex-col min-h-0">
          {groupMessages.length === 0 && isSecureConnection ? (
            <GroupChatEmptyState 
              usingServerFallback={usingServerFallback} 
              securityLevel={securityLevel}
              isAdmin={isAdmin}
              memberCount={group.members.length}
              onShowInvite={() => setShowInviteDialog(true)}
              isPageEncryptionEnabled={isEncryptionEnabled}
              onEnablePageEncryption={isAdmin ? handleEnablePageEncryption : undefined}
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
              isPageEncrypted={isEncryptionEnabled}
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
            isPageEncrypted={isEncryptionEnabled}
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
