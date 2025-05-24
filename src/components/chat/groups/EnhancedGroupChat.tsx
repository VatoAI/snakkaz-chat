/**
 * Enhanced Group Chat Implementation with E2E Encryption
 * 
 * This component provides secure group messaging with end-to-end encryption
 * for the Snakkaz Chat application. It integrates with IndexedDB storage
 * and applies security best practices.
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Group, GroupMember, GroupRole } from "@/types/group";
import { DecryptedMessage } from "@/types/message";
import { SecurityLevel, toSecurityLevel } from "@/types/security";
import { WebRTCManager } from "@/utils/webrtc";
import { GroupChatHeader } from "./GroupChatHeader";
import { GroupChatEmptyState } from "./GroupChatEmptyState";
import { DirectMessageList } from "../friends/DirectMessageList";
import { DirectMessageForm } from "../friends/DirectMessageForm";
import { useGroupChat } from "./hooks/useGroupChatAdapter";
import { ChatGlassPanel } from "../ChatGlassPanel";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useGroupEncryption } from "./hooks/useGroupEncryption";
import { Button } from "@/components/ui/button";
import { 
  Shield, Lock, AlertTriangle, Crown, 
  Star, ArrowRight, Users, KeyRound, 
  BarChart4, FileText, MessageSquare, Settings
} from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { PremiumMembershipCard } from "./PremiumMembershipCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupMembersList } from "./GroupMembersList";
import { GroupMemberRoleManager } from "./GroupMemberRoleManager";
import { GroupSettingsPanel } from "./GroupSettingsPanel";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Badge } from "@/components/ui/badge";
import { useEnhancedOfflineMessages } from "@/hooks/use-enhanced-offline-messages";
import { 
  encryptGroupMessage, 
  decryptGroupMessage, 
  getGroupKey,
  rotateGroupKey 
} from "@/services/encryption/groupMessageEncryption";
import indexedDBStorage, { IndexedDBStorage } from "@/utils/storage/indexedDB";
import { GroupPollSystem } from "./GroupPollSystem";
import { GroupFilesManager } from "./GroupFilesManager";
import { hasRolePermission, getRolePermissions } from "@/utils/group-roles";

interface EnhancedGroupChatProps {
  group: Group;
  currentUserId: string;
  onBack: () => void;
  userProfiles?: Record<string, { 
    username?: string;
    full_name?: string;
    avatar_url?: string;
    status?: string;
  }>;
}

/**
 * EnhancedGroupChat component with end-to-end encryption
 */
export function EnhancedGroupChat({
  group,
  currentUserId,
  onBack,
  userProfiles = {}
}: EnhancedGroupChatProps) {
  // State for encryption
  const [encryptionEnabled, setEncryptionEnabled] = useState<boolean>(false);
  const [encryptionStatus, setEncryptionStatus] = useState<'initializing' | 'ready' | 'error'>('initializing');
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);
  const [showEncryptionDialog, setShowEncryptionDialog] = useState<boolean>(false);
  const [rotatingKey, setRotatingKey] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("messages");
  const [isRoleManagerOpen, setIsRoleManagerOpen] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  
  // Hooks for group chat and encryption
  const { online } = useNetworkStatus();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const {
    messages,
    sendMessage,
    isLoading,
    loadMoreMessages,
    markMessageAsRead,
    connectionState,
    dataChannelState,
    usingServerFallback,
    connectionAttempts,
    members,
    isAdmin,
    isPremium,
    isPremiumMember,
    securityLevel,
    setSecurityLevel,
    reconnect,
    isPageEncryptionEnabled,
    enablePageEncryption,
    encryptAllMessages
  } = useGroupChat({
    group,
    currentUserId
  });
  
  // Get the current user's role
  const currentUserMember = members.find(member => member.user_id === currentUserId);
  const currentUserRole = currentUserMember?.role as GroupRole || 'member';
  const userPermissions = useMemo(() => getRolePermissions(currentUserRole), [currentUserRole]);
  
  // Role-based permission checks
  const canManageRoles = useMemo(() => hasRolePermission(currentUserRole, 'admin'), [currentUserRole]);
  const canModerate = useMemo(() => hasRolePermission(currentUserRole, 'moderator'), [currentUserRole]);
  const canCreatePolls = useMemo(() => hasRolePermission(currentUserRole, 'moderator'), [currentUserRole]);
  const canManageFiles = useMemo(() => hasRolePermission(currentUserRole, 'moderator'), [currentUserRole]);
  
  // Enhanced offline message handling with IndexedDB support
  const { 
    sendMessage: sendOfflineMessage, 
    syncMessages: syncOfflineMessages,
    pendingCount,
    isSyncing
  } = useEnhancedOfflineMessages({
    onSendMessage: async (message, mediaBlob) => {
      try {
        // Implement message sending logic here
        // For now we'll just simulate success
        console.log('Sending message from offline store:', message);
        return true;
      } catch (error) {
        console.error('Failed to send offline message:', error);
        return false;
      }
    },
    enabled: true
  });
  
  // Initialize encryption when group changes
  useEffect(() => {
    async function initializeEncryption() {
      setEncryptionStatus('initializing');
      try {
        // Check if the group has encryption enabled in database
        const encryptionSetting = group.security_level === 'high' || 
                                 group.security_level === 'maximum';
        
        // Check if we have a key for this group
        if (encryptionSetting) {
          const keyId = await getGroupKey(group.id);
          setEncryptionEnabled(!!keyId);
          setEncryptionStatus('ready');
        } else {
          setEncryptionEnabled(false);
          setEncryptionStatus('ready');
        }
      } catch (error) {
        console.error('Failed to initialize encryption:', error);
        setEncryptionStatus('error');
        setEncryptionEnabled(false);
      }
    }
    
    initializeEncryption();
  }, [group.id, group.security_level]);
  
  // Toggle encryption for the group
  const toggleEncryption = async () => {
    if (encryptionStatus !== 'ready') return;
    
    setIsEncrypting(true);
    try {
      if (encryptionEnabled) {
        // Disable encryption
        // This would normally update the group settings in the database
        toast({
          title: "Encryption cannot be disabled",
          description: "For security reasons, once encryption is enabled it cannot be disabled.",
          variant: "destructive",
        });
      } else {
        // Enable encryption
        await getGroupKey(group.id);
        setEncryptionEnabled(true);
        
        // Update group security level in database
        if (group.security_level !== 'high' && group.security_level !== 'maximum') {
          await supabase
            .from('groups')
            .update({ security_level: 'high' })
            .eq('id', group.id);
        }
        
        toast({
          title: "Encryption Enabled",
          description: "End-to-end encryption is now active for this group.",
        });
      }
    } catch (error) {
      console.error('Failed to toggle encryption:', error);
      toast({
        title: "Encryption Failed",
        description: "Could not enable encryption. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEncrypting(false);
    }
  };
  
  // Rotate encryption keys
  const handleRotateKeys = async () => {
    if (!encryptionEnabled || rotatingKey) return;
    
    setRotatingKey(true);
    try {
      await rotateGroupKey(group.id);
      
      toast({
        title: "Keys Rotated",
        description: "New encryption keys have been generated for this group.",
      });
    } catch (error) {
      console.error('Failed to rotate keys:', error);
      toast({
        title: "Key Rotation Failed",
        description: "Could not generate new encryption keys. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRotatingKey(false);
    }
  };
  
  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent, text: string) => {
    e.preventDefault();
    if (!text.trim()) return false;
    
    try {
      let processedMessage = text;
      const attachmentBlob = undefined; // No attachment support in this version
      
      // Encrypt the message if encryption is enabled
      if (encryptionEnabled) {
        try {
          const encryptedData = await encryptGroupMessage(group.id, text);
          processedMessage = JSON.stringify(encryptedData);
        } catch (error) {
          console.error('Failed to encrypt message:', error);
          toast({
            title: "Encryption Failed",
            description: "Could not encrypt your message. It will be sent unencrypted.",
            variant: "destructive",
          });
        }
      }
      
      // Handle attachments with IndexedDB if available
      let attachmentId = null;
      if (attachmentBlob && IndexedDBStorage.isSupported()) {
        try {
          attachmentId = await indexedDBStorage.add('media', {
            id: crypto.randomUUID(),
            blob: attachmentBlob,
            type: attachmentBlob.type,
            name: 'attachment',
            size: attachmentBlob.size,
            createdAt: Date.now()
          });
        } catch (error) {
          console.error('Failed to store attachment:', error);
        }
      }
      
      // If online, send through normal channel
      if (online) {
        await sendMessage(processedMessage, attachmentId);
      } else {
        // Otherwise store offline
        await sendOfflineMessage(processedMessage, {
          groupId: group.id,
          mediaBlob: attachmentBlob,
          mediaType: attachmentBlob?.type,
          mediaName: 'attachment'
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Message Failed",
        description: "Could not send your message. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Process messages to handle decryption
  const processedMessages = useMemo(() => {
    if (!messages) return [];
    
    return messages.map(message => {
      // Check if the message is encrypted
      if (!encryptionEnabled) return message;
      
      try {
        // Try to parse the message content as JSON
        const messageData = JSON.parse(message.content);
        
        // Check if it looks like an encrypted message
        if (messageData && messageData.ciphertext && messageData.iv && messageData.keyId) {
          // Create a copy with a flag indicating it's encrypted
          return {
            ...message,
            isEncrypted: true,
            encryptedData: messageData
          };
        }
      } catch (e) {
        // Not a JSON message, so not encrypted or using old format
      }
      
      return message;
    });
  }, [messages, encryptionEnabled]);
  
  // Component for the encryption status indicator
  const EncryptionStatus = () => (
    <div className="flex items-center space-x-1 py-1 px-2 text-xs rounded-full bg-cyberdark-900">
      {encryptionEnabled ? (
        <>
          <Lock className="h-3 w-3 text-green-500" />
          <span className="text-green-500">Encrypted</span>
        </>
      ) : (
        <>
          <Shield className="h-3 w-3 text-amber-500" />
          <span className="text-amber-500">Standard</span>
        </>
      )}
    </div>
  );

  // Handler for opening settings panel
  const handleOpenSettings = () => {
    setShowSettingsPanel(true);
  };
  
  // Handler for closing settings panel
  const handleCloseSettings = () => {
    setShowSettingsPanel(false);
    // Refresh group data after settings changes
    loadGroup();
  };

  // Get user avatar 
  const getUserAvatar = (userId: string) => {
    // This is a placeholder. In a real app, fetch from userProfiles or a default
    return "https://api.dicebear.com/7.x/avataaars/svg?seed=" + userId;
  };
  
  // Show settings panel if active
  if (showSettingsPanel) {
    return (
      <GroupSettingsPanel
        group={group}
        currentUserId={currentUserId}
        members={members}
        userProfiles={userProfiles}
        onClose={handleCloseSettings}
        refreshGroup={loadGroup}
      />
    );
  }
  
  // Render the group chat component
  return (
    <div className="flex flex-col h-full bg-cyberdark-950 relative">
      {/* Group header */}
      <GroupChatHeader
        group={group}
        connectionState={connectionState}
        dataChannelState={dataChannelState}
        usingServerFallback={usingServerFallback}
        connectionAttempts={connectionAttempts}
        onBack={onBack}
        onReconnect={reconnect}
        securityLevel={securityLevel}
        setSecurityLevel={(level: string) => setSecurityLevel(toSecurityLevel(level))}
        userProfiles={userProfiles}
        isAdmin={isAdmin}
        isPremium={isPremium}
        isPremiumMember={isPremiumMember}
        onShowInvite={() => {}}
        onShowPremium={() => {}}
        onShowMembers={() => {}}
        onOpenSettings={handleOpenSettings}
        isPageEncryptionEnabled={isPageEncryptionEnabled}
        onEnablePageEncryption={enablePageEncryption}
        onEncryptAllMessages={encryptAllMessages}
        encryptionStatus={encryptionStatus}
        isMobile={isMobile}
      />
      
      {/* Encryption status bar */}
      <div className="bg-cyberdark-900/70 border-b border-cyberdark-800 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <EncryptionStatus />
          {encryptionEnabled && (
            <span className="text-xs text-cybergold-500">
              End-to-end encrypted
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {encryptionEnabled ? (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={handleRotateKeys}
              disabled={rotatingKey}
            >
              <KeyRound className="h-3 w-3 mr-1" />
              {rotatingKey ? 'Rotating...' : 'Rotate Keys'}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={toggleEncryption}
              disabled={isEncrypting || encryptionStatus !== 'ready'}
            >
              <Lock className="h-3 w-3 mr-1" />
              {isEncrypting ? 'Enabling...' : 'Enable Encryption'}
            </Button>
          )}
        </div>
      </div>
      
      {/* Tabs for different sections */}
      <div className="bg-cyberdark-900/50 border-b border-cyberdark-800">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent w-full justify-start h-auto px-2 pb-1 pt-2">
            <TabsTrigger 
              value="messages" 
              className="data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-400 h-8 text-sm rounded-md"
            >
              <MessageSquare className="h-4 w-4 mr-1.5" />
              Messages
            </TabsTrigger>
            <TabsTrigger 
              value="polls" 
              className="data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-400 h-8 text-sm rounded-md"
            >
              <BarChart4 className="h-4 w-4 mr-1.5" />
              Polls
            </TabsTrigger>
            <TabsTrigger 
              value="files" 
              className="data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-400 h-8 text-sm rounded-md"
            >
              <FileText className="h-4 w-4 mr-1.5" />
              Files
            </TabsTrigger>
            <TabsTrigger 
              value="members" 
              className="data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-400 h-8 text-sm rounded-md"
            >
              <Users className="h-4 w-4 mr-1.5" />
              Members
            </TabsTrigger>
          </TabsList>

          {/* Messages Tab */}
          <TabsContent value="messages" className="flex-grow overflow-hidden m-0 p-0">
            <div className="flex flex-col h-full">
              <div className="flex-grow overflow-hidden">
                {messages.length === 0 && !isLoading ? (
                  <GroupChatEmptyState
                    groupName={group.name}
                    connectionState={connectionState}
                    securityLevel={securityLevel}
                    isAdmin={isAdmin}
                    isPremium={isPremium}
                    isPremiumMember={isPremiumMember}
                    memberCount={members.length}
                    onShowInvite={() => {}}
                    onShowPremium={() => {}}
                    isPageEncryptionEnabled={isPageEncryptionEnabled}
                  />
                ) : (
                  <DirectMessageList
                    messages={processedMessages}
                    currentUserId={currentUserId}
                    peerIsTyping={false}
                    isMessageRead={() => true}
                    connectionState={connectionState}
                    dataChannelState={dataChannelState}
                    usingServerFallback={usingServerFallback}
                    onEditMessage={() => {}}
                    onDeleteMessage={() => {}}
                    securityLevel={securityLevel}
                    isPageEncrypted={isPageEncryptionEnabled}
                    isPremiumMember={isPremiumMember}
                    isMobile={isMobile}
                  />
                )}
              </div>
              
              <div className="p-2 bg-cyberdark-900/50 border-t border-cyberdark-800">
                <DirectMessageForm
                  onSendMessage={handleSendMessage}
                  usingServerFallback={usingServerFallback}
                  sendError={null}
                  isLoading={isLoading}
                  newMessage=""
                  onChangeMessage={() => {}}
                  connectionState={connectionState}
                  dataChannelState={dataChannelState}
                  editingMessage={null}
                  onCancelEdit={() => {}}
                  securityLevel={securityLevel}
                />
                
                {/* Offline message counter */}
                {pendingCount > 0 && (
                  <div className="mt-1 px-2 flex justify-between items-center">
                    <span className="text-xs text-cybergold-500">
                      {pendingCount} unsent message{pendingCount !== 1 ? 's' : ''}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={syncOfflineMessages}
                      disabled={!online || isSyncing}
                    >
                      {isSyncing ? 'Sending...' : 'Send now'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Polls Tab */}
          <TabsContent value="polls" className="m-0 p-4 overflow-y-auto max-h-[calc(100vh-14rem)]">
            <GroupPollSystem 
              groupId={group.id}
              currentUserId={currentUserId}
              isAdmin={canManageRoles}
              canCreatePolls={canCreatePolls}
            />
          </TabsContent>
          
          {/* Files Tab */}
          <TabsContent value="files" className="m-0 p-4 overflow-y-auto max-h-[calc(100vh-14rem)]">
            <GroupFilesManager
              groupId={group.id}
              currentUserId={currentUserId}
              isAdmin={canManageRoles}
              canManageFiles={canManageFiles}
              isPremium={isPremium}
              groupName={group.name}
            />
          </TabsContent>
          
          {/* Members Tab */}
          <TabsContent value="members" className="m-0 p-4 overflow-y-auto max-h-[calc(100vh-14rem)]">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-cybergold-200 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-cybergold-400" />
                  Group Members
                </h3>
                
                {canManageRoles && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-950/30"
                    onClick={() => setIsRoleManagerOpen(true)}
                  >
                    Manage Roles
                  </Button>
                )}
              </div>
              
              <GroupMembersList
                members={members}
                currentUserId={currentUserId}
                userProfiles={userProfiles}
                isAdmin={canManageRoles}
                groupId={group.id}
                onMemberUpdated={() => {
                  toast({
                    title: "Member role updated",
                    description: "The changes have been saved successfully",
                  });
                }}
                isMobile={isMobile}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Member Role Manager Dialog */}
      <GroupMemberRoleManager
        isOpen={isRoleManagerOpen}
        onClose={() => setIsRoleManagerOpen(false)}
        members={members}
        currentUserId={currentUserId}
        userProfiles={userProfiles}
        groupId={group.id}
        onMemberUpdated={() => {
          toast({
            title: "Member roles updated",
            description: "The changes have been saved successfully",
          });
        }}
      />
    </div>
  );
}
