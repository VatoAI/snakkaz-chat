import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { UserPlus, Check, X, Clock, UserRoundX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserAvatar } from '@/components/ui/user-avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface FriendRequest {
  id: string;
  sender_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  sender?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  recipient?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface EnhancedFriendRequestHandlerProps {
  currentUserId: string;
  onRequestAccepted?: (userId: string) => void;
  onRequestRejected?: (userId: string) => void;
  onRequestCancelled?: (userId: string) => void;
}

export const EnhancedFriendRequestHandler: React.FC<EnhancedFriendRequestHandlerProps> = ({
  currentUserId,
  onRequestAccepted,
  onRequestRejected,
  onRequestCancelled
}) => {
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUserId) {
      fetchFriendRequests();
    }
  }, [currentUserId]);

  const fetchFriendRequests = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, fetch incoming requests from Supabase
      // For now, let's use demo data
      const incomingResponse = {
        data: [
          {
            id: "req_in1",
            sender_id: "user1",
            recipient_id: currentUserId,
            status: "pending",
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            sender: {
              id: "user1",
              username: "emma_newuser",
              avatar_url: "/avatars/emma.png",
            }
          },
          {
            id: "req_in2",
            sender_id: "user2",
            recipient_id: currentUserId,
            status: "pending",
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            sender: {
              id: "user2",
              username: "jake_smith",
              avatar_url: "/avatars/jake.png",
            }
          }
        ],
        error: null
      };

      const outgoingResponse = {
        data: [
          {
            id: "req_out1",
            sender_id: currentUserId,
            recipient_id: "user3",
            status: "pending",
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            recipient: {
              id: "user3",
              username: "david_code",
              avatar_url: "/avatars/david.png",
            }
          }
        ],
        error: null
      };

      if (incomingResponse.error) {
        throw new Error(incomingResponse.error.message);
      }
      if (outgoingResponse.error) {
        throw new Error(outgoingResponse.error.message);
      }

      setIncomingRequests(incomingResponse.data as FriendRequest[]);
      setOutgoingRequests(outgoingResponse.data as FriendRequest[]);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      toast({
        title: "Error",
        description: "Failed to load friend requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const acceptFriendRequest = async (requestId: string, senderId: string) => {
    try {
      // In a real implementation, this would accept the request in Supabase
      // For demo purposes, we'll just update the local state
      
      setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
      
      toast({
        title: "Request Accepted",
        description: "Friend request accepted successfully!",
      });
      
      if (onRequestAccepted) {
        onRequestAccepted(senderId);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast({
        title: "Error",
        description: "Failed to accept friend request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const rejectFriendRequest = async (requestId: string, senderId: string) => {
    try {
      // In a real implementation, this would reject the request in Supabase
      // For demo purposes, we'll just update the local state
      
      setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
      
      toast({
        title: "Request Rejected",
        description: "Friend request rejected.",
      });
      
      if (onRequestRejected) {
        onRequestRejected(senderId);
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast({
        title: "Error",
        description: "Failed to reject friend request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cancelFriendRequest = async (requestId: string, recipientId: string) => {
    try {
      // In a real implementation, this would cancel the request in Supabase
      // For demo purposes, we'll just update the local state
      
      setOutgoingRequests(prev => prev.filter(req => req.id !== requestId));
      
      toast({
        title: "Request Cancelled",
        description: "Friend request cancelled.",
      });
      
      if (onRequestCancelled) {
        onRequestCancelled(recipientId);
      }
    } catch (error) {
      console.error("Error cancelling friend request:", error);
      toast({
        title: "Error",
        description: "Failed to cancel friend request. Please try again.",
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
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading requests...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Incoming Friend Requests */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <UserPlus className="h-4 w-4 text-cybergold-200" />
          <h3 className="font-medium text-cybergold-100">Incoming Requests</h3>
          {incomingRequests.length > 0 && (
            <Badge variant="default" className="bg-cybergold-500 text-black">
              {incomingRequests.length}
            </Badge>
          )}
        </div>

        {incomingRequests.length === 0 ? (
          <div className="text-sm text-muted-foreground p-2">
            No incoming friend requests
          </div>
        ) : (
          <ScrollArea className="h-[150px]">
            <div className="space-y-2">
              {incomingRequests.map((request) => (
                <div 
                  key={request.id}
                  className="flex items-center justify-between p-2 rounded-md bg-background/50 hover:bg-background/70"
                >
                  <div className="flex items-center gap-2">
                    <UserAvatar 
                      src={request.sender?.avatar_url} 
                      fallback={request.sender?.username?.[0] || '?'}
                      className="h-8 w-8" 
                    />
                    <div>
                      <p className="text-sm font-medium">{request.sender?.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(request.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-green-500 hover:text-green-600 hover:bg-green-200/10"
                      onClick={() => acceptFriendRequest(request.id, request.sender_id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-200/10"
                      onClick={() => rejectFriendRequest(request.id, request.sender_id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Outgoing Friend Requests */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-cybergold-200" />
          <h3 className="font-medium text-cybergold-100">Pending Sent</h3>
          {outgoingRequests.length > 0 && (
            <Badge variant="outline" className="text-cybergold-200 border-cybergold-200">
              {outgoingRequests.length}
            </Badge>
          )}
        </div>

        {outgoingRequests.length === 0 ? (
          <div className="text-sm text-muted-foreground p-2">
            No pending sent requests
          </div>
        ) : (
          <ScrollArea className="h-[100px]">
            <div className="space-y-2">
              {outgoingRequests.map((request) => (
                <div 
                  key={request.id}
                  className="flex items-center justify-between p-2 rounded-md bg-background/50 hover:bg-background/70"
                >
                  <div className="flex items-center gap-2">
                    <UserAvatar 
                      src={request.recipient?.avatar_url} 
                      fallback={request.recipient?.username?.[0] || '?'} 
                      className="h-8 w-8" 
                    />
                    <div>
                      <p className="text-sm font-medium">{request.recipient?.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(request.created_at)}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-amber-500 hover:text-amber-600 hover:bg-amber-200/10"
                    onClick={() => cancelFriendRequest(request.id, request.recipient_id)}
                  >
                    <UserRoundX className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default EnhancedFriendRequestHandler;