import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  UserPlus, 
  UserMinus, 
  Search, 
  UserCheck, 
  X, 
  Check, 
  RefreshCw,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalPresence } from '@/contexts/PresenceContext';
import { format, formatDistanceToNow } from 'date-fns';

interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  profile: {
    id: string;
    username: string;
    avatar_url: string | null;
    full_name: string | null;
  };
  status: string;
  created_at: string;
}

interface EnhancedFriendsListProps {
  friends: Friend[];
  friendRequests?: any[];
  loading: boolean;
  lastRefreshed: Date | null;
  onStartChat: (friendId: string) => void;
  onUnfriend: (friendId: string) => void;
  onAcceptRequest?: (requestId: string) => void;
  onRejectRequest?: (requestId: string) => void;
  onSendRequest?: (username: string) => void;
  onRefresh: () => void;
  userId: string | null | undefined;
}

export const EnhancedFriendsList: React.FC<EnhancedFriendsListProps> = ({
  friends,
  friendRequests = [],
  loading,
  lastRefreshed,
  onStartChat,
  onUnfriend,
  onAcceptRequest,
  onRejectRequest,
  onSendRequest,
  onRefresh,
  userId
}) => {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [newFriendUsername, setNewFriendUsername] = useState('');
  const { userStatuses } = useGlobalPresence();
  
  // Filter friends based on search and tab
  const filteredFriends = React.useMemo(() => {
    return friends.filter(friend => {
      const matchesSearch = search.trim() === '' || 
        friend.profile?.username?.toLowerCase().includes(search.toLowerCase()) ||
        friend.profile?.full_name?.toLowerCase().includes(search.toLowerCase());
      
      const matchesTab = tab === 'all' || 
        (tab === 'online' && (userStatuses[friend.profile?.id] === 'online' || friend.status === 'online')) || 
        (tab === 'offline' && (userStatuses[friend.profile?.id] === 'offline' || friend.status === 'offline'));
        
      return matchesSearch && matchesTab;
    });
  }, [friends, search, tab, userStatuses]);
  
  // Status indicator component
  const StatusIndicator = ({ status }: { status: string }) => {
    const color = status === 'online' ? 'bg-green-500' : 'bg-gray-400';
    return (
      <span className={`absolute bottom-0 right-0 w-3 h-3 ${color} border-2 border-white rounded-full`}></span>
    );
  };
  
  // Friend card component
  const FriendCard = ({ friend }: { friend: Friend }) => {
    const friendId = friend.user_id === userId ? friend.friend_id : friend.user_id;
    const friendStatus = userStatuses[friendId] || friend.status || 'offline';
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        className="w-full"
      >
        <Card className="mb-2 hover:bg-gray-50/5 transition-all border-gray-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10 border border-gray-700">
                  <AvatarImage src={friend.profile?.avatar_url || ''} />
                  <AvatarFallback className="bg-gradient-to-br from-cyberblue-500 to-cyberblue-700 text-white">
                    {friend.profile?.username?.substring(0, 2)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <StatusIndicator status={friendStatus} />
              </div>
              <div>
                <div className="font-medium text-white">
                  {friend.profile?.username || 'Unknown'}
                </div>
                <div className="text-xs text-gray-400">
                  {friend.profile?.full_name}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-300 hover:text-white hover:bg-cyberblue-700/30"
                onClick={() => onStartChat(friendId)}
              >
                <MessageSquare size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-300 hover:text-red-500 hover:bg-red-700/20"
                onClick={() => onUnfriend(friendId)}
              >
                <UserMinus size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };
  
  // Request card component
  const RequestCard = ({ request }: { request: any }) => {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        className="w-full"
      >
        <Card className="mb-2 hover:bg-gray-50/5 transition-all border-gray-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border border-gray-700">
                <AvatarImage src={request.sender?.avatar_url || ''} />
                <AvatarFallback className="bg-gradient-to-br from-cyberred-500 to-cyberred-700 text-white">
                  {request.sender?.username?.substring(0, 2)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-white flex items-center gap-2">
                  {request.sender?.username || 'Unknown'}
                  <Badge variant="outline" className="bg-cyberred-900/50 text-cyberred-300 text-[10px] py-0 px-1.5">
                    REQUEST
                  </Badge>
                </div>
                <div className="text-xs text-gray-400">
                  Requested {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-300 hover:text-green-500 hover:bg-green-700/20"
                onClick={() => onAcceptRequest && onAcceptRequest(request.id)}
              >
                <Check size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-300 hover:text-red-500 hover:bg-red-700/20"
                onClick={() => onRejectRequest && onRejectRequest(request.id)}
              >
                <X size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Card className="w-full border-gray-800 bg-gray-950/60 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white">Friends</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-300 hover:text-white"
            onClick={onRefresh}
          >
            <RefreshCw size={16} className="mr-1" />
            Refresh
          </Button>
        </div>
        <CardDescription>
          {lastRefreshed ? (
            <span className="flex items-center text-xs text-gray-400">
              <Clock size={12} className="mr-1" />
              Last updated {formatDistanceToNow(lastRefreshed, { addSuffix: true })}
            </span>
          ) : (
            'Manage your connections'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full mb-4 bg-gray-900 border-gray-800">
            <TabsTrigger 
              value="all" 
              className="flex-1 data-[state=active]:bg-cyberblue-600 data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="online" 
              className="flex-1 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Online
            </TabsTrigger>
            <TabsTrigger 
              value="offline" 
              className="flex-1 data-[state=active]:bg-gray-600 data-[state=active]:text-white"
            >
              Offline
            </TabsTrigger>
            <TabsTrigger 
              value="requests" 
              className="flex-1 data-[state=active]:bg-cyberred-600 data-[state=active]:text-white"
            >
              Requests
              {friendRequests.length > 0 && (
                <Badge className="ml-1 bg-cyberred-500 hover:bg-cyberred-600">
                  {friendRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <div className="mb-4">
            <div className="relative">
              <Input
                placeholder={tab === 'requests' ? "Find new friends..." : "Search friends..."}
                value={tab === 'requests' ? newFriendUsername : search}
                onChange={(e) => tab === 'requests' ? setNewFriendUsername(e.target.value) : setSearch(e.target.value)}
                className="pl-9 bg-gray-900 border-gray-800 text-white"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={16} />
              </div>
              {tab === 'requests' && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Button 
                    size="sm" 
                    className="h-7 px-3 bg-cyberblue-600 hover:bg-cyberblue-700 text-white"
                    onClick={() => {
                      if (newFriendUsername.trim() && onSendRequest) {
                        onSendRequest(newFriendUsername.trim());
                        setNewFriendUsername('');
                      }
                    }}
                  >
                    <UserPlus size={14} className="mr-1" />
                    Add
                  </Button>
                </div>
              )}
            </div>
          </div>

          <TabsContent value="requests" className="m-0">
            {friendRequests.length > 0 ? (
              <div className="space-y-2">
                <AnimatePresence>
                  {friendRequests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                <UserCheck size={40} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No pending friend requests</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value={tab !== 'requests' ? tab : 'all'} className="m-0">
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredFriends.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 pb-1 custom-scrollbar">
                <AnimatePresence>
                  {filteredFriends.map((friend) => (
                    <FriendCard key={friend.id} friend={friend} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                <Search size={40} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {search.trim() ? 
                    "No matching friends found" : 
                    tab === 'online' ? 
                      "No friends are currently online" : 
                      tab === 'offline' ? 
                        "All your friends are online!" : 
                        "You haven't added any friends yet"}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-gray-500">
        <p>Add friends to start chatting with them</p>
      </CardFooter>
    </Card>
  );
};