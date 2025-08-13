
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface GroupInviteButtonProps {
  isOpen: boolean;
  onClose: () => void;
  userProfiles: Record<string, any>;
  friendsList: string[];
  currentUserId: string;
  onInvite: (userId: string) => Promise<void>;
  groupMembers: string[];
  isMobile?: boolean; // Add isMobile property
}

export const GroupInviteButton = ({
  isOpen,
  onClose,
  onInvite,
  userProfiles,
  friendsList,
  currentUserId,
  groupMembers
}: GroupInviteButtonProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClose = () => {
    setSearchQuery("");
    setSelectedUser(null);
    onClose();
  };
  
  const handleInvite = async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    try {
      await onInvite(selectedUser);
      handleClose();
    } catch (error) {
      console.error("Invitation error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter out current user and users already in the group
  const filteredFriends = friendsList.filter(friendId => {
    const profile = userProfiles[friendId];
    const isCurrentUser = friendId === currentUserId;
    const isAlreadyMember = groupMembers.includes(friendId);
    
    return (
      profile && 
      profile.username &&
      profile.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !isCurrentUser &&
      !isAlreadyMember
    );
  });
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="bg-cyberdark-900 border border-cybergold-500/30 text-cybergold-200 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-cybergold-500" />
            <span>Inviter til gruppe</span>
          </DialogTitle>
          <DialogDescription className="text-cybergold-400">
            Velg en venn å invitere til gruppen
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyberdark-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Søk etter venner..."
              className="pl-10 bg-cyberdark-800 border-cybergold-500/30"
            />
          </div>
          
          <div className="h-48 overflow-y-auto border border-cybergold-500/20 rounded-md p-2 bg-cyberdark-800">
            {filteredFriends.length > 0 ? (
              filteredFriends.map(friendId => {
                const profile = userProfiles[friendId];
                const isSelected = selectedUser === friendId;
                
                return (
                  <div 
                    key={friendId}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-cyberdark-700",
                      isSelected && "bg-cyberdark-700"
                    )}
                    onClick={() => setSelectedUser(isSelected ? null : friendId)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-cybergold-500/20">
                        {profile?.avatar_url ? (
                          <AvatarImage 
                            src={supabase.storage.from('avatars').getPublicUrl(profile.avatar_url).data.publicUrl} 
                            alt={profile.username || 'User'} 
                          />
                        ) : (
                          <AvatarFallback className="bg-cybergold-500/20 text-cybergold-300">
                            {(profile.username || 'U')[0].toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="text-sm">{profile.username}</span>
                    </div>
                    
                    {isSelected ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-cybergold-400/40" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <UserPlus className="h-8 w-8 text-cyberdark-400 mb-2" />
                <p className="text-sm text-cyberdark-400">
                  {searchQuery ? 'Ingen venner funnet' : 'Ingen flere venner å invitere'}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="ghost" 
            onClick={handleClose}
            className="text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800"
          >
            <X className="h-4 w-4 mr-2" />
            Avbryt
          </Button>
          <Button 
            onClick={handleInvite}
            className="bg-cybergold-600 hover:bg-cybergold-700 text-black"
            disabled={!selectedUser || isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <UserPlus className="h-4 w-4 mr-2" />
            )}
            Inviter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
