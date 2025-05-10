/**
 * Group List Component
 * 
 * This component displays the list of available groups
 * and allows creating new ones.
 */

import React, { useState } from 'react';
import { useChat } from '../../services/encryption/ChatContext';
import { Button } from '../../components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '../../components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar } from '../../components/ui/avatar';
import { Shield, Plus, Users, Settings, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { GroupSecurityLevel, Group } from '../../services/encryption/groupChatService';

interface GroupListProps {
  onGroupSelect?: (group: Group) => void;
}

export const GroupList: React.FC<GroupListProps> = ({ onGroupSelect }) => {
  // Context
  const { groups, currentGroup, setCurrentGroup, createGroup } = useChat();
  
  // State
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [securityLevel, setSecurityLevel] = useState<string>(GroupSecurityLevel.ENHANCED);
  const [creating, setCreating] = useState(false);
  
  // Create a new group
  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    
    try {
      setCreating(true);
      
      const group = await createGroup(newGroupName, {
        securityLevel,
        isPrivate: true,
        allowMemberInvites: false
      });
      
      // Set as active group
      setCurrentGroup(group);
      
      // Reset form
      setNewGroupName('');
      setSecurityLevel(GroupSecurityLevel.ENHANCED);
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create group:', error);
    } finally {
      setCreating(false);
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-cyberdark-950 border-r border-cyberdark-700">
      {/* Header */}
      <div className="p-4 border-b border-cyberdark-800 flex justify-between items-center">
        <h2 className="font-medium text-cybergold-100">Samtaler</h2>
        <Button 
          size="sm" 
          variant="outline" 
          className="border-cybergold-700 text-cybergold-300"
          onClick={() => setIsCreating(true)}
        >
          <Plus size={16} className="mr-1" /> Ny
        </Button>
      </div>
      
      {/* Groups list */}
      <div className="flex-grow overflow-y-auto">
        {groups.length === 0 ? (
          <div className="p-4 text-center text-cybergold-400 text-sm">
            Ingen samtaler funnet. Opprett en ny samtale for å starte.
          </div>
        ) : (
          <div className="p-2">
            {groups.map(group => (
              <div
                key={group.id}
                className={`rounded-lg p-2 mb-2 cursor-pointer transition-colors duration-200 ${
                  currentGroup?.id === group.id
                    ? 'bg-cybergold-900/20 border border-cybergold-800/40'
                    : 'hover:bg-cyberdark-800'
                }`}
                onClick={() => {
                  setCurrentGroup(group);
                  if (onGroupSelect) {
                    onGroupSelect(group);
                  }
                }}
              >
                <div className="flex items-center">
                  <Avatar className="w-10 h-10 mr-3">
                    <div className="bg-gradient-to-br from-cyberblue-800 to-cyberblue-600 w-full h-full flex items-center justify-center text-white">
                      {group.settings.name.charAt(0)}
                    </div>
                  </Avatar>
                  
                  <div className="flex-grow overflow-hidden">
                    <div className="flex items-center">
                      <h3 className="font-medium text-cybergold-100 truncate">
                        {group.settings.name}
                      </h3>
                      
                      {/* Security indicator */}
                      {group.settings.securityLevel === GroupSecurityLevel.PREMIUM && (
                        <Shield size={14} className="ml-1 text-cybergold-500" />
                      )}
                    </div>
                    
                    <p className="text-xs text-cybergold-400 truncate">
                      {group.members.length} medlemmer • {format(group.createdAt, 'dd.MM.yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Create group dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="bg-cyberdark-900 border-cybergold-900/50">
          <DialogHeader>
            <DialogTitle className="text-cybergold-100">Opprett ny gruppe</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Gruppenavn</Label>
              <Input
                id="name"
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
                placeholder="Skriv inn gruppenavn"
                className="border-cyberdark-600 bg-cyberdark-800"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="security-level">Sikkerhetsnivå</Label>
              <Select 
                value={securityLevel} 
                onValueChange={setSecurityLevel}
              >
                <SelectTrigger className="border-cyberdark-600 bg-cyberdark-800" id="security-level">
                  <SelectValue placeholder="Velg sikkerhetsnivå" />
                </SelectTrigger>
                <SelectContent className="bg-cyberdark-800 border-cyberdark-600">
                  <SelectItem value={GroupSecurityLevel.STANDARD}>
                    <div className="flex items-center">
                      Standard
                    </div>
                  </SelectItem>
                  <SelectItem value={GroupSecurityLevel.ENHANCED}>
                    <div className="flex items-center">
                      Forbedret 🔒
                    </div>
                  </SelectItem>
                  <SelectItem value={GroupSecurityLevel.PREMIUM}>
                    <div className="flex items-center">
                      Premium 🔒
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <p className="text-xs text-cybergold-400 mt-1">
                {securityLevel === GroupSecurityLevel.PREMIUM ? (
                  'Premium: Ende-til-ende-kryptering for meldinger og media med automatisk nøkkelrotasjon.'
                ) : securityLevel === GroupSecurityLevel.ENHANCED ? (
                  'Forbedret: Ende-til-ende-kryptering for meldinger.'
                ) : (
                  'Standard: Grunnleggende serverkryptering.'
                )}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsCreating(false)}
              disabled={creating}
            >
              Avbryt
            </Button>
            <Button
              onClick={handleCreateGroup}
              disabled={!newGroupName.trim() || creating}
            >
              {creating ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Oppretter...
                </>
              ) : (
                <>Opprett gruppe</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
