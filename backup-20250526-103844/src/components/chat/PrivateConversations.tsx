import React, { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  Search, 
  UserPlus, 
  MoreVertical,
  Lock, 
  CircleUser,
  Loader2
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

interface Conversation {
  id: string;
  participant: {
    id: string;
    username: string;
    avatar_url?: string;
    status?: 'online' | 'offline' | 'away' | 'dnd';
  };
  lastMessage?: {
    content: string;
    timestamp: string;
    isEncrypted: boolean;
  };
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isEncrypted: boolean;
}

export interface PrivateConversationsProps {
  currentUserId: string;
  onSelectConversation: (conversationId: string, userId: string) => void;
  onNewConversation: () => void;
  activeConversationId?: string;
}

export const PrivateConversations: React.FC<PrivateConversationsProps> = ({
  currentUserId,
  onSelectConversation,
  onNewConversation,
  activeConversationId
}) => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const { toast } = useToast();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
    }
  }, [currentUserId]);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, fetch conversations from Supabase
      // For now, let's use demo data
      const mockConversations: Conversation[] = [
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
            isEncrypted: false
          },
          unreadCount: 2,
          isPinned: true,
          isEncrypted: true
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
            isEncrypted: true
          },
          unreadCount: 0,
          isMuted: true,
          isEncrypted: true
        },
        {
          id: "conv3",
          participant: {
            id: "user3",
            username: "mike_dev",
            avatar_url: "/avatars/mike.png",
            status: "away"
          },
          lastMessage: {
            content: "Let me check the code and get back to you",
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            isEncrypted: false
          },
          unreadCount: 0,
          isEncrypted: false
        }
      ];

      setConversations(mockConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinConversation = (conversationId: string, isPinned: boolean) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId ? { ...conv, isPinned: !isPinned } : conv
      )
    );
  };

  const handleMuteConversation = (conversationId: string, isMuted: boolean) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId ? { ...conv, isMuted: !isMuted } : conv
      )
    );
  };

  const handleDeleteConversation = (conversationId: string) => {
    setConversations(prevConversations => 
      prevConversations.filter(conv => conv.id !== conversationId)
    );
    
    toast({
      title: "Conversation Deleted",
      description: "The conversation has been deleted.",
    });
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

  const filteredConversations = conversations.filter(conv => 
    conv.participant.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort conversations: pinned first, then by last message time
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    // First sort by pinned status
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then sort by last message time (recent first)
    const timeA = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 0;
    const timeB = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 0;
    return timeB - timeA;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-3 border-b">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-cybergold-200" />
          <h2 className="font-medium text-cybergold-100">Messages</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewConversation}
          className="h-8 w-8 text-cybergold-200 hover:text-cybergold-100"
        >
          <UserPlus className="h-4 w-4" />
        </Button>
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
                onClick={() => onSelectConversation(conversation.id, conversation.participant.id)}
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
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="17" x2="12" y2="22" />
                            <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 1 0 0-4H8a2 2 0 1 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
                          </svg>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-muted-foreground">
                          <path d="M12 6v12" />
                          <path d="M6 12h12" />
                        </svg>
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
                      {conversation.isPinned ? "Unpin conversation" : "Pin conversation"}
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMuteConversation(conversation.id, !!conversation.isMuted);
                      }}
                    >
                      {conversation.isMuted ? "Unmute notifications" : "Mute notifications"}
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conversation.id);
                      }}
                      className="text-red-500 focus:text-red-500"
                    >
                      Delete conversation
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