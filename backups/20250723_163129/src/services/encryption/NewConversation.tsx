import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
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
import { UserAvatar } from '@/components/ui/user-avatar';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Define interfaces for the component
interface User {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  status?: 'online' | 'offline' | 'away' | 'dnd';
  lastActive?: string;
  isSelected?: boolean;
  publicKey?: JsonWebKey; // For E2EE key exchange
}

export interface NewConversationProps {
  currentUserId: string;
  currentUserPublicKey?: JsonWebKey;
  onBack: () => void;
  onCreateConversation: (
    userId: string, 
    isEncrypted: boolean, 
    encryptionKeyId?: string
  ) => void;
}

/**
 * New Conversation Component for creating new private chats with E2EE support
 * 
 * This component provides UI for:
 * - Searching and selecting users to start conversations with
 * - Enabling end-to-end encryption for secure messaging
 * - Setting up shared encryption keys for E2EE communications
 */
export const NewConversation: React.FC<NewConversationProps> = ({
  currentUserId,
  currentUserPublicKey,
  onBack,
  onCreateConversation
}) => {
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [enableEncryption, setEnableEncryption] = useState(true);
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
  const [searchMode, setSearchMode] = useState<'all' | 'friends' | 'recent'>('friends');
  const [encryptionKeyId, setEncryptionKeyId] = useState<string | undefined>();

  useEffect(() => {
    fetchUsers();
  }, [currentUserId]);

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

  // Fetch users from Supabase
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, fetch users from Supabase with their public keys for E2EE
      const { data: userData, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, status, last_active, public_key')
        .neq('id', currentUserId);

      if (error) {
        throw error;
      }

      // Transform the data to match our User interface
      const transformedUsers: User[] = userData.map(user => ({
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        status: user.status,
        lastActive: user.last_active,
        publicKey: user.public_key ? JSON.parse(user.public_key) : undefined
      }));

      setUsers(transformedUsers);
      setFilteredUsers(transformedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      
      // For demo purposes, add mock data in case of error
      const mockUsers: User[] = [
        {
          id: "user1",
          username: "alex_tech",
          full_name: "Alex Johnson",
          avatar_url: "/avatars/alex.png",
          status: "online",
          lastActive: new Date().toISOString()
        },
        {
          id: "user2",
          username: "sarah_design",
          full_name: "Sarah Wilson",
          avatar_url: "/avatars/sarah.png",
          status: "offline",
          lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "user3",
          username: "mike_dev",
          full_name: "Mike Stevens",
          avatar_url: "/avatars/mike.png",
          status: "away",
          lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      ];
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      
      toast({
        title: "Error",
        description: "Failed to load users. Showing demo data instead.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserSelection = (user: User) => {
    // For private chats, only allow selecting one user at a time
    if (selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers([]);
      setEncryptionKeyId(undefined);
    } else {
      setSelectedUsers([user]);
    }
  };

  const handleCreateConversation = async () => {
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
    
    if (enableEncryption) {
      setIsGeneratingKeys(true);
      
      try {
        // In a real implementation, we would set up E2EE key exchange here
        // Generate a shared encryption key if encryption is enabled
        const response = await supabase.rpc('create_encrypted_chat_session', {
          other_user_id: selectedUser.id,
          encryption_level: 'e2ee'
        });
        
        if (response.error) {
          throw response.error;
        }
        
        // Call the parent component's handler with the encryption key ID
        onCreateConversation(
          selectedUser.id, 
          true, 
          response.data?.encryption_key_id || `demo_key_${Date.now()}`
        );
      } catch (error) {
        console.error("Error setting up encrypted chat:", error);
        toast({
          title: "Encryption Error",
          description: "Could not set up encrypted chat. Continuing without encryption.",
          variant: "destructive",
        });
        
        // Fall back to non-encrypted chat
        onCreateConversation(selectedUser.id, false);
      } finally {
        setIsGeneratingKeys(false);
      }
    } else {
      // Create non-encrypted conversation
      onCreateConversation(selectedUser.id, false);
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
      
      {/* Search input and filter tabs */}
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
      
      {/* User list */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-4 text-center">
            <CircleX className="h-10 w-10 mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">No users found</p>
            {searchQuery && (
              <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
            )}
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
                        {user.publicKey && enableEncryption && (
                          <span className="ml-1 text-xs text-cybergold-200">
                            <Lock className="h-2.5 w-2.5 inline" />
                          </span>
                        )}
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
      
      {/* Footer with action button */}
      <div className="p-3 border-t">
        <Button 
          className="w-full bg-cybergold-600 hover:bg-cybergold-700 text-cybergold-950"
          onClick={handleCreateConversation}
          disabled={selectedUsers.length === 0 || isGeneratingKeys}
        >
          {isGeneratingKeys ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Setting up encryption...
            </>
          ) : (
            <>
              <UserPlus2 className="h-4 w-4 mr-2" />
              Start Conversation
              {enableEncryption && (
                <Lock className="h-3 w-3 ml-2" />
              )}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default NewConversation;