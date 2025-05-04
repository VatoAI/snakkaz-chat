import { useState } from "react";
import { FriendsList } from "./list/FriendsList";
import { FriendRequests } from "./FriendRequests";
import { FriendsSearchSection } from "./FriendsSearchSection";
import { QrCodeSection } from "./QrCodeSection";
import { DecryptedMessage } from "@/types/message";
import { WebRTCManager } from "@/utils/webrtc";
import { useOptimizedFriends } from "@/hooks/useOptimizedFriends";
import { Badge } from "@/components/ui/badge";
import { Loader2, Share2, QrCode, UsersRound, Bell, Search, UserPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { EmptyFriendsList } from "./list/EmptyFriendsList";
import { supabase } from "@/integrations/supabase/client";

interface FriendsContainerProps {
  currentUserId: string;
  webRTCManager?: WebRTCManager | null;
  directMessages?: DecryptedMessage[];
  onNewMessage?: (message: DecryptedMessage) => void;
  onStartChat?: (userId: string) => void;
  userProfiles?: Record<string, {username: string | null, avatar_url: string | null}>;
  userPresence?: Record<string, { status: string, lastSeen?: string }>;
}

export const FriendsContainer = ({
  currentUserId,
  webRTCManager = null,
  directMessages = [],
  onNewMessage = () => {},
  onStartChat,
  userProfiles = {},
  userPresence = {}
}: FriendsContainerProps) => {
  const [activeTab, setActiveTab] = useState<string>("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddFriendDialog, setShowAddFriendDialog] = useState(false);
  const [friendCodeInput, setFriendCodeInput] = useState("");
  const [isProcessingCode, setIsProcessingCode] = useState(false);
  const [codeError, setCodeError] = useState("");
  
  const {
    friends,
    pendingRequests,
    friendsList,
    loading,
    handleSendFriendRequest,
    handleAcceptFriendRequest,
    handleRejectFriendRequest,
    handleRefresh
  } = useOptimizedFriends(currentUserId);

  const handleStartChat = (userId: string) => {
    if (onStartChat) {
      onStartChat(userId);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredFriends = friends.filter(friend => {
    const searchLower = searchQuery.toLowerCase();
    return (
      friend.username?.toLowerCase().includes(searchLower) ||
      friend.full_name?.toLowerCase().includes(searchLower)
    );
  });

  const handleAddFriendByCode = async () => {
    if (!friendCodeInput.trim()) {
      setCodeError("Vennligst skriv inn en vennekode");
      return;
    }

    setIsProcessingCode(true);
    setCodeError("");
    
    try {
      // Assuming friend codes are stored in a separate table
      const { data, error } = await supabase
        .from('friend_codes')
        .select('user_id')
        .eq('code', friendCodeInput.trim())
        .single();
        
      if (error) {
        setCodeError("Ugyldig vennekode");
        return;
      }
      
      if (data.user_id === currentUserId) {
        setCodeError("Du kan ikke legge til deg selv som venn");
        return;
      }
      
      // Send friend request
      await handleSendFriendRequest(data.user_id);
      
      // Success - close dialog
      setShowAddFriendDialog(false);
      setFriendCodeInput("");
    } catch (error) {
      console.error("Error adding friend by code:", error);
      setCodeError("Det oppstod en feil. Vennligst prøv igjen senere.");
    } finally {
      setIsProcessingCode(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 text-cybergold-400 animate-spin" />
          <span className="ml-2 text-cybergold-400">Laster inn venner...</span>
        </div>
      ) : (
        <Tabs defaultValue="friends" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-cyberdark-900 border border-cybergold-500/30">
              <TabsTrigger 
                value="friends" 
                className={cn(
                  "data-[state=active]:bg-cybergold-500/10 data-[state=active]:text-cybergold-400",
                  "text-cybergold-500/60"
                )}
              >
                <UsersRound className="h-4 w-4 mr-2" />
                Venner
                <Badge className="ml-2 bg-cyberdark-700 text-xs" variant="outline">
                  {friends.length}
                </Badge>
              </TabsTrigger>
              
              <TabsTrigger 
                value="requests" 
                className={cn(
                  "data-[state=active]:bg-cybergold-500/10 data-[state=active]:text-cybergold-400",
                  "text-cybergold-500/60 relative"
                )}
              >
                <Bell className="h-4 w-4 mr-2" />
                Forespørsler
                {pendingRequests.length > 0 && (
                  <Badge className="ml-2 bg-cyberred-800 text-xs text-white" variant="destructive">
                    {pendingRequests.length}
                  </Badge>
                )}
              </TabsTrigger>
              
              <TabsTrigger 
                value="qrcode" 
                className={cn(
                  "data-[state=active]:bg-cybergold-500/10 data-[state=active]:text-cybergold-400",
                  "text-cybergold-500/60"
                )}
              >
                <QrCode className="h-4 w-4 mr-2" />
                QR-kode
              </TabsTrigger>
            </TabsList>
            
            <Button
              variant="outline" 
              size="sm"
              className="bg-transparent border-cybergold-500/50 text-cybergold-400 hover:bg-cyberdark-800 hover:text-cybergold-300"
              onClick={() => setShowAddFriendDialog(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Legg til venn
            </Button>
          </div>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-cybergold-500/70" />
              <Input
                placeholder="Søk etter venner..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-9 bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200"
              />
            </div>
          </div>
          
          <TabsContent value="friends" className="mt-0">
            {friends.length > 0 && (
              <FriendsList
                friends={filteredFriends}
                friendsList={friendsList}
                currentUserId={currentUserId}
                webRTCManager={webRTCManager}
                directMessages={directMessages}
                onNewMessage={onNewMessage}
                onSelectFriend={handleFriendSelect}
                selectedFriendId={selectedFriendId}
                userProfiles={userProfiles}
                userPresence={userPresence}
              />
            )}
            {friends.length === 0 && !loading && (
              <EmptyState currentUserId={currentUserId} />
            )}
          </TabsContent>
          
          <TabsContent value="requests" className="mt-0">
            {pendingRequests.length === 0 ? (
              <div className="text-center text-cybergold-500 py-6 bg-cyberdark-800/40 rounded-md p-4">
                <div className="mb-2 flex justify-center">
                  <Bell className="h-10 w-10 text-cybergold-400/50" />
                </div>
                <p>Du har ingen venneforespørsler.</p>
              </div>
            ) : (
              <FriendRequests 
                friendRequests={pendingRequests}
                onAccept={handleAcceptFriendRequest}
                onReject={handleRejectFriendRequest}
                userProfiles={userProfiles}
              />
            )}
          </TabsContent>
          
          <TabsContent value="qrcode" className="mt-0">
            <QrCodeSection currentUserId={currentUserId} />
          </TabsContent>
        </Tabs>
      )}

      <div className="mt-6">
        <FriendsSearchSection 
          currentUserId={currentUserId}
          onSendFriendRequest={handleSendFriendRequest}
          existingFriends={friendsList}
        />
      </div>
      
      {/* Add Friend Dialog */}
      <Dialog open={showAddFriendDialog} onOpenChange={setShowAddFriendDialog}>
        <DialogContent className="bg-cyberdark-900 border-cybergold-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-cybergold-400 flex items-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Legg til venn med kode
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Skriv inn vennekoden for å sende en venneforespørsel
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Vennekode (f.eks. SNKZ-1234-ABCD)"
                value={friendCodeInput}
                onChange={(e) => {
                  setFriendCodeInput(e.target.value);
                  setCodeError("");
                }}
                className="bg-cyberdark-800 border-cybergold-500/30 text-white"
              />
              {codeError && (
                <p className="text-xs text-red-400">{codeError}</p>
              )}
            </div>
            
            <div className="flex items-center text-xs text-gray-400">
              <Share2 className="h-4 w-4 mr-1" />
              <span>Du kan også skanne en QR-kode i "QR-kode"-fanen</span>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-cyberdark-700 text-gray-300"
              >
                Avbryt
              </Button>
            </DialogClose>
            <Button
              onClick={handleAddFriendByCode}
              disabled={isProcessingCode}
              className="bg-cybergold-600 hover:bg-cybergold-700 text-black"
            >
              {isProcessingCode ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Behandler...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Legg til venn
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface EmptyStateProps {
  currentUserId: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ currentUserId }) => (
  <div className="text-center text-cybergold-500 py-6 bg-cyberdark-800/40 rounded-md p-4">
    <div className="mb-2 flex justify-center">
      <UsersRound className="h-10 w-10 text-cybergold-400/50" />
    </div>
    <p>Du har ingen venner.</p>
  </div>
);
