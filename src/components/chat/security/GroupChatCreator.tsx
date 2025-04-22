
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SecurityLevelSelector } from "./SecurityLevelSelector";
import { SecurityLevel } from "@/types/security";

interface GroupChatCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (name: string, members: string[], securityLevel: SecurityLevel) => void;
  currentUserId: string;
  userProfiles: Record<string, {username: string | null, avatar_url: string | null}>;
  friendsList: string[];
}

export const GroupChatCreator = ({
  isOpen,
  onClose,
  onCreateGroup,
  currentUserId,
  userProfiles,
  friendsList
}: GroupChatCreatorProps) => {
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>('server_e2ee');
  
  const handleClose = () => {
    setGroupName("");
    setSelectedMembers([]);
    setSearchQuery("");
    onClose();
  };
  
  const handleCreateGroup = () => {
    if (groupName.trim() === '') {
      return;
    }
    
    onCreateGroup(groupName, selectedMembers, securityLevel);
    handleClose();
  };
  
  const toggleFriendSelection = (friendId: string) => {
    if (selectedMembers.includes(friendId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== friendId));
    } else {
      setSelectedMembers([...selectedMembers, friendId]);
    }
  };
  
  const filteredFriends = friendsList.filter(friendId => {
    const profile = userProfiles[friendId];
    return (
      profile && 
      profile.username &&
      profile.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="bg-cyberdark-900 border border-cybergold-500/30 text-cybergold-200 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Opprett ny gruppe</DialogTitle>
          <DialogDescription className="text-cybergold-400">
            Legg til venner i gruppen og velg sikkerhetsnivå.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div>
            <label htmlFor="group-name" className="text-sm font-medium block mb-1">
              Gruppenavn
            </label>
            <Input
              id="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Skriv et gruppenavn..."
              className="bg-cyberdark-800 border-cybergold-500/30"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">
              Sikkerhetsnivå
            </label>
            <SecurityLevelSelector 
              value={securityLevel}
              onChange={setSecurityLevel}
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">
                Legg til medlemmer
              </label>
              <span className="text-xs text-cybergold-400">
                {selectedMembers.length} valgt
              </span>
            </div>
            
            <div className="relative mb-2">
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
                  const isSelected = selectedMembers.includes(friendId);
                  
                  return (
                    <div 
                      key={friendId}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-cyberdark-700 ${
                        isSelected ? 'bg-cyberdark-700' : ''
                      }`}
                      onClick={() => toggleFriendSelection(friendId)}
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
                  <Users className="h-8 w-8 text-cyberdark-400 mb-2" />
                  <p className="text-sm text-cyberdark-400">
                    {searchQuery ? 'Ingen venner funnet' : 'Du har ingen venner å legge til ennå'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="pt-2">
          <Button 
            variant="ghost" 
            onClick={handleClose}
            className="text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800"
          >
            <X className="h-4 w-4 mr-2" />
            Avbryt
          </Button>
          <Button 
            onClick={handleCreateGroup}
            className="bg-cybergold-600 hover:bg-cybergold-700 text-black"
            disabled={groupName.trim() === '' || selectedMembers.length === 0}
          >
            <Check className="h-4 w-4 mr-2" />
            Opprett gruppe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
