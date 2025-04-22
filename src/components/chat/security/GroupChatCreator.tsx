
import { useState } from 'react';
import { X, Users, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SecurityLevelSelector } from './SecurityLevelSelector';
import { SecurityLevel } from '@/types/security';
import { supabase } from "@/integrations/supabase/client";

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
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>('server_e2ee');
  
  const resetForm = () => {
    setGroupName('');
    setSelectedMembers([]);
    setSecurityLevel('server_e2ee');
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handleCreateGroup = () => {
    if (groupName.trim() && selectedMembers.length > 0) {
      onCreateGroup(groupName, selectedMembers, securityLevel);
      handleClose();
    }
  };
  
  const toggleMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };
  
  const isCreateDisabled = groupName.trim() === '' || selectedMembers.length === 0;
  
  return (
    <Dialog open={isOpen} onOpenChange={() => handleClose()}>
      <DialogContent className="bg-cyberdark-900 text-cybergold-200 border-cybergold-500/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-cybergold-300 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Opprett ny gruppesamtale
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="group-name">Gruppenavn</Label>
            <Input
              id="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Skriv navn på gruppen..."
              className="bg-cyberdark-800 border-cybergold-500/30"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Sikkerhetsnivå</Label>
            <SecurityLevelSelector
              value={securityLevel}
              onChange={setSecurityLevel}
            />
            {securityLevel === 'p2p_e2ee' && (
              <p className="text-xs text-amber-400 mt-1">
                Merk: P2P kan være ustabilt med mange deltakere. Server + E2EE anbefales for grupper.
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Legg til medlemmer</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedMembers.map(memberId => {
                const profile = userProfiles[memberId];
                return (
                  <Badge 
                    key={memberId}
                    className="bg-cybergold-500/20 hover:bg-cybergold-500/30 text-cybergold-300 flex items-center gap-1"
                  >
                    {profile?.username || 'Ukjent bruker'}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => toggleMember(memberId)}
                    />
                  </Badge>
                );
              })}
            </div>
            
            <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
              {friendsList.map(friendId => {
                const profile = userProfiles[friendId];
                const isSelected = selectedMembers.includes(friendId);
                
                if (!profile) return null;
                
                return (
                  <div
                    key={friendId}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                      isSelected ? 'bg-cybergold-500/20' : 'bg-cyberdark-800 hover:bg-cyberdark-700'
                    }`}
                    onClick={() => toggleMember(friendId)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        {profile.avatar_url ? (
                          <AvatarImage 
                            src={supabase.storage.from('avatars').getPublicUrl(profile.avatar_url).data.publicUrl} 
                            alt={profile.username || 'User'}
                          />
                        ) : (
                          <AvatarFallback className="bg-cybergold-500/20 text-cybergold-300 text-xs">
                            {(profile.username || 'U')[0].toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="text-sm text-cybergold-200">
                        {profile.username || 'Ukjent bruker'}
                      </span>
                    </div>
                    
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className={`h-6 w-6 ${isSelected ? 'text-cybergold-300' : 'text-cyberdark-400'}`}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-cybergold-500/30 text-cybergold-300 hover:bg-cyberdark-800"
          >
            Avbryt
          </Button>
          <Button
            onClick={handleCreateGroup}
            disabled={isCreateDisabled}
            className="bg-cybergold-600 hover:bg-cybergold-700 text-cyberdark-900"
          >
            Opprett Gruppe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
