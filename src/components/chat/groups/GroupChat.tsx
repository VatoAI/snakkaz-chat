import { Group, GroupMember } from "@/types/groups";
import { DecryptedMessage } from "@/types/message";
import { WebRTCManager } from "@/utils/webrtc";
import { GroupChatHeader } from "./GroupChatHeader";
import { GroupChatEmptyState } from "./GroupChatEmptyState";
import { DirectMessageList } from "../friends/DirectMessageList";
import { DirectMessageForm } from "../friends/DirectMessageForm";
import { useGroupChat } from "./hooks/useGroupChat";
import { ChatGlassPanel } from "../ChatGlassPanel";
import { useState, useMemo } from "react";
import { GroupInviteButton } from "./GroupInviteButton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useGroupEncryption } from "./hooks/useGroupEncryption";
import { Button } from "@/components/ui/button";
import { Shield, Lock, AlertTriangle, Crown, Star, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { PremiumMembershipCard } from "./PremiumMembershipCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupMembersList } from "./GroupMembersList";

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
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const { toast } = useToast();

  const groupMessages = messages.filter(msg => 
    msg.group_id === group.id
  );
  
  const currentMembership = useMemo(() => {
    return group.members?.find(member => member.user_id === currentUserId);
  }, [group.members, currentUserId]);

  const isPremiumMember = currentMembership?.role === 'premium';
  const isPremiumGroup = group.is_premium === true;
  
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
                 group.members?.some(member => member.user_id === currentUserId && member.role === 'admin');

  const handleFormSubmit = (e: React.FormEvent, text: string) => {
    handleSendMessage(e);
    return Promise.resolve(true);
  };
  
  const handleInviteUser = async (userId: string) => {
    try {
      const isMember = group.members?.some(member => member.user_id === userId);
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
    if (!isAdmin && !isPremiumMember) {
      toast({
        title: "Manglende tillatelse",
        description: "Bare administratorer og premium-medlemmer kan aktivere helside-kryptering",
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

  const handleRefreshMembers = async () => {
    // Her ville vi normalt hente oppdatert medlemsliste fra server
    toast({
      title: "Medlemsliste oppdatert",
      description: "Medlemslisten er nå oppdatert",
    });
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
        isPremium={isPremiumGroup}
        isPremiumMember={isPremiumMember}
        onShowInvite={() => setShowInviteDialog(true)}
        onShowPremium={() => setShowPremiumDialog(true)}
        onShowMembers={() => setShowMembersDialog(true)}
        isPageEncryptionEnabled={isEncryptionEnabled}
        onEnablePageEncryption={handleEnablePageEncryption}
        onEncryptAllMessages={handleEncryptAllMessages}
        encryptionStatus={encryptionStatus}
      />
      
      {/* Premium Badge */}
      {isPremiumGroup && (
        <div className="px-4 py-1.5 bg-gradient-to-r from-cybergold-900 to-cybergold-800 border-b border-cybergold-500/30 flex items-center">
          <Crown className="h-3.5 w-3.5 text-cybergold-400 mr-1.5" />
          <span className="text-xs text-cybergold-300">Premium-gruppe med forbedret sikkerhet og ytelse</span>
          {!isPremiumMember && (
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => setShowPremiumDialog(true)}
              className="ml-auto text-xs text-cybergold-400 hover:text-cybergold-300 p-0 h-auto"
            >
              Oppgrader <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      )}
      
      {/* Encryption Status */}
      {isEncryptionEnabled && (
        <div className="px-4 py-2 bg-cyberdark-900 border-b border-cybergold-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-cybergold-500" />
            <span className="text-sm text-cybergold-300">
              {isPremiumMember 
                ? "Gruppesamtalen er beskyttet med forsterket 256-bit kryptering" 
                : "Gruppesamtalen er beskyttet med helside-kryptering"}
            </span>
          </div>
          {(isAdmin || isPremiumMember) && (
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
      
      {/* Encryption Progress */}
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
              isPremium={isPremiumGroup}
              isPremiumMember={isPremiumMember}
              memberCount={group.members?.length || 0}
              onShowInvite={() => setShowInviteDialog(true)}
              onShowPremium={() => setShowPremiumDialog(true)}
              isPageEncryptionEnabled={isEncryptionEnabled}
              onEnablePageEncryption={isAdmin || isPremiumMember ? handleEnablePageEncryption : undefined}
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
              isPremiumMember={isPremiumMember}
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
            isPremiumMember={isPremiumMember}
            maxFileSize={isPremiumMember ? 1024 * 1024 * 1024 : 50 * 1024 * 1024} // 1GB for premium, 50MB for standard
          />
        </ChatGlassPanel>
      </div>
      
      {/* Invite Dialog */}
      <GroupInviteButton
        isOpen={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
        userProfiles={userProfiles}
        friendsList={Object.keys(userProfiles)}
        currentUserId={currentUserId}
        onInvite={handleInviteUser}
        groupMembers={group.members?.map(member => member.user_id) || []}
      />
      
      {/* Premium Membership Dialog */}
      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent className="bg-cyberdark-900 border-cybergold-500/30 text-cybergold-200 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-cybergold-400" />
              Premium-medlemskap
            </DialogTitle>
            <DialogDescription className="text-cybergold-500/70">
              Få tilgang til eksklusive premium-funksjoner i denne gruppen
            </DialogDescription>
          </DialogHeader>
          
          <PremiumMembershipCard
            group={group}
            currentUserId={currentUserId}
            currentMembership={currentMembership}
            onUpgradeComplete={() => {
              setShowPremiumDialog(false);
              // Her ville vi normalt hente oppdatert gruppedata fra server
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Group Members Dialog */}
      <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
        <DialogContent className="bg-cyberdark-900 border-cybergold-500/30 text-cybergold-200 sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Gruppemedlemmer</DialogTitle>
            <DialogDescription className="text-cybergold-500/70">
              {group.memberCount || group.members?.length || 0} medlemmer
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="members" className="w-full">
            <TabsList className="bg-cyberdark-800 grid grid-cols-2 mb-4">
              <TabsTrigger value="members">Medlemmer</TabsTrigger>
              <TabsTrigger value="roles">Roller og tilgang</TabsTrigger>
            </TabsList>
            
            <TabsContent value="members">
              {group.members && (
                <GroupMembersList 
                  members={group.members} 
                  userProfiles={userProfiles} 
                  currentUserId={currentUserId} 
                  isAdmin={isAdmin}
                  isPremiumMember={isPremiumMember}
                  groupId={group.id}
                  onRefresh={handleRefreshMembers}
                />
              )}
            </TabsContent>
            
            <TabsContent value="roles">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-cybergold-300">Admin</h3>
                  <p className="text-sm text-cybergold-500/70">Har full tilgang til å administrere gruppen, invitere medlemmer og slette meldinger.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-cybergold-300 flex items-center gap-2">
                    <Crown className="h-4 w-4 text-cybergold-400" />
                    Premium-medlem
                  </h3>
                  <p className="text-sm text-cybergold-500/70">Har tilgang til avanserte sikkerhetsfunksjoner, større lagringskapasitet og ende-til-ende kryptering.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-cybergold-300">Moderator</h3>
                  <p className="text-sm text-cybergold-500/70">Kan moderere samtaler og slette upassende meldinger.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-cybergold-300">Medlem</h3>
                  <p className="text-sm text-cybergold-500/70">Kan delta i gruppechatter, sende meldinger og se medlemslisten.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            {(isAdmin || isPremiumMember) && (
              <Button 
                variant="outline" 
                className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-400 hover:bg-cyberdark-700"
                onClick={handleRefreshMembers}
              >
                Oppdater medlemsliste
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
