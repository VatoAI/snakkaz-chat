
import React, { useState, useEffect } from 'react';
import { FriendsList } from './list/FriendsList';
import { WebRTCManager } from '@/utils/webrtc';
import { DecryptedMessage } from '@/types/message';
import { EmptyFriendView } from './EmptyFriendView';
import { AddFriendDialog } from './AddFriendDialog';
import { DirectMessage } from './DirectMessage';
import { Button } from '@/components/ui/button';
import { UserPlus, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define the FriendRecord interface
interface FriendRecord {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
  updated_at?: string;
  created_at?: string;
  profile?: {
    username: string;
    full_name?: string;
    avatar_url?: string;
  };
}

interface FriendsContainerProps {
  currentUserId: string;
  webRTCManager: WebRTCManager;
  directMessages: DecryptedMessage[];
  onNewMessage: (message: DecryptedMessage) => void;
  userProfiles?: Record<string, any>;
}

export const FriendsContainer: React.FC<FriendsContainerProps> = ({
  currentUserId,
  webRTCManager,
  directMessages,
  onNewMessage,
  userProfiles = {}
}) => {
  const [friends, setFriends] = useState<FriendRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [refreshingFriends, setRefreshingFriends] = useState(false);
  const [showAddFriendDialog, setShowAddFriendDialog] = useState(false);
  const { toast } = useToast();
  
  // Fetch friends on component mount
  useEffect(() => {
    fetchFriends();
  }, [currentUserId]);
  
  // Fetch friends list from the database
  const fetchFriends = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          user_id,
          friend_id,
          status,
          created_at,
          updated_at
        `)
        .or(`user_id.eq.${currentUserId},friend_id.eq.${currentUserId}`)
        .eq('status', 'accepted');
      
      if (error) throw error;
      
      // Convert data to expected format
      const formattedFriends = data.map(friendship => {
        const friendId = friendship.user_id === currentUserId 
          ? friendship.friend_id 
          : friendship.user_id;
        
        return {
          ...friendship,
          friend_id: friendId,
          profile: userProfiles[friendId]
        };
      });
      
      setFriends(formattedFriends);
    } catch (err) {
      console.error('Error fetching friends:', err);
      setError('Kunne ikke hente venner. Prøv igjen senere.');
    } finally {
      setIsLoading(false);
      setRefreshingFriends(false);
    }
  };
  
  // Handle friend selection
  const handleFriendSelect = (friendId: string) => {
    setSelectedFriendId(friendId);
  };
  
  // Handle back from direct message
  const handleBackFromDirectMessage = () => {
    setSelectedFriendId(null);
  };
  
  // Handle refresh friends list
  const handleRefreshFriends = () => {
    setRefreshingFriends(true);
    fetchFriends();
  };
  
  // Handle add friend
  const handleAddFriend = async (username: string) => {
    try {
      // Get user by username
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('username', username)
        .single();
      
      if (userError || !userData) {
        toast({
          title: 'Fant ikke bruker',
          description: 'Kunne ikke finne en bruker med det brukernavnet',
          variant: 'destructive'
        });
        return;
      }
      
      if (userData.id === currentUserId) {
        toast({
          title: 'Ugyldigt valg',
          description: 'Du kan ikke legge til deg selv som venn',
          variant: 'destructive'
        });
        return;
      }
      
      // Check if friendship already exists
      const { data: existingFriendship, error: friendshipError } = await supabase
        .from('friendships')
        .select('*')
        .or(`and(user_id.eq.${currentUserId},friend_id.eq.${userData.id}),and(user_id.eq.${userData.id},friend_id.eq.${currentUserId})`)
        .single();
      
      if (existingFriendship) {
        toast({
          title: 'Vennskap eksisterer allerede',
          description: 'Dere er allerede venner eller en forespørsel er sendt',
          variant: 'destructive'
        });
        return;
      }
      
      // Create friendship
      const { error: createError } = await supabase
        .from('friendships')
        .insert({
          user_id: currentUserId,
          friend_id: userData.id,
          status: 'accepted' // Auto-accept for now
        });
      
      if (createError) throw createError;
      
      toast({
        title: 'Venn lagt til',
        description: `${username} er nå din venn`
      });
      
      fetchFriends();
      setShowAddFriendDialog(false);
    } catch (err) {
      console.error('Error adding friend:', err);
      toast({
        title: 'Kunne ikke legge til venn',
        description: 'En feil oppstod. Prøv igjen senere.',
        variant: 'destructive'
      });
    }
  };
  
  // Get the selected friend
  const selectedFriend = friends.find(f => f.friend_id === selectedFriendId);
  
  // Get list of friend IDs
  const friendsList = friends.map(friend => friend.friend_id);
  
  // If a friend is selected, show the direct message view
  if (selectedFriend && selectedFriendId) {
    return (
      <DirectMessage
        friend={selectedFriend}
        currentUserId={currentUserId}
        webRTCManager={webRTCManager}
        onBack={handleBackFromDirectMessage}
        messages={directMessages}
        onNewMessage={onNewMessage}
        userProfiles={userProfiles}
      />
    );
  }
  
  // If no friends, show empty state
  if (friends.length === 0 && !isLoading) {
    return (
      <div className="h-full flex flex-col">
        <EmptyFriendView onAddFriend={() => setShowAddFriendDialog(true)} />
        <AddFriendDialog
          isOpen={showAddFriendDialog}
          onClose={() => setShowAddFriendDialog(false)}
          onAddFriend={handleAddFriend}
        />
      </div>
    );
  }
  
  // Friends list view
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-cyberdark-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-cybergold-400">Dine venner</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-cybergold-500 hover:text-cybergold-400 hover:bg-cyberdark-800"
            onClick={handleRefreshFriends}
            disabled={refreshingFriends}
          >
            <RefreshCw className={`h-4 w-4 ${refreshingFriends ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-cybergold-400 border-cybergold-700 hover:bg-cyberdark-800"
            onClick={() => setShowAddFriendDialog(true)}
          >
            <UserPlus className="h-4 w-4 mr-1" />
            <span>Legg til</span>
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <FriendsList
          friends={friends}
          friendsList={friendsList}
          currentUserId={currentUserId}
          webRTCManager={webRTCManager}
          directMessages={directMessages}
          onNewMessage={onNewMessage}
          userProfiles={userProfiles}
          onStartChat={handleFriendSelect}
          selectedFriendId={selectedFriendId}
          onRefresh={handleRefreshFriends}
        />
      </div>
      
      <AddFriendDialog
        isOpen={showAddFriendDialog}
        onClose={() => setShowAddFriendDialog(false)}
        onAddFriend={handleAddFriend}
      />
    </div>
  );
};
