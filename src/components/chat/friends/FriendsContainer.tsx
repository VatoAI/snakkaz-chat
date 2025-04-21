import { useState, useEffect } from "react";
import { FriendsList } from "./FriendsList";
import { FriendRequests } from "./FriendRequests";
import { FriendsSearchSection } from "./FriendsSearchSection";
import { Friend } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useFriendManagement } from "./hooks/useFriendManagement";
import { DecryptedMessage } from "@/types/message";
import { WebRTCManager } from "@/utils/webrtc";
import { QrCodeSection } from "./QrCodeSection";

interface FriendsContainerProps {
  currentUserId: string;
  webRTCManager?: WebRTCManager | null;
  directMessages?: DecryptedMessage[];
  onNewMessage?: (message: DecryptedMessage) => void;
  onStartChat?: (userId: string) => void;
  userProfiles?: Record<string, {username: string | null, avatar_url: string | null}>;
}

export const FriendsContainer = ({
  currentUserId,
  webRTCManager = null,
  directMessages = [],
  onNewMessage = () => {},
  onStartChat,
  userProfiles = {}
}: FriendsContainerProps) => {
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const { toast } = useToast();
  const { handleAcceptFriendRequest, handleRejectFriendRequest } = useFriendManagement(currentUserId);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchFriends = async () => {
      try {
        const { data: friendships, error: friendshipsError } = await supabase
          .from('friendships')
          .select(`
            id,
            user_id,
            friend_id,
            status,
            created_at
          `)
          .or(`user_id.eq.${currentUserId},friend_id.eq.${currentUserId}`)
          .eq('status', 'accepted');
          
        if (friendshipsError) throw friendshipsError;
        
        const formattedFriends: Friend[] = [];
        
        for (const friendship of friendships || []) {
          const profileId = friendship.user_id === currentUserId ? friendship.friend_id : friendship.user_id;
          
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .eq('id', profileId)
            .single();
            
          if (!profileError && profileData) {
            formattedFriends.push({
              id: friendship.id,
              user_id: friendship.user_id,
              friend_id: friendship.friend_id,
              status: friendship.status,
              created_at: friendship.created_at,
              profile: profileData
            });
          }
        }
        
        setFriends(formattedFriends);
        
        const { data: pendingData, error: pendingError } = await supabase
          .from('friendships')
          .select(`
            id,
            user_id,
            friend_id,
            status,
            created_at
          `)
          .eq('friend_id', currentUserId)
          .eq('status', 'pending');
          
        if (pendingError) throw pendingError;
        
        const formattedRequests: Friend[] = [];
        
        for (const request of pendingData || []) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .eq('id', request.user_id)
            .single();
            
          if (!profileError && profileData) {
            formattedRequests.push({
              id: request.id,
              user_id: request.user_id,
              friend_id: request.friend_id,
              status: request.status,
              created_at: request.created_at,
              profile: profileData
            });
          }
        }
        
        setPendingRequests(formattedRequests);
      } catch (error) {
        console.error('Error fetching friends or requests:', error);
      }
    };
    
    fetchFriends();
    
    const friendsChannel = supabase
      .channel('friends-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'friendships',
          filter: `friend_id=eq.${currentUserId}` 
        }, 
        () => {
          fetchFriends();
        }
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'friendships',
          filter: `user_id=eq.${currentUserId}` 
        }, 
        () => {
          fetchFriends();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(friendsChannel);
    };
  }, [currentUserId]);

  const handleSendFriendRequest = async (friendId: string) => {
    try {
      const { data: existingFriendship, error: checkError } = await supabase
        .from('friendships')
        .select('id, status')
        .or(`and(user_id.eq.${currentUserId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${currentUserId})`)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingFriendship) {
        if (existingFriendship.status === 'accepted') {
          toast({
            title: "Dere er allerede venner",
            description: "Denne brukeren er allerede din venn",
          });
        } else {
          toast({
            title: "Forespørsel finnes allerede",
            description: "Det finnes allerede en venneforespørsel mellom dere",
          });
        }
        return;
      }

      const { error: insertError } = await supabase
        .from('friendships')
        .insert({
          user_id: currentUserId,
          friend_id: friendId,
          status: 'pending'
        });

      if (insertError) throw insertError;

      toast({
        title: "Venneforespørsel sendt",
        description: "Du vil få beskjed når brukeren svarer på forespørselen",
      });
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke sende venneforespørsel",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="bg-cyberdark-900 border border-cybergold-500/30 rounded-md overflow-hidden">
        <div className="flex border-b border-cybergold-500/30">
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === "friends"
                ? "bg-cybergold-500/10 text-cybergold-400"
                : "text-cybergold-500/60 hover:bg-cyberdark-800 hover:text-cybergold-400"
            }`}
            onClick={() => setActiveTab("friends")}
          >
            Venner ({friends.length})
          </button>
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === "requests"
                ? "bg-cybergold-500/10 text-cybergold-400"
                : "text-cybergold-500/60 hover:bg-cyberdark-800 hover:text-cybergold-400"
            } relative`}
            onClick={() => setActiveTab("requests")}
          >
            Forespørsler
            {pendingRequests.length > 0 && (
              <span className="absolute top-2 right-2 bg-cybergold-500 text-cyberdark-900 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>
        <div className="p-4">
          {activeTab === "friends" ? (
            friends.length > 0 ? (
              <FriendsList 
                friends={friends} 
                currentUserId={currentUserId}
                webRTCManager={webRTCManager}
                directMessages={directMessages}
                onNewMessage={onNewMessage}
                onStartChat={onStartChat}
                userProfiles={userProfiles}
              />
            ) : (
              <div className="text-center text-cybergold-500 py-4">
                <p>Du har ingen venner ennå.</p>
                <p className="text-sm mt-1">Søk etter brukere for å sende venneforespørsler.</p>
              </div>
            )
          ) : (
            <FriendRequests 
              friendRequests={pendingRequests}
              onAccept={handleAcceptFriendRequest}
              onReject={handleRejectFriendRequest}
            />
          )}
        </div>
      </div>

      <div className="mt-6">
        <QrCodeSection />
      </div>

      <div className="mt-6">
        <FriendsSearchSection 
          currentUserId={currentUserId}
          onSendFriendRequest={handleSendFriendRequest}
        />
      </div>
    </div>
  );
};
