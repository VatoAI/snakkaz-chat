/**
 * Chat Context Provider for Snakkaz Chat
 * 
 * This context provides chat functionality across the application
 * by integrating groupChatService with Supabase realtime features.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { 
  GroupChatService, 
  GroupMessage, 
  Group, 
  GroupRole,
  GroupSecurityLevel 
} from '../encryption/groupChatService';
import { MediaUploadService } from '../encryption/mediaUploadService';
import { EncryptionService } from '../encryption/encryptionService';

// Create services
const groupChatService = new GroupChatService();
const mediaUploadService = new MediaUploadService();
const encryptionService = new EncryptionService();

// Chat context interface
interface ChatContextProps {
  // Groups
  groups: Group[];
  currentGroup: Group | null;
  setCurrentGroup: (group: Group | null) => void;
  createGroup: (name: string, settings?: any) => Promise<Group>;
  leaveGroup: (groupId: string) => Promise<void>;
  
  // Messages
  messages: GroupMessage[];
  loadingMessages: boolean;
  sendMessage: (content: string, attachments?: File[]) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  
  // Media
  uploadMedia: (file: File) => Promise<{ url: string; thumbnailUrl?: string }>;
  uploadingMedia: boolean;
  uploadProgress: number;
  
  // Read receipts
  markAsRead: (messageId: string) => Promise<void>;
  getReadStatus: (messageId: string) => { 
    read: boolean; 
    readByCount: number; 
    deliveredToCount: number; 
  };
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

// Create the context
const ChatContext = createContext<ChatContextProps | undefined>(undefined);

// Provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [uploadingMedia, setUploadingMedia] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  // Get current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setCurrentUser(data.user);
      }
    };
    
    fetchUser();
    
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setCurrentUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
    });
    
    return () => {
      authListener.data.subscription.unsubscribe();
    };
  }, []);
  
  // Fetch user's groups
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchGroups = async () => {
      try {
        // Get groups from Supabase
        const { data, error } = await supabase
          .from('groups')
          .select('*')
          .or(`members.cs.{${currentUser.id}},creator_id.eq.${currentUser.id}`);
        
        if (error) throw error;
        
        // Convert to Group objects
        const userGroups: Group[] = await Promise.all(
          data.map(async (groupData: any) => {
            // Fetch group members
            const { data: membersData, error: membersError } = await supabase
              .from('group_members')
              .select('*')
              .eq('group_id', groupData.id);
              
            if (membersError) throw membersError;
            
            // Convert to Group object
            return {
              id: groupData.id,
              settings: {
                name: groupData.name,
                description: groupData.description,
                avatar: groupData.avatar_url,
                securityLevel: groupData.security_level || GroupSecurityLevel.ENHANCED,
                allowMediaSharing: true,
                allowLinkPreviews: true,
                allowMemberInvites: groupData.allow_invites || false,
                allowScreenshots: !groupData.block_screenshots,
                messageRetentionDays: groupData.message_retention_days || 30,
                isPrivate: groupData.is_private || true,
                maxMembers: groupData.max_members || 50,
                requireEncryption: groupData.security_level !== 'STANDARD'
              },
              createdAt: new Date(groupData.created_at),
              createdBy: groupData.creator_id,
              members: membersData.map((member: any) => ({
                id: member.user_id,
                role: member.role || GroupRole.MEMBER,
                joinedAt: new Date(member.joined_at),
                displayName: member.display_name
              })),
              encryptionKeys: groupData.encryption_enabled ? {
                groupKeyId: groupData.current_key_id,
                rotatedAt: new Date(groupData.key_rotated_at || groupData.created_at),
                keyVersion: groupData.key_version || 1
              } : undefined
            };
          })
        );
        
        setGroups(userGroups);
      } catch (err) {
        setError(`Failed to fetch groups: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };
    
    fetchGroups();
    
    // Subscribe to group changes
    const groupsSubscription = supabase
      .channel('groups-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'groups',
        filter: `creator_id=eq.${currentUser.id}`
      }, (payload) => {
        fetchGroups();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(groupsSubscription);
    };
  }, [currentUser]);
  
  // Fetch messages when current group changes
  useEffect(() => {
    if (!currentUser || !currentGroup) return;
    
    const fetchMessages = async () => {
      setLoadingMessages(true);
      
      try {
        // Get messages from Supabase
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('group_id', currentGroup.id)
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (error) throw error;
        
        // Convert to GroupMessage objects
        const groupMessages: GroupMessage[] = await Promise.all(
          data.map(async (msg: any) => {
            // Get sender info
            const { data: senderData } = await supabase
              .from('profiles')
              .select('username, full_name, avatar_url')
              .eq('id', msg.sender_id)
              .single();
            
            // Decrypt message if necessary
            let content = msg.content;
            if (msg.is_encrypted && msg.key_id) {
              try {
                // In a real implementation, we would fetch the key and decrypt
                // For now, just mark it as encrypted
                content = `[Encrypted: ${msg.content.substring(0, 10)}...]`;
              } catch (err) {
                console.error('Failed to decrypt message:', err);
                content = '[Encryption error]';
              }
            }
            
            return {
              id: msg.id,
              sender: {
                id: msg.sender_id,
                displayName: senderData?.full_name || senderData?.username || 'Unknown'
              },
              content,
              timestamp: new Date(msg.created_at),
              encryptionInfo: msg.is_encrypted ? {
                isEncrypted: true,
                keyId: msg.key_id,
                algorithm: 'AES-GCM'
              } : undefined,
              mediaAttachments: msg.media_attachments,
              referencedMessage: msg.reference_message_id ? {
                id: msg.reference_message_id,
                snippet: msg.reference_snippet || ''
              } : undefined,
              readBy: msg.read_by || [],
              deliveredTo: msg.delivered_to || [],
              isEdited: msg.is_edited || false,
              isDeleted: msg.is_deleted || false,
              reactions: msg.reactions || []
            };
          })
        );
        
        setMessages(groupMessages);
      } catch (err) {
        setError(`Failed to fetch messages: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoadingMessages(false);
      }
    };
    
    fetchMessages();
    
    // Subscribe to message changes
    const messagesSubscription = supabase
      .channel(`messages-${currentGroup.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages',
        filter: `group_id=eq.${currentGroup.id}`
      }, (payload) => {
        fetchMessages();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [currentUser, currentGroup]);
  
  // Create a new group
  const createGroup = async (name: string, settings?: any): Promise<Group> => {
    if (!currentUser) {
      throw new Error('You must be logged in to create a group');
    }
    
    try {
      // Create group with GroupChatService
      const group = await groupChatService.createGroup(
        name,
        { 
          id: currentUser.id, 
          displayName: currentUser.user_metadata?.full_name || currentUser.email
        },
        settings
      );
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('groups')
        .insert({
          id: group.id,
          name: group.settings.name,
          description: group.settings.description,
          creator_id: currentUser.id,
          security_level: group.settings.securityLevel,
          is_private: group.settings.isPrivate,
          allow_invites: group.settings.allowMemberInvites,
          block_screenshots: !group.settings.allowScreenshots,
          message_retention_days: group.settings.messageRetentionDays,
          max_members: group.settings.maxMembers,
          encryption_enabled: !!group.encryptionKeys,
          current_key_id: group.encryptionKeys?.groupKeyId,
          key_rotated_at: group.encryptionKeys?.rotatedAt,
          key_version: group.encryptionKeys?.keyVersion
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add current user as member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: currentUser.id,
          role: GroupRole.ADMIN,
          display_name: currentUser.user_metadata?.full_name || currentUser.email
        });
      
      if (memberError) throw memberError;
      
      // Add to local state
      setGroups(prev => [...prev, group]);
      
      return group;
    } catch (err) {
      setError(`Failed to create group: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };
  
  // Leave a group
  const leaveGroup = async (groupId: string): Promise<void> => {
    if (!currentUser) {
      throw new Error('You must be logged in to leave a group');
    }
    
    try {
      // Leave group with GroupChatService
      await groupChatService.leaveGroup(groupId, currentUser.id);
      
      // Update Supabase
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', currentUser.id);
      
      if (error) throw error;
      
      // Update local state
      setGroups(prev => prev.filter(g => g.id !== groupId));
      if (currentGroup?.id === groupId) {
        setCurrentGroup(null);
      }
    } catch (err) {
      setError(`Failed to leave group: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };
  
  // Send a message
  const sendMessage = async (content: string, attachments?: File[]): Promise<void> => {
    if (!currentUser || !currentGroup) {
      throw new Error('You must be in a group to send messages');
    }
    
    try {
      // Process attachments if any
      let mediaAttachments: any[] = [];
      
      if (attachments && attachments.length > 0) {
        setUploadingMedia(true);
        
        mediaAttachments = await Promise.all(
          attachments.map(async (file, index) => {
            // Update progress
            setUploadProgress(Math.round((index / attachments.length) * 100));
            
            // Upload with MediaUploadService
            const result = await mediaUploadService.uploadMedia(file, {
              encryptMedia: currentGroup.settings.securityLevel !== GroupSecurityLevel.STANDARD
            });
            
            return {
              url: result.url,
              type: file.type,
              name: file.name,
              thumbnailUrl: result.thumbnailUrl,
              encryptionInfo: result.encrypted ? {
                isEncrypted: true,
                keyId: result.keyId
              } : undefined
            };
          })
        );
        
        setUploadingMedia(false);
        setUploadProgress(0);
      }
      
      // Send message with GroupChatService
      const message = await groupChatService.sendGroupMessage(
        currentGroup.id, 
        currentUser.id, 
        content, 
        attachments?.map(file => ({ file, type: file.type }))
      );
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('messages')
        .insert({
          id: message.id,
          group_id: currentGroup.id,
          sender_id: currentUser.id,
          content: message.content,
          is_encrypted: !!message.encryptionInfo,
          key_id: message.encryptionInfo?.keyId,
          media_attachments: mediaAttachments.length > 0 ? mediaAttachments : undefined,
          delivered_to: [currentUser.id],
          read_by: [currentUser.id]
        })
        .select();
      
      if (error) throw error;
      
      // Add to local state
      setMessages(prev => [message, ...prev]);
    } catch (err) {
      setError(`Failed to send message: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };
  
  // Delete a message
  const deleteMessage = async (messageId: string): Promise<void> => {
    if (!currentUser || !currentGroup) {
      throw new Error('You must be in a group to delete messages');
    }
    
    try {
      // Delete with GroupChatService
      await groupChatService.deleteMessage(currentGroup.id, messageId, currentUser.id);
      
      // Update Supabase
      const { error } = await supabase
        .from('messages')
        .update({
          is_deleted: true,
          content: '[Message deleted]',
          media_attachments: null
        })
        .eq('id', messageId)
        .eq('group_id', currentGroup.id);
      
      if (error) throw error;
      
      // Update local state
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            isDeleted: true,
            content: '[Message deleted]',
            mediaAttachments: undefined
          };
        }
        return msg;
      }));
    } catch (err) {
      setError(`Failed to delete message: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };
  
  // Upload media
  const uploadMedia = async (file: File): Promise<{ url: string; thumbnailUrl?: string }> => {
    if (!currentUser) {
      throw new Error('You must be logged in to upload media');
    }
    
    try {
      setUploadingMedia(true);
      setUploadProgress(0);
      
      // Upload progress tracking
      const updateProgress = (progress: number) => {
        setUploadProgress(progress);
      };
      
      // Simulated progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 200);
      
      // Upload with MediaUploadService
      const result = await mediaUploadService.uploadMedia(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploadingMedia(false);
        setUploadProgress(0);
      }, 500);
      
      return {
        url: result.url,
        thumbnailUrl: result.thumbnailUrl
      };
    } catch (err) {
      setError(`Failed to upload media: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setUploadingMedia(false);
      setUploadProgress(0);
      throw err;
    }
  };
  
  // Mark message as read
  const markAsRead = async (messageId: string): Promise<void> => {
    if (!currentUser || !currentGroup) return;
    
    try {
      // Mark as read with GroupChatService
      await groupChatService.markMessageAsRead(currentGroup.id, messageId, currentUser.id);
      
      // Update Supabase
      const { data, error } = await supabase
        .from('messages')
        .select('read_by')
        .eq('id', messageId)
        .single();
      
      if (error) throw error;
      
      // Add current user to read_by if not already there
      const readBy = data.read_by || [];
      if (!readBy.includes(currentUser.id)) {
        readBy.push(currentUser.id);
        
        const { error: updateError } = await supabase
          .from('messages')
          .update({ read_by: readBy })
          .eq('id', messageId);
        
        if (updateError) throw updateError;
        
        // Update local state
        setMessages(prev => prev.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              readBy
            };
          }
          return msg;
        }));
      }
    } catch (err) {
      console.error('Failed to mark message as read:', err);
      // Non-critical error, don't show to user
    }
  };
  
  // Get read status for a message
  const getReadStatus = (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    
    if (!message) {
      return { read: false, readByCount: 0, deliveredToCount: 0 };
    }
    
    return {
      read: message.readBy?.includes(currentUser?.id || '') || false,
      readByCount: message.readBy?.length || 0,
      deliveredToCount: message.deliveredTo?.length || 0
    };
  };
  
  // Clear error
  const clearError = () => {
    setError(null);
  };
  
  // Context value
  const value: ChatContextProps = {
    groups,
    currentGroup,
    setCurrentGroup,
    createGroup,
    leaveGroup,
    messages,
    loadingMessages,
    sendMessage,
    deleteMessage,
    uploadMedia,
    uploadingMedia,
    uploadProgress,
    markAsRead,
    getReadStatus,
    error,
    clearError
  };
  
  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
