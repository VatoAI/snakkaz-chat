import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  MessageSquare, 
  Search, 
  UserPlus, 
  MoreVertical,
  Lock, 
  CircleUser,
  Loader2,
  Bell,
  BellOff,
  Pin,
  PinOff,
  Trash2,
  Archive
} from 'lucide-react';
import { UserAvatar } from '@/components/ui/user-avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

/**
 * Interface for encrypted conversation data
 */
interface EncryptedConversation {
  id: string;
  participant: {
    id: string;
    username: string;
    avatar_url?: string;
    status?: 'online' | 'offline' | 'away' | 'dnd';
    public_key?: JsonWebKey;
  };
  lastMessage?: {
    content: string;
    timestamp: string;
    isEncrypted: boolean;
    sender_id: string;
  };
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isEncrypted: boolean;
  encryptionKeyId?: string;
  lastActive?: string;
}

export interface PrivateConversationsProps {
  currentUserId: string;
  onSelectConversation: (
    conversationId: string, 
    userId: string, 
    encryptionKeyId?: string
  ) => void;
  onNewConversation: () => void;
  activeConversationId?: string;
}

/**
 * PrivateConversations - A component for displaying encrypted private chat conversations
 * 
 * Features:
 * - End-to-end encryption indicators
 * - Real-time updates through Supabase channels
 * - Pinning, muting, and archiving conversations
 * - Search functionality
 */
export const PrivateConversations: React.FC<PrivateConversationsProps> = ({
  currentUserId,
  onSelectConversation,
  onNewConversation,
  activeConversationId
}) => {
  const { toast } = useToast();
  
  const [conversations, setConversations] = useState<EncryptedConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [realtimeChannel, setRealtimeChannel] = useState<any>(null);
  
  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
      subscribeToUpdates();
    }
    
    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [currentUserId]);

  const subscribeToUpdates = async () => {
    // Subscribe to real-time updates for private chats
    const channel = supabase
      .channel('private-chats-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'private_chat_messages',
        filter: `receiver_id=eq.${currentUserId}`
      }, handleConversationUpdate)
      .subscribe();
      
    setRealtimeChannel(channel);
  };

  const handleConversationUpdate = async (payload: any) => {
    // When new message arrives, update the conversation list
    const { new: newMessage } = payload;
    
    if (newMessage) {
      await fetchConversations(); // Refresh conversations
    }
  };

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, fetch conversations from Supabase
      // Get user's private chats
      const { data: chats, error: chatsError } = await supabase
        .from('private_chats')
        .select(`
          id,
          participant_ids,
          encryption_enabled,
          encryption_key_id,
          last_message,
          last_message_at,
          last_message_sender_id,
          created_at,
          updated_at,
          is_pinned,
          is_muted
        `)
        .or(`participant_ids.cs.{${currentUserId}}`)
        .order('last_message_at', { ascending: false });

      if (chatsError) throw chatsError;

      if (!chats || chats.length === 0) {
        setConversations([]);
        setIsLoading(false);
        return;
      }

      // Get unread message counts for each chat
      const { data: unreadCounts, error: unreadError } = await supabase
        .from('private_chat_messages')
        .select('chat_id, count')
        .eq('receiver_id', currentUserId)
        .eq('is_read', false)
        .group('chat_id');

      if (unreadError) throw unreadError;

      // Get user details for participants
      const otherUserIds = chats.map(chat => {
        return chat.participant_ids.find((id: string) => id !== currentUserId);
      }).filter(Boolean);

      const { data: participants, error: participantsError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, status, last_active, public_key')
        .in('id', otherUserIds);

      if (participantsError) throw participantsError;

      // Transform data to match our interface
      const formattedConversations: EncryptedConversation[] = chats.map(chat => {
        const otherUserId = chat.participant_ids.find((id: string) => id !== currentUserId);
        const participant = participants.find((p: any) => p.id === otherUserId) || {
          id: otherUserId,
          username: 'Unknown User',
          status: 'offline'
        };
        
        const unreadCount = unreadCounts?.find((u: any) => u.chat_id === chat.id)?.count || 0;
        
        return {
          id: chat.id,
          participant: {
            id: participant.id,
            username: participant.username,
            avatar_url: participant.avatar_url,
            status: participant.status,
            public_key: participant.public_key ? JSON.parse(participant.public_key) : undefined
          },
          lastMessage: chat.last_message ? {
            content: chat.last_message,
            timestamp: chat.last_message_at,
            isEncrypted: chat.encryption_enabled,
            sender_id: chat.last_message_sender_id
          } : undefined,
          unreadCount: parseInt(unreadCount),
          isPinned: chat.is_pinned,
          isMuted: chat.is_muted,
          isEncrypted: chat.encryption_enabled,
          encryptionKeyId: chat.encryption_key_id,
          lastActive: chat.updated_at
        };
      });

      setConversations(formattedConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations. Using demo data.",
        variant: "destructive",
      });
      
      // Use demo data on error
      const mockConversations: EncryptedConversation[] = [
        {
          id: "conv1",
          participant: {
            id: "user1",
            username: "alex_tech",
            avatar_url: "/avatars/alex.png",
            status: "online"
          },
          lastMessage: {
            content: "When do you want to meet?",
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            isEncrypted: false,
            sender_id: "user1"
          },
          unreadCount: 2,
          isPinned: true,
          isEncrypted: true,
          encryptionKeyId: "key1"
        },
        {
          id: "conv2",
          participant: {
            id: "user2",
            username: "sarah_design",
            avatar_url: "/avatars/sarah.png",
            status: "offline"
          },
          lastMessage: {
            content: "[Encrypted message]",
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            isEncrypted: true,
            sender_id: "user2"
          },
          unreadCount: 0,
          isMuted: true,
          isEncrypted: true,
          encryptionKeyId: "key2"
        }
      ];
      setConversations(mockConversations);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinConversation = async (conversationId: string, isPinned: boolean) => {
    try {
      const { error } = await supabase
        .from('private_chats')
        .update({ is_pinned: !isPinned })
        .eq('id', conversationId);
        
      if (error) throw error;
      
      // Update local state
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === conversationId ? { ...conv, isPinned: !isPinned } : conv
        )
      );
    } catch (error) {
      console.error("Error updating conversation:", error);
      toast({
        title: "Error",
        description: "Failed to update conversation.",
        variant: "destructive",
      });
    }
  };

  const handleMuteConversation = async (conversationId: string, isMuted: boolean) => {
    try {
      const { error } = await supabase
        .from('private_chats')
        .update({ is_muted: !isMuted })
        .eq('id', conversationId);
        
      if (error) throw error;
      
      // Update local state
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === conversationId ? { ...conv, isMuted: !isMuted } : conv
        )
      );
      
      toast({
        title: isMuted ? "Notifications Unmuted" : "Notifications Muted",
        description: isMuted 
          ? "You will now receive notifications for this conversation" 
          : "Notifications have been muted for this conversation",
      });
    } catch (error) {
      console.error("Error updating conversation:", error);
      toast({
        title: "Error",
        description: "Failed to update notification settings.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      // Mark messages as deleted but don't actually delete them
      const { error: updateError } = await supabase
        .from('private_chat_messages')
        .update({ is_deleted_for: supabase.auth.getSession() })
        .eq('chat_id', conversationId);
        
      if (updateError) throw updateError;
      
      // Update the chat record
      const { error: chatError } = await supabase
        .from('private_chats')
        .update({ 
          is_archived: true,
          archived_at: new Date().toISOString(),
          archived_by: currentUserId
        })
        .eq('id', conversationId);
        
      if (chatError) throw chatError;
      
      // Remove from UI
      setConversations(prevConversations => 
        prevConversations.filter(conv => conv.id !== conversationId)
      );
      
      toast({
        title: "Conversation Deleted",
        description: "The conversation has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast({
        title: "Error",
        description: "Failed to delete conversation.",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    // If older than 7 days, return the date
    return past.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'dnd': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv => 
    conv.participant.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort conversations: pinned first, then by last message time
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    // First sort by pinned status
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then sort by last message time (recent first)
    const timeA = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 
                  a.lastActive ? new Date(a.lastActive).getTime() : 0;
    const timeB = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 
                  b.lastActive ? new Date(b.lastActive).getTime() : 0;
    return timeB - timeA;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-3 border-b">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-cybergold-200" />
          <h2 className="font-medium text-cybergold-100">Private Messages</h2>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onNewConversation}
                className="h-8 w-8 text-cybergold-200 hover:text-cybergold-100"
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start new conversation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search messages..."
            className="pl-8 bg-background/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
        </div>
      ) : sortedConversations.length > 0 ? (
        <ScrollArea className="flex-1 px-2 py-1">
          <div className="space-y-1">
            {sortedConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center p-2 rounded-md cursor-pointer ${
                  activeConversationId === conversation.id 
                    ? 'bg-cybergold-900/40 border border-cybergold-700' 
                    : 'hover:bg-background/80'
                }`}
                onClick={() => onSelectConversation(
                  conversation.id, 
                  conversation.participant.id, 
                  conversation.encryptionKeyId
                )}
              >
                <div className="relative mr-3">
                  <UserAvatar 
                    src={conversation.participant.avatar_url} 
                    fallback={conversation.participant.username[0]} 
                    className="h-10 w-10" 
                  />
                  <span 
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                      getStatusColor(conversation.participant.status)
                    }`} 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">
                      {conversation.participant.username}
                    </span>
                    <div className="flex items-center">
                      {conversation.isPinned && (
                        <span className="mr-1 text-cybergold-200">
                          <Pin className="h-3 w-3" />
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {conversation.lastMessage?.timestamp && formatTimeAgo(conversation.lastMessage.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground truncate flex items-center">
                      {conversation.isEncrypted && (
                        <Lock className="h-3 w-3 inline mr-1 text-cybergold-200" />
                      )}
                      {conversation.lastMessage?.content || "No messages yet"}
                    </div>
                    <div className="flex items-center">
                      {conversation.isMuted && (
                        <BellOff className="h-3 w-3 mr-1 text-muted-foreground" />
                      )}
                      {conversation.unreadCount > 0 && (
                        <Badge variant="default" className="h-5 min-w-5 px-1 flex items-center justify-center bg-cybergold-500 text-black text-xs rounded-full">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 ml-1 text-muted-foreground"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePinConversation(conversation.id, !!conversation.isPinned);
                      }}
                    >
                      {conversation.isPinned ? (
                        <> 
                          <PinOff className="h-4 w-4 mr-2" /> Unpin conversation
                        </>
                      ) : (
                        <>
                          <Pin className="h-4 w-4 mr-2" /> Pin conversation
                        </>
                      )}
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMuteConversation(conversation.id, !!conversation.isMuted);
                      }}
                    >
                      {conversation.isMuted ? (
                        <>
                          <Bell className="h-4 w-4 mr-2" /> Unmute notifications
                        </>
                      ) : (
                        <>
                          <BellOff className="h-4 w-4 mr-2" /> Mute notifications
                        </>
                      )}
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conversation.id);
                      }}
                      className="text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete conversation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
          <CircleUser className="h-12 w-12 mb-2 text-muted-foreground/40" />
          {searchQuery ? (
            <p>No conversations match your search</p>
          ) : (
            <>
              <p className="mb-2">No conversations yet</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onNewConversation}
                className="text-cybergold-200 border-cybergold-200 hover:bg-cybergold-900/20"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Start a conversation
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PrivateConversations;