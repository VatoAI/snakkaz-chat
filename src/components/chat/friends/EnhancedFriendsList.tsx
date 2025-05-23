import React, { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { PlusCircle, UserPlus, X, Check, UserRoundX, Clock, Search } from 'lucide-react';
import { UserStatus } from '@/types/presence';
import { useToast } from '@/hooks/use-toast';
import { UserAvatar } from '@/components/ui/user-avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Friend {
  id: string;
  username: string;
  avatar_url?: string;
  status: UserStatus;
  lastActive?: string | Date;
}

interface FriendRequest {
  id: string;
  username: string;
  avatar_url?: string;
  createdAt: string | Date;
}

export interface EnhancedFriendsListProps {
  currentUserId: string;
}

export const EnhancedFriendsList: React.FC<EnhancedFriendsListProps> = ({ currentUserId }) => {
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [isAddFriendDialogOpen, setIsAddFriendDialogOpen] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Fetch friends and friend requests on component mount
  useEffect(() => {
    if (!currentUserId) return;
    fetchFriendsAndRequests();
  }, [currentUserId]);

  const fetchFriendsAndRequests = async () => {
    try {
      // In a real implementation, these would be actual Supabase queries
      // For now, let's use demo data
      setFriends([
        {
          id: "1",
          username: "alex_tech",
          avatar_url: "/avatars/alex.png",
          status: "online",
          lastActive: new Date()
        },
        {
          id: "2",
          username: "sarah_design",
          avatar_url: "/avatars/sarah.png",
          status: "offline",
          lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000)
        },
        {
          id: "3",
          username: "mike_dev",
          avatar_url: "/avatars/mike.png",
          status: "away",
          lastActive: new Date(Date.now() - 30 * 60 * 1000)
        }
      ]);

      setIncomingRequests([
        {
          id: "4",
          username: "emma_newuser",
          avatar_url: "/avatars/emma.png",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ]);

      setOutgoingRequests([
        {
          id: "5",
          username: "david_code",
          avatar_url: "/avatars/david.png",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ]);
    } catch (error) {
      console.error("Error fetching friends data:", error);
      toast({
        title: "Error",
        description: "Failed to load friends list. Please try again.",
        variant: "destructive",
      });
    }
  };

  const searchUsers = async () => {
    if (!searchUsername.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // In a real implementation, this would be an actual Supabase query
      // For now, just simulate a search
      setTimeout(() => {
        setSearchResults([
          {
            id: "6",
            username: `${searchUsername}_matched`,
            avatar_url: "/avatars/user1.png",
          },
          {
            id: "7",
            username: `user_${searchUsername}`,
            avatar_url: "/avatars/user2.png",
          }
        ]);
        setIsSearching(false);
      }, 500);
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        title: "Search Error",
        description: "Failed to search for users. Please try again.",
        variant: "destructive",
      });
      setIsSearching(false);
    }
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      // In a real implementation, this would send the request to Supabase
      // For now, just add to outgoing requests
      const user = searchResults.find(user => user.id === userId);
      
      setOutgoingRequests(prev => [...prev, {
        id: user.id,
        username: user.username,
        avatar_url: user.avatar_url,
        createdAt: new Date()
      }]);
      
      setSearchResults(prev => prev.filter(user => user.id !== userId));
      
      toast({
        title: "Friend Request Sent",
        description: `Friend request sent to ${user.username}`,
      });
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast({
        title: "Error",
        description: "Failed to send friend request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    try {
      // In a real implementation, this would accept the request via Supabase
      const request = incomingRequests.find(req => req.id === requestId);
      
      setFriends(prev => [...prev, {
        id: request.id,
        username: request.username,
        avatar_url: request.avatar_url,
        status: "offline",
        lastActive: new Date()
      }]);
      
      setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
      
      toast({
        title: "Friend Request Accepted",
        description: `You are now friends with ${request.username}`,
      });
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast({
        title: "Error",
        description: "Failed to accept friend request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const rejectFriendRequest = async (requestId: string) => {
    try {
      // In a real implementation, this would reject the request via Supabase
      const request = incomingRequests.find(req => req.id === requestId);
      
      setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
      
      toast({
        title: "Friend Request Rejected",
        description: `Rejected friend request from ${request.username}`,
      });
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast({
        title: "Error",
        description: "Failed to reject friend request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cancelFriendRequest = async (requestId: string) => {
    try {
      // In a real implementation, this would cancel the request via Supabase
      const request = outgoingRequests.find(req => req.id === requestId);
      
      setOutgoingRequests(prev => prev.filter(req => req.id !== requestId));
      
      toast({
        title: "Request Cancelled",
        description: `Cancelled friend request to ${request.username}`,
      });
    } catch (error) {
      console.error("Error cancelling friend request:", error);
      toast({
        title: "Error",
        description: "Failed to cancel friend request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeFriend = async (friendId: string) => {
    try {
      // In a real implementation, this would remove the friend via Supabase
      const friend = friends.find(f => f.id === friendId);
      
      setFriends(prev => prev.filter(f => f.id !== friendId));
      
      toast({
        title: "Friend Removed",
        description: `${friend.username} has been removed from your friends`,
      });
    } catch (error) {
      console.error("Error removing friend:", error);
      toast({
        title: "Error",
        description: "Failed to remove friend. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'dnd': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-cybergold-200">Friends</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => setIsAddFriendDialogOpen(true)}
        >
          <UserPlus className="h-4 w-4" />
          <span>Add</span>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">
            All
            <Badge variant="outline" className="ml-2">{friends.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="online">
            Online
            <Badge variant="outline" className="ml-2">
              {friends.filter(f => f.status === 'online').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            <Badge variant="outline" className="ml-2">
              {incomingRequests.length + outgoingRequests.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {friends.length === 0 ? (
            <div className="text-center py-6 text-sm text-cybergold-500">
              <p>Your friends list is empty</p>
              <p>Add friends to start chatting</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {friends.map(friend => (
                  <div 
                    key={friend.id} 
                    className="flex items-center justify-between rounded-md p-2 hover:bg-cyberdark-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <UserAvatar 
                          src={friend.avatar_url} 
                          alt={friend.username} 
                          className="h-10 w-10"
                        />
                        <span 
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(friend.status)}`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-cybergold-200">{friend.username}</p>
                        <p className="text-xs text-cybergold-500">
                          {friend.status === 'online' ? 'Online' : `Last seen ${formatTimeAgo(friend.lastActive!)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        Message
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => removeFriend(friend.id)}
                      >
                        <UserRoundX className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="online" className="space-y-4">
          {friends.filter(f => f.status === 'online').length === 0 ? (
            <div className="text-center py-6 text-sm text-cybergold-500">
              <p>No friends are currently online</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {friends.filter(f => f.status === 'online').map(friend => (
                  <div 
                    key={friend.id} 
                    className="flex items-center justify-between rounded-md p-2 hover:bg-cyberdark-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <UserAvatar 
                          src={friend.avatar_url} 
                          alt={friend.username} 
                          className="h-10 w-10"
                        />
                        <span 
                          className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-cybergold-200">{friend.username}</p>
                        <p className="text-xs text-cybergold-500">Online</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      Message
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          {incomingRequests.length === 0 && outgoingRequests.length === 0 ? (
            <div className="text-center py-6 text-sm text-cybergold-500">
              <p>No pending friend requests</p>
            </div>
          ) : (
            <>
              {incomingRequests.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-cybergold-300">Incoming Requests</h3>
                  <ScrollArea className="h-[150px] pr-4">
                    <div className="space-y-2">
                      {incomingRequests.map(request => (
                        <div 
                          key={request.id} 
                          className="flex items-center justify-between rounded-md p-2 bg-cyberdark-800/30"
                        >
                          <div className="flex items-center gap-3">
                            <UserAvatar 
                              src={request.avatar_url} 
                              alt={request.username} 
                              className="h-10 w-10"
                            />
                            <div>
                              <p className="text-sm font-medium text-cybergold-200">{request.username}</p>
                              <p className="text-xs text-cybergold-500">
                                Requested {formatTimeAgo(request.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                              onClick={() => acceptFriendRequest(request.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                              onClick={() => rejectFriendRequest(request.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {outgoingRequests.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-cybergold-300">Outgoing Requests</h3>
                  <ScrollArea className="h-[150px] pr-4">
                    <div className="space-y-2">
                      {outgoingRequests.map(request => (
                        <div 
                          key={request.id} 
                          className="flex items-center justify-between rounded-md p-2 bg-cyberdark-800/30"
                        >
                          <div className="flex items-center gap-3">
                            <UserAvatar 
                              src={request.avatar_url} 
                              alt={request.username} 
                              className="h-10 w-10"
                            />
                            <div>
                              <p className="text-sm font-medium text-cybergold-200">{request.username}</p>
                              <p className="text-xs text-cybergold-500">
                                Sent {formatTimeAgo(request.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-gray-400 hover:text-gray-300"
                              onClick={() => cancelFriendRequest(request.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 px-2 flex items-center gap-1"
                              disabled
                            >
                              <Clock className="h-3 w-3" />
                              <span>Pending</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isAddFriendDialogOpen} onOpenChange={setIsAddFriendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Friend</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by username"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') searchUsers();
                }}
              />
              <Button 
                variant="default"
                onClick={searchUsers}
                disabled={isSearching}
              >
                {isSearching ? (
                  <span className="animate-pulse">Searching...</span>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-1" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {searchResults.length > 0 ? (
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {searchResults.map(user => (
                    <div 
                      key={user.id} 
                      className="flex items-center justify-between p-2 rounded-md hover:bg-cyberdark-800/50"
                    >
                      <div className="flex items-center gap-3">
                        <UserAvatar 
                          src={user.avatar_url} 
                          alt={user.username} 
                          className="h-10 w-10"
                        />
                        <p className="text-sm font-medium">{user.username}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => sendFriendRequest(user.id)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Send Request
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : searchUsername && !isSearching ? (
              <p className="text-center text-sm text-cybergold-500 py-6">
                No users found matching '{searchUsername}'
              </p>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsAddFriendDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedFriendsList;