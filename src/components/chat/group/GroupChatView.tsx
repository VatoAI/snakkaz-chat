/**
 * GroupChatView Component
 * 
 * Container component for group chats with pinned messages support
 */

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import ChatInterface from '../ChatInterface';
import useChatPin from '@/hooks/chat/useChatPin';
import { DecryptedMessage } from '@/types/message';
import { UserProfile } from '@/types/profile';
import { GroupChat } from '@/types/chat';
import { Loader, Settings, Users, ArrowLeft } from 'lucide-react';
import GroupSettingsPanel from './GroupSettingsPanel';
import GroupInvitePanel from './GroupInvitePanel';

interface GroupChatViewProps {
  groupId: string;
  onClose: () => void;
  onGroupSettingsClick?: (groupId: string) => void;
}

// Mock decrypt function - to be replaced with actual implementation
const mockDecryptWithKey = (message: any): DecryptedMessage => {
  return {
    id: message.id,
    content: message.content,
    sender_id: message.sender_id,
    created_at: message.created_at,
    is_edited: message.is_edited || false,
    is_deleted: message.is_deleted || false,
    pinned: message.pinned || false,
    pinned_by: message.pinned_by || null,
    pinned_at: message.pinned_at || null,
    message_type: message.message_type || 'text',
    metadata: message.metadata || {}
  };
};

const GroupChatView: React.FC<GroupChatViewProps> = ({
  groupId,
  onClose,
  onGroupSettingsClick
}) => {
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({});
  const [groupDetails, setGroupDetails] = useState<GroupChat | null>(null);
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingMessage, setEditingMessage] = useState<DecryptedMessage | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);
  const [oldestMessageDate, setOldestMessageDate] = useState<string | null>(null);
  const [canUserEditPins, setCanUserEditPins] = useState(false);
  
  // Nye state variabler for FASE 2 gruppechat-administrasjon
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showInvitePanel, setShowInvitePanel] = useState(false);
  const [userRole, setUserRole] = useState<string>('member');
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Initialize chat pin functionality
  const {
    pinnedMessages,
    pinnedMessageIds,
    pinMessage,
    unpinMessage,
    isPinning,
    isLoading: isPinLoading
  } = useChatPin({
    chatId: groupId,
    chatType: 'group',
  });
  
  // Fetch group details
  const fetchGroupDetails = useCallback(async () => {
    if (!groupId) return;
    
    try {
      // Get group information
      const { data: groupData, error: groupError } = await supabase
        .from('group_chats')
        .select('*')
        .eq('id', groupId)
        .single();
      
      if (groupError) throw groupError;
      
      if (groupData) {
        setGroupDetails(groupData as unknown as GroupChat);
      }
      
      // Get group members
      const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select('user_id, role')
        .eq('group_id', groupId);
      
      if (membersError) throw membersError;
      
      if (membersData) {
        const memberIds = membersData.map(member => member.user_id);
        setGroupMembers(memberIds);
        
        // Check if current user is admin or moderator
        if (user) {
          const currentUserRole = membersData.find(m => m.user_id === user.id)?.role;
          setCanUserEditPins(currentUserRole === 'admin' || currentUserRole === 'moderator');
        }
      }
    } catch (err) {
      console.error('Failed to fetch group details:', err);
      toast({
        title: 'Error',
        description: 'Failed to load group details',
        variant: 'destructive',
      });
    }
  }, [groupId, user, toast]);
  
  // Fetch user profiles for message authors
  const fetchUserProfiles = useCallback(async (userIds: string[]) => {
    if (!userIds.length) return;
    
    const uniqueIds = [...new Set(userIds)];
    const missingIds = uniqueIds.filter(id => !userProfiles[id]);
    
    if (missingIds.length === 0) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', missingIds);
        
      if (error) throw error;
      
      if (data) {
        const newProfiles: Record<string, UserProfile> = {};
        data.forEach(profile => {
          newProfiles[profile.id] = profile as UserProfile;
        });
        
        setUserProfiles(prev => ({ ...prev, ...newProfiles }));
      }
    } catch (err) {
      console.error('Failed to fetch user profiles:', err);
    }
  }, [userProfiles]);
  
  // Fetch group chat messages
  const fetchMessages = useCallback(async () => {
    if (!groupId) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('group_chat_messages')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      if (data) {
        // Decrypt messages and set state
        const decryptedMessages = data.map(msg => mockDecryptWithKey(msg));
        setMessages(decryptedMessages);
        
        // Set oldest message date for pagination
        if (decryptedMessages.length > 0) {
          const oldest = decryptedMessages[decryptedMessages.length - 1];
          setOldestMessageDate(oldest.created_at);
        }
        
        // Fetch user profiles
        const userIds = data.map(msg => msg.sender_id);
        fetchUserProfiles(userIds);
        
        // Check if there are more messages
        setHasMoreMessages(data.length === 50);
      }
    } catch (err) {
      console.error('Failed to fetch group chat messages:', err);
      toast({
        title: 'Error',
        description: 'Failed to load group messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [groupId, fetchUserProfiles, toast]);
  
  // Load more messages (pagination)
  const loadMoreMessages = useCallback(async () => {
    if (!groupId || !oldestMessageDate || isLoadingMoreMessages || !hasMoreMessages) return;
    
    setIsLoadingMoreMessages(true);
    
    try {
      const { data, error } = await supabase
        .from('group_chat_messages')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false })
        .lt('created_at', oldestMessageDate)
        .limit(30);
      
      if (error) throw error;
      
      if (data) {
        const decryptedMessages = data.map(msg => mockDecryptWithKey(msg));
        
        setMessages(prev => [...prev, ...decryptedMessages]);
        
        // Update oldest message date
        if (decryptedMessages.length > 0) {
          const oldest = decryptedMessages[decryptedMessages.length - 1];
          setOldestMessageDate(oldest.created_at);
        }
        
        // Fetch user profiles
        const userIds = data.map(msg => msg.sender_id);
        fetchUserProfiles(userIds);
        
        // Check if there are more messages
        setHasMoreMessages(data.length === 30);
      }
    } catch (err) {
      console.error('Failed to load more messages:', err);
      toast({
        title: 'Error',
        description: 'Failed to load more messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingMoreMessages(false);
    }
  }, [groupId, oldestMessageDate, isLoadingMoreMessages, hasMoreMessages, fetchUserProfiles, toast]);
  
  // Send a message
  const handleSendMessage = async (text: string, mediaFile?: File) => {
    if (!text.trim() && !mediaFile) return;
    if (!user || !groupId) {
      toast({
        title: 'Error',
        description: 'You must be logged in and part of the group to send messages',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // For edit mode
      if (editingMessage) {
        const { error } = await supabase
          .from('group_chat_messages')
          .update({
            content: text,
            is_edited: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingMessage.id)
          .eq('sender_id', user.id); // Ensure user can only edit their own messages
        
        if (error) throw error;
        
        // Update local state
        setMessages(prev => 
          prev.map(msg => 
            msg.id === editingMessage.id 
              ? { ...msg, content: text, is_edited: true }
              : msg
          )
        );
        
        // Exit edit mode
        setEditingMessage(null);
        setNewMessage('');
        
        toast({
          title: 'Success',
          description: 'Message updated',
        });
        
        return;
      }
      
      // Normal message sending
      let messageData: any = {
        group_id: groupId,
        sender_id: user.id,
        content: text,
        created_at: new Date().toISOString(),
        message_type: 'text'
      };
      
      // Handle media upload if present
      if (mediaFile) {
        try {
          // Upload file to storage
          const fileName = `group/${groupId}/${Date.now()}_${mediaFile.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('message_media')
            .upload(fileName, mediaFile);
          
          if (uploadError) throw uploadError;
          
          // Get public URL
          const { data: publicUrl } = supabase.storage
            .from('message_media')
            .getPublicUrl(fileName);
          
          // Update message data
          messageData = {
            ...messageData,
            content: publicUrl.publicUrl,
            message_type: mediaFile.type.startsWith('image/') ? 'image' : 'file',
            metadata: {
              fileName: mediaFile.name,
              fileSize: mediaFile.size,
              mimeType: mediaFile.type
            }
          };
        } catch (err) {
          console.error('Failed to upload media:', err);
          toast({
            title: 'Error',
            description: 'Failed to upload media file',
            variant: 'destructive',
          });
          return;
        }
      }
      
      // Insert message into database
      const { data, error } = await supabase
        .from('group_chat_messages')
        .insert(messageData)
        .select();
      
      if (error) throw error;
      
      // Add message to local state
      if (data) {
        const newMessage = mockDecryptWithKey(data[0]);
        setMessages(prev => [newMessage, ...prev]);
      }
      
      // Clear input
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    }
  };
  
  // Handle message edit
  const handleEditMessage = (message: DecryptedMessage) => {
    setEditingMessage(message);
    setNewMessage(message.content);
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingMessage(null);
    setNewMessage('');
  };
  
  // Delete a message
  const handleDeleteMessage = async (messageId: string) => {
    if (!user || !groupId) return;
    
    // First check if user is authorized to delete this message
    const messageToDelete = messages.find(m => m.id === messageId);
    const isAdmin = canUserEditPins; // Assuming admins/moderators can delete any message
    const isOwnMessage = messageToDelete?.sender_id === user.id;
    
    if (!isAdmin && !isOwnMessage) {
      toast({
        title: 'Error',
        description: 'You do not have permission to delete this message',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('group_chat_messages')
        .update({ is_deleted: true, content: '[Message deleted]' })
        .eq('id', messageId)
        .eq('group_id', groupId);
      
      if (error) throw error;
      
      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, is_deleted: true, content: '[Message deleted]' }
            : msg
        )
      );
      
      toast({
        title: 'Success',
        description: 'Message deleted',
      });
    } catch (err) {
      console.error('Failed to delete message:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete message',
        variant: 'destructive',
      });
    }
  };
  
  // Handle pinning/unpinning a message
  const handlePinMessage = async (messageId: string) => {
    if (!groupId) return;
    
    // Check if user has permission to pin (only admins and moderators)
    if (!canUserEditPins) {
      toast({
        title: 'Access Denied',
        description: 'Only group administrators and moderators can pin messages',
        variant: 'destructive',
      });
      return;
    }
    
    if (pinnedMessageIds.has(messageId)) {
      await unpinMessage(messageId);
    } else {
      await pinMessage(messageId);
    }
  };

  // Set up initial data loading
  useEffect(() => {
    fetchGroupDetails();
    fetchMessages();
  }, [fetchGroupDetails, fetchMessages]);
  
  // Set up realtime subscription
  useEffect(() => {
    if (!groupId) return;
    
    // Subscribe to message changes
    const subscription = supabase
      .channel(`group-chat-${groupId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_chat_messages',
          filter: `group_id=eq.${groupId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = mockDecryptWithKey(payload.new);
            
            // Only add if it's not from the current user (current user's messages already added)
            if (newMessage.sender_id !== user?.id) {
              // Only add if it's not already in the list
              setMessages(prev => {
                if (prev.some(msg => msg.id === newMessage.id)) {
                  return prev;
                }
                return [newMessage, ...prev];
              });
              
              // Fetch user profile if needed
              fetchUserProfiles([newMessage.sender_id]);
            }
          }
          else if (payload.eventType === 'UPDATE') {
            const updatedMessage = mockDecryptWithKey(payload.new);
            
            setMessages(prev => prev.map(msg => 
              msg.id === updatedMessage.id ? updatedMessage : msg  
            ));
          }
          else if (payload.eventType === 'DELETE') {
            const deletedMessageId = payload.old.id;
            setMessages(prev => prev.filter(msg => msg.id !== deletedMessageId));
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [groupId, user?.id, fetchUserProfiles]);
  
  // Handle group settings click
  const handleGroupSettingsClick = () => {
    setShowSettingsPanel(true);
  };
  
  // Handle invite click
  const handleInviteClick = () => {
    setShowInvitePanel(true);
  };
  
  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user?.id || !groupId) return;
      
      try {
        const { data, error } = await supabase
          .from('group_members')
          .select('role')
          .eq('group_id', groupId)
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setUserRole(data.role);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    
    fetchUserRole();
  }, [groupId, user?.id]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-cybergold-500 mx-auto mb-2" />
          <p className="text-cybergold-500">Loading group chat...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center">
          <button 
            className="mr-3 text-gray-400 hover:text-cybergold-400"
            onClick={onClose}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-cybergold-400">
              {groupDetails?.name || 'Group Chat'}
            </h2>
            <div className="flex items-center text-xs text-gray-500">
              <Users size={12} className="mr-1" />
              <span>{groupMembers.length} members</span>
            </div>
          </div>
        </div>
        
        {canUserEditPins && (
          <button 
            className="text-gray-400 hover:text-cybergold-400"
            onClick={handleGroupSettingsClick}
          >
            <Settings size={20} />
          </button>
        )}
      </div>
      
      <ChatInterface
        messages={messages}
        currentUserId={user?.id || ''}
        userProfiles={userProfiles}
        newMessage={newMessage}
        onNewMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
        onPinMessage={handlePinMessage}
        onUnpinMessage={handlePinMessage}
        pinnedMessages={pinnedMessages}
        showPinnedMessages={true}
        chatId={groupId}
        chatType="group"
        isLoading={isLoading}
        recipientInfo={{
          name: groupDetails?.name || 'Group Chat',
          avatar: groupDetails?.avatar_url || undefined,
        }}
        isDirectMessage={false}
        editingMessage={editingMessage}
        onCancelEdit={handleCancelEdit}
        hasMoreMessages={hasMoreMessages}
        isLoadingMoreMessages={isLoadingMoreMessages}
        onLoadMoreMessages={loadMoreMessages}
        canPin={canUserEditPins}
        pinnedMessageIds={pinnedMessageIds}
      />
      
      {showSettingsPanel && groupId && (
        <GroupSettingsPanel 
          groupId={groupId}
          onClose={() => setShowSettingsPanel(false)}
          onGroupUpdated={fetchGroupDetails}
        />
      )}
      
      {showInvitePanel && groupId && (
        <GroupInvitePanel 
          groupId={groupId}
          onClose={() => setShowInvitePanel(false)}
          onGroupUpdated={fetchGroupDetails}
        />
      )}
    </div>
  );
};

export default GroupChatView;
