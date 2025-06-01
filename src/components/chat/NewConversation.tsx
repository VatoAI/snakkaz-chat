import React, { useState, useEffect, useCallback } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  UserPlus2, 
  Lock, 
  ChevronLeft, 
  CheckCircle2, 
  CircleX,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAvatar } from '@/components/chat/header/UserAvatar';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface User {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  status?: 'online' | 'offline' | 'away' | 'dnd';
  lastActive?: string;
  isSelected?: boolean;
}

export interface NewConversationProps {
  currentUserId: string;
  onBack: () => void;
  onCreateConversation: (userId: string, isEncrypted: boolean) => void;
}

export const NewConversation: React.FC<NewConversationProps> = ({
  currentUserId,
  onBack,
  onCreateConversation
}) => {
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [enableEncryption, setEnableEncryption] = useState(true);
  const [searchMode, setSearchMode] = useState<'all' | 'friends' | 'recent'>('friends');

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      let realUsers: User[] = [];
      
      if (searchMode === 'friends') {
        // Fetch user's friends
        const { data: friendships, error: friendshipsError } = await supabase
          .from('friendships')
          .select(`
            user_id,
            friend_id,
            status
          `)
          .or(`user_id.eq.${currentUserId},friend_id.eq.${currentUserId}`)
          .eq('status', 'accepted');
          
        if (friendshipsError) throw friendshipsError;
        
        if (friendships && friendships.length > 0) {
          const friendIds = friendships.map(f => 
            f.user_id === currentUserId ? f.friend_id : f.user_id
          );
          
          // Fetch friend profiles
          const { data: friendProfiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .in('id', friendIds);
            
          if (profilesError) throw profilesError;
          
          realUsers = friendProfiles?.map(profile => ({
            id: profile.id,
            username: profile.username || 'Unknown User',
            full_name: profile.full_name || undefined,
            avatar_url: profile.avatar_url || undefined,
            status: 'offline', // Default status, will be updated by presence
            lastActive: new Date().toISOString()
          })) || [];
        }
      } else if (searchMode === 'recent') {
        // Fetch users from recent conversations
        const { data: recentMessages, error: messagesError } = await supabase
          .from('messages')
          .select('sender_id, receiver_id, created_at')
          .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
          .order('created_at', { ascending: false })
          .limit(20);
          
        if (messagesError) throw messagesError;
        
        if (recentMessages && recentMessages.length > 0) {
          const recentUserIds = [...new Set(
            recentMessages.map(msg => 
              msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id
            ).filter(id => id && id !== currentUserId)
          )];
          
          // Fetch recent user profiles
          const { data: recentProfiles, error: recentProfilesError } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .in('id', recentUserIds);
            
          if (recentProfilesError) throw recentProfilesError;
          
          realUsers = recentProfiles?.map(profile => ({
            id: profile.id,
            username: profile.username || 'Unknown User',
            full_name: profile.full_name || undefined,
            avatar_url: profile.avatar_url || undefined,
            status: 'offline', // Default status, will be updated by presence
            lastActive: new Date().toISOString()
          })) || [];
        }
      } else {
        // Fetch all users (excluding current user)
        const { data: allProfiles, error: allProfilesError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .neq('id', currentUserId)
          .limit(50); // Limit to prevent excessive data
          
        if (allProfilesError) throw allProfilesError;
        
        realUsers = allProfiles?.map(profile => ({
          id: profile.id,
          username: profile.username || 'Unknown User',
          full_name: profile.full_name || undefined,
          avatar_url: profile.avatar_url || undefined,
          status: 'offline', // Default status, will be updated by presence
          lastActive: new Date().toISOString()
        })) || [];
      }
      
      // Fetch presence data for all users
      if (realUsers.length > 0) {
        const userIds = realUsers.map(user => user.id);
        const { data: presenceData, error: presenceError } = await supabase
          .from('user_presence')
          .select('user_id, status, last_seen')
          .in('user_id', userIds);
          
        if (!presenceError && presenceData) {
          const presenceMap = presenceData.reduce((acc, presence) => {
            acc[presence.user_id] = presence;
            return acc;
          }, {} as Record<string, { status: string; last_seen: string }>);
          
          // Update users with presence data
          realUsers = realUsers.map(user => ({
            ...user,
            status: (presenceMap[user.id]?.status as 'online' | 'offline' | 'away' | 'dnd') || 'offline',
            lastActive: presenceMap[user.id]?.last_seen || user.lastActive
          }));
        }
      }
      
      setUsers(realUsers);
      setFilteredUsers(realUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
      
      // Fallback to empty state with helpful message
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, searchMode, supabase, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredUsers(
        users.filter(user => 
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const toggleUserSelection = (user: User) => {
    // For simplicity, let's implement single-user selection
    if (selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers([user]);
    }
  };

  const handleCreateConversation = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No user selected",
        description: "Please select a user to start a conversation with.",
        variant: "destructive",
      });
      return;
    }

    // For now, we only support 1:1 conversations
    const selectedUser = selectedUsers[0];
    onCreateConversation(selectedUser.id, enableEncryption);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'dnd': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-3 border-b">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={onBack}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-medium text-cybergold-100">New Conversation</h2>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Switch
                    checked={enableEncryption}
                    onCheckedChange={setEnableEncryption}
                    className="data-[state=checked]:bg-cybergold-600"
                  />
                  <Lock className={`h-4 w-4 ml-2 ${enableEncryption ? 'text-cybergold-200' : 'text-muted-foreground'}`} />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Enable end-to-end encryption</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..."
            className="pl-9 bg-background/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 mt-3">
          <Button 
            variant={searchMode === 'friends' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSearchMode('friends')}
            className={searchMode === 'friends' ? 'bg-cybergold-600 text-cybergold-950' : 'text-cybergold-200'}
          >
            Friends
          </Button>
          <Button 
            variant={searchMode === 'recent' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSearchMode('recent')}
            className={searchMode === 'recent' ? 'bg-cybergold-600 text-cybergold-950' : 'text-cybergold-200'}
          >
            Recent
          </Button>
          <Button 
            variant={searchMode === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSearchMode('all')}
            className={searchMode === 'all' ? 'bg-cybergold-600 text-cybergold-950' : 'text-cybergold-200'}
          >
            All Users
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-4 text-center">
            <CircleX className="h-10 w-10 mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="space-y-1 p-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    selectedUsers.some(u => u.id === user.id)
                      ? 'bg-cybergold-900/40 border border-cybergold-700'
                      : 'hover:bg-background/80'
                  }`}
                  onClick={() => toggleUserSelection(user)}
                >
                  <div className="relative mr-3">
                    <UserAvatar 
                      src={user.avatar_url} 
                      fallback={user.username?.[0] || '?'} 
                      className="h-10 w-10" 
                    />
                    <span 
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                        getStatusColor(user.status)
                      }`} 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">
                        {user.username}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.lastActive && formatTimeAgo(user.lastActive)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground truncate">
                      {user.full_name || ''}
                    </div>
                  </div>
                  
                  {selectedUsers.some(u => u.id === user.id) && (
                    <CheckCircle2 className="h-5 w-5 text-cybergold-200 ml-2" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
      
      <div className="p-3 border-t">
        <Button 
          className="w-full bg-cybergold-600 hover:bg-cybergold-700 text-cybergold-950"
          onClick={handleCreateConversation}
          disabled={selectedUsers.length === 0}
        >
          <UserPlus2 className="h-4 w-4 mr-2" />
          Start Conversation
          {enableEncryption && (
            <Lock className="h-3 w-3 ml-2" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default NewConversation;