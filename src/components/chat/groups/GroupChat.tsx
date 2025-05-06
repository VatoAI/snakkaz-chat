import { Group, GroupMember } from "@/types/groups";
import { DecryptedMessage } from "@/types/message";
import { WebRTCManager } from "@/utils/webrtc";
import { GroupChatHeader } from "./GroupChatHeader";
import { GroupChatEmptyState } from "./GroupChatEmptyState";
import { DirectMessageList } from "../friends/DirectMessageList";
import { DirectMessageForm } from "../friends/DirectMessageForm";
import { useGroupChat } from "./hooks/useGroupChat";
import { ChatGlassPanel } from "../ChatGlassPanel";
import { useState, useMemo, useEffect } from "react";
import { GroupInviteButton } from "./GroupInviteButton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useGroupEncryption } from "./hooks/useGroupEncryption";
import { Button } from "@/components/ui/button";
import { Shield, Lock, AlertTriangle, Crown, Star, ArrowRight, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { PremiumMembershipCard } from "./PremiumMembershipCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupMembersList } from "./GroupMembersList";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Badge } from "@/components/ui/badge";

interface GroupChatHeaderProps {
  group: Group;
  connectionState: string;
  dataChannelState: string;
  usingServerFallback: boolean;
  connectionAttempts: number;
  onBack: () => void;
  onReconnect: () => void;
  securityLevel: string;
  setSecurityLevel: (level: string) => void;
  userProfiles?: Record<string, any>;
  isAdmin: boolean;
  isPremium: boolean;
  isPremiumMember: boolean;
  onShowInvite: () => void;
  onShowPremium: () => void;
  onShowMembers: () => void;
  isPageEncryptionEnabled: boolean;
  onEnablePageEncryption: () => void;
  onEncryptAllMessages: () => void;
  encryptionStatus: string;
  isMobile?: boolean; // Make isMobile optional
}

interface GroupChatEmptyStateProps {
  groupName?: string; // Make groupName optional
  connectionState: string;
  securityLevel: string;
  isAdmin: boolean;
  isPremium: boolean;
  isPremiumMember: boolean;
  memberCount: number;
  onShowInvite: () => void;
  onShowPremium: () => void;
  isPageEncryptionEnabled: boolean;
  onEnablePageEncryption?: () => void;
}

interface DirectMessageListProps {
  messages: DecryptedMessage[];
  currentUserId: string;
  peerIsTyping: boolean;
  isMessageRead: (messageId: string) => boolean;
  connectionState: string;
  dataChannelState: string;
  usingServerFallback: boolean;
  onEditMessage: (message: DecryptedMessage) => void;
  onDeleteMessage: (messageId: string) => void;
  securityLevel: string;
  isPageEncrypted: boolean;
  isPremiumMember: boolean;
  isMobile?: boolean; // Make isMobile optional
}

interface GroupInviteButtonProps {
  isOpen: boolean;
  onClose: () => void;
  userProfiles: Record<string, any>;
  friendsList: string[];
  currentUserId: string;
  onInvite: (userId: string) => Promise<void>;
  groupMembers: string[];
  isMobile?: boolean; // Make isMobile optional
}

interface PremiumMembershipCardProps {
  group: Group;
  currentUserId: string;
  currentMembership: GroupMember | undefined;
  onUpgradeComplete: () => void;
  isMobile?: boolean; // Make isMobile optional
}

interface GroupMembersListProps {
  members: GroupMember[];
  currentUserId: string;
  userProfiles: Record<string, any>;
  isAdmin: boolean;
  groupId: string;
  onMemberUpdated?: () => void; // Make onMemberUpdated optional
  isMobile?: boolean; // Make isMobile optional
}

interface GroupChatProps {
  group: Group;
  currentUserId: string;
  webRTCManager: WebRTCManager | null;
  onBack: () => void;
  messages: DecryptedMessage[];
  onNewMessage: (message: DecryptedMessage) => void;
  userProfiles?: Record<string, { username: string | null; avatar_url: string | null; status?: string }>;
}

export const GroupChat: React.FC<GroupChatProps> = ({
  group,
  currentUserId,
  webRTCManager,
  onBack,
  messages,
  onNewMessage,
  userProfiles = {},
}: GroupChatProps) => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const groupMessages = messages.filter((msg) => msg.group_id === group.id);

  const currentMembership = useMemo(() => {
    return group.members?.find((member) => member.user_id === currentUserId);
  }, [group.members, currentUserId]);

  const isPremiumMember = currentMembership?.role === "premium";
  const isPremiumGroup = group.is_premium === true;

  const {
    isEncryptionEnabled,
    encryptionStatus,
    isProcessing,
    enableEncryption,
    encryptGroupMessages,
    decryptGroupMessages,
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
    handleDeleteMessage,
  } = useGroupChat(group, currentUserId, webRTCManager, onNewMessage, groupMessages);

  const isSecureConnection =
    (securityLevel === "p2p_e2ee" && connectionState === "connected" && dataChannelState === "open") ||
    securityLevel === "server_e2ee" ||
    securityLevel === "standard";

  const isAdmin =
    group.creator_id === currentUserId ||
    group.members?.some((member) => member.user_id === currentUserId && member.role === "admin");

  useEffect(() => {
    if (isMobile) {
      if (showMembersDialog) setShowMembersDialog(false);
      if (showInviteDialog) setShowInviteDialog(false);
    }
  }, [isMobile, showMembersDialog, showInviteDialog]);

  // Fix the handleFormSubmit function
  const handleFormSubmit = (text: string, files?: File[]) => {
    if (isMobile && files && files.length > 0) {
      toast({
        title: "Laster opp filer",
        description: `Sender ${files.length} ${files.length === 1 ? "fil" : "filer"}`,
        duration: 3000,
      });
    }

    handleSendMessage(text, files);
  };

  const handleInviteUser = async (userId: string) => {
    try {
      const isMember = group.members?.some((member) => member.user_id === userId);
      if (isMember) {
        toast({
          title: "Brukeren er allerede medlem",
          description: "Denne brukeren er allerede med i gruppen",
          variant: "destructive",
        });
        return;
      }

      const { data: existingInvite, error: checkError } = await supabase
        .from("group_invites")
        .select("id")
        .eq("group_id", group.id)
        .eq("invited_user_id", userId)
        .single();

      if (!checkError && existingInvite) {
        toast({
          title: "Invitasjon finnes allerede",
          description: "Denne brukeren har allerede fått en invitasjon til gruppen",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("group_invites").insert({
        group_id: group.id,
        invited_by: currentUserId,
        invited_user_id: userId,
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
    toast({
      title: "Medlemsliste oppdatert",
      description: "Medlemslisten er nå oppdatert",
    });
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatGlassPanel className="rounded-b-none shadow-neon-gold/10" noPadding>
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
            isMobile={isMobile}
          />

          {isPremiumGroup && (
            <div
              className={`flex items-center justify-center ${
                isMobile ? "px-2 py-1" : "px-3 py-1.5"
              } bg-gradient-to-r from-cybergold-900 to-cybergold-800 border-b border-cybergold-500/30`}
            >
              <Star className="h-4 w-4 mr-1.5 text-cybergold-400" />
              <span className="text-cybergold-300 text-sm font-medium">Premium Gruppe</span>
              {!isPremiumMember && (
                <Button
                  variant="link"
                  onClick={() => setShowPremiumDialog(true)}
                  className="ml-2 text-cybergold-400 text-xs p-0 h-auto"
                >
                  Oppgrader {isMobile ? "" : "medlemskap"}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              )}
            </div>
          )}

          <div
            className={`flex items-center overflow-x-auto ${
              isMobile ? "px-2 py-1" : "px-3 py-1.5"
            } bg-cyberdark-800/70 border-b border-cyberdark-700`}
          >
            <Users className="h-4 w-4 mr-1.5 text-cybergold-500/70" />
            <span className="text-cybergold-500/70 text-xs font-medium mr-2">Aktive:</span>
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-cybergold-600/20">
              {group.members
                ?.filter((member) => userProfiles[member.user_id]?.status === "online")
                .slice(0, isMobile ? 3 : 5)
                .map((member) => (
                  <Badge
                    key={member.user_id}
                    variant="outline"
                    className="bg-cybergold-900/30 text-cybergold-400 border-cybergold-700 text-xs px-1.5 py-0 h-5"
                  >
                    {userProfiles[member.user_id]?.username || "Bruker"}
                  </Badge>
                ))}
              {group.members &&
                group.members.filter((member) => userProfiles[member.user_id]?.status === "online").length >
                  (isMobile ? 3 : 5) && (
                  <Badge
                    variant="outline"
                    className="bg-cybergold-900/30 text-cybergold-400 border-cybergold-700 text-xs px-1.5 py-0 h-5 cursor-pointer"
                    onClick={() => setShowMembersDialog(true)}
                  >
                    +
                    {group.members.filter((member) => userProfiles[member.user_id]?.status === "online").length -
                      (isMobile ? 3 : 5)}{" "}
                    flere
                  </Badge>
                )}
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowMembersDialog(true)}
              className="ml-auto text-cybergold-500/70 p-0 h-auto"
              size="sm"
            >
              <Users className="h-4 w-4" />
              <span className={`${isMobile ? "sr-only" : "ml-1 text-xs"}`}>Vis alle</span>
            </Button>
          </div>

          {groupMessages.length === 0 ? (
            <GroupChatEmptyState
              groupName={group.name}
              connectionState={connectionState}
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
              isMobile={isMobile}
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
            maxFileSize={isPremiumMember ? 1024 * 1024 * 1024 : 50 * 1024 * 1024}
            isMobile={isMobile}
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
        groupMembers={group.members?.map((member) => member.user_id) || []}
        isMobile={isMobile}
      />

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
              toast({
                title: "Medlemskap oppgradert",
                description: "Du er nå premium-medlem i denne gruppen",
                variant: "default", // Changed from "success" to "default"
              });
            }}
            isMobile={isMobile}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
        <DialogContent
          className={`bg-cyberdark-900 border-cybergold-500/30 text-cybergold-200 ${
            isMobile ? "max-w-[95%] p-4" : "max-w-md"
          }`}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-cybergold-400" />
              Gruppemedlemmer
            </DialogTitle>
            <DialogDescription className="text-cybergold-500/70">
              {group.members?.length || 0} medlemmer i denne gruppen
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full bg-cyberdark-800">
              <TabsTrigger
                value="all"
                className="flex-1 data-[state=active]:bg-cybergold-900/30 data-[state=active]:text-cybergold-300"
              >
                Alle ({group.members?.length || 0})
              </TabsTrigger>
              <TabsTrigger
                value="online"
                className="flex-1 data-[state=active]:bg-cybergold-900/30 data-[state=active]:text-cybergold-300"
              >
                Online ({group.members?.filter((member) => userProfiles[member.user_id]?.status === "online").length || 0})
              </TabsTrigger>
              <TabsTrigger
                value="admins"
                className="flex-1 data-[state=active]:bg-cybergold-900/30 data-[state=active]:text-cybergold-300"
              >
                Admins ({group.members?.filter((member) => member.role === "admin").length || 0})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-2">
              <GroupMembersList
                members={group.members || []}
                currentUserId={currentUserId}
                userProfiles={userProfiles}
                isAdmin={isAdmin}
                groupId={group.id}
                onMemberUpdated={() => {
                  toast({
                    title: "Medlemsstatus oppdatert",
                    description: "Endringene har blitt lagret",
                    variant: "default", // Changed from "success" to "default"
                  });
                }}
                isMobile={isMobile}
              />
            </TabsContent>
            <TabsContent value="online" className="mt-2">
              <GroupMembersList
                members={(group.members || []).filter((member) => userProfiles[member.user_id]?.status === "online")}
                currentUserId={currentUserId}
                userProfiles={userProfiles}
                isAdmin={isAdmin}
                groupId={group.id}
                onMemberUpdated={() => {
                  toast({
                    title: "Medlemsstatus oppdatert",
                    description: "Endringene har blitt lagret",
                    variant: "default", // Changed from "success" to "default"
                  });
                }}
                isMobile={isMobile}
              />
            </TabsContent>
            <TabsContent value="admins" className="mt-2">
              <GroupMembersList
                members={(group.members || []).filter((member) => member.role === "admin")}
                currentUserId={currentUserId}
                userProfiles={userProfiles}
                isAdmin={isAdmin}
                groupId={group.id}
                onMemberUpdated={() => {
                  toast({
                    title: "Medlemsstatus oppdatert",
                    description: "Endringene har blitt lagret",
                    variant: "default", // Changed from "success" to "default"
                  });
                }}
                isMobile={isMobile}
              />
            </TabsContent>
          </Tabs>

          {isAdmin && (
            <DialogFooter>
              <Button
                onClick={() => setShowInviteDialog(true)}
                className="w-full bg-cybergold-900/50 text-cybergold-300 hover:bg-cybergold-800/60 border border-cybergold-700"
              >
                Inviter nye medlemmer
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
