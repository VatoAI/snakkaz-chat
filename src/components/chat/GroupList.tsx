/**
 * Group List Component
 * 
 * This component displays the list of available groups
 * and allows creating new ones.
 */

import React, { useState, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
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
import { Shield, Plus, Users, Settings, Loader2, Search, Lock, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { GroupSecurityLevel, Group } from '../../services/encryption/groupChatService';
import { AuthButton } from './LoginButton';

// CSS Animasjoner
const animations = {
  fadeIn: `animate-[fadeIn_0.3s_ease-in-out]`,
  slideIn: `animate-[slideIn_0.3s_ease-in-out]`,
  pulse: `animate-[pulse_2s_ease-in-out_infinite]`,
  popIn: `animate-[popIn_0.2s_cubic-bezier(0.175,0.885,0.32,1.275)]`
};

// Hover effekt for grupper
const groupCardHover = `
  transition-all duration-200 
  hover:bg-opacity-20 hover:bg-primary 
  hover:shadow-lg
  hover:scale-[1.02]
  hover:translate-x-[2px]
  hover:border-cybergold-500
`;

// Keyframes for animasjoner
const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideIn {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes popIn {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

// Sikkerhetsnivå farger
const securityLevelColors = {
  standard: 'bg-gray-500',
  enhanced: 'bg-blue-600',
  premium: 'bg-gradient-to-r from-cybergold-500 to-cybergold-300'
};

interface GroupListProps {
  onGroupSelect?: (group: Group) => void;
}

export const GroupList: React.FC<GroupListProps> = ({ onGroupSelect }) => {
  // Context
  const { groups, currentGroup, setCurrentGroup, createGroup, currentUser } = useChat();
  
  // State
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [securityLevel, setSecurityLevel] = useState<string>(GroupSecurityLevel.ENHANCED);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);
  
  // Legg til animasjonsstiler i dokument om de ikke allerede eksisterer
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const styleId = 'snakkaz-group-animations';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = keyframes;
        document.head.appendChild(style);
      }
      
      // Fjern animering etter 1 sekund
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, []);
  
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
  
  // Filtrer grupper basert på søkeuttrykk
  const filteredGroups = groups.filter(group => 
    group.settings.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-cyberdark-950 to-cyberdark-900 border-r border-cyberdark-700">
      {/* Header */}
      <div className="p-4 border-b border-cyberdark-800 bg-cyberdark-900 bg-opacity-70">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-medium text-cybergold-100 flex items-center gap-2">
            <MessageSquare size={18} className="text-cybergold-500" />
            <span>Krypterte Samtaler</span>
          </h2>
          
          {/* Login/Logout Button */}
          <div className="ml-auto">
            <AuthButton 
              user={currentUser} 
              size="sm" 
              variant="ghost" 
              showIcon={true} 
              onLogout={() => {
                // Reset app state on logout if needed
                setCurrentGroup(null);
              }}
            />
          </div>
        </div>
        {/* Search input */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cybergold-500" size={16} />
          <Input 
            placeholder="Søk etter samtaler..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-cyberdark-800 border-cyberdark-700 text-cybergold-200 placeholder:text-cybergold-600"
            disabled={!currentUser}
          />
        </div>
        
        {currentUser ? (
          <Button 
            size="sm" 
            variant="outline" 
            className="border-cybergold-700 text-cybergold-300 w-full hover:bg-cybergold-900 hover:text-cybergold-100 flex items-center justify-center gap-2"
            onClick={() => setIsCreating(true)}
          >
            <Plus size={16} className="mr-1" /> Ny
          </Button>
        ) : (
          <div className="text-center text-cybergold-400 text-sm py-2">
            Logg inn for å opprette samtaler
          </div>
        )}
      </div>
      
      {/* Groups list */}
      <div className="flex-grow overflow-y-auto p-2">
        {!currentUser ? (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="bg-cyberdark-800 bg-opacity-70 border border-cyberdark-700 rounded-xl p-6 text-center max-w-md mx-auto">
              <Shield size={48} className="text-cybergold-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-cybergold-100 mb-2">Sikre samtaler med Snakkaz</h3>
              <p className="text-sm text-cybergold-300 mb-4">
                Logg inn for å få tilgang til ende-til-ende krypterte samtaler med full sikkerhet.
              </p>
              <div className="mt-4">
                <AuthButton 
                  user={currentUser} 
                  size="lg" 
                  fullWidth 
                  className="mx-auto"
                />
              </div>
            </div>
          </div>
        ) : groups.length === 0 ? (
          <div className={`p-4 text-center text-cybergold-400 text-sm rounded-lg my-4 mx-2 bg-cyberdark-800 bg-opacity-50 border border-dashed border-cyberdark-700 ${animations.fadeIn}`}>
            Ingen samtaler funnet. Opprett en ny samtale for å starte.
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className={`p-4 text-center text-cybergold-400 text-sm rounded-lg my-4 mx-2 bg-cyberdark-800 bg-opacity-50 border border-dashed border-cyberdark-700 ${animations.fadeIn}`}>
            Ingen samtaler funnet med søket: <span className="font-medium text-cybergold-300">{searchTerm}</span>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredGroups.map((group, index) => (
              <div
                key={group.id}
                className={`rounded-lg p-3 mb-2 cursor-pointer transition-all duration-200 border border-transparent ${
                  isAnimating ? animations.slideIn : ''
                } ${groupCardHover} ${
                  currentGroup?.id === group.id
                    ? 'bg-gradient-to-r from-cybergold-900/30 to-cyberdark-800 border-l-2 border-cybergold-600'
                    : 'hover:bg-cyberdark-800 hover:border-l-2 hover:border-cybergold-800'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => {
                  setCurrentGroup(group);
                  if (onGroupSelect) {
                    onGroupSelect(group);
                  }
                }}
              >
                <div className="flex items-center">
                  <Avatar className="w-10 h-10 mr-3 ring-1 ring-offset-1 ring-offset-background ring-cybergold-800">
                    <div className={`bg-gradient-to-br from-cyberblue-800 to-cyberblue-600 w-full h-full flex items-center justify-center text-white font-medium ${currentGroup?.id === group.id ? 'scale-110 transition-transform duration-300' : ''}`}>
                      {group.settings.name.charAt(0)}
                    </div>
                  </Avatar>
                  
                  <div className="flex-grow overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-cybergold-100 truncate">
                        {group.settings.name}
                      </h3>
                      
                      {/* Security level badge */}
                      <div className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                        group.settings.securityLevel === GroupSecurityLevel.PREMIUM 
                          ? 'bg-gradient-to-r from-cybergold-700 to-cybergold-500 text-black'
                          : group.settings.securityLevel === GroupSecurityLevel.ENHANCED
                            ? 'bg-blue-900 text-blue-100'
                            : 'bg-gray-800 text-gray-200'
                      }`}>
                        {group.settings.securityLevel === GroupSecurityLevel.PREMIUM 
                          ? <span className="flex items-center"><Lock size={10} className="mr-1" /> Premium</span>
                          : group.settings.securityLevel === GroupSecurityLevel.ENHANCED
                            ? 'Forbedret'
                            : 'Standard'
                        }
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-cybergold-400">
                      <Users size={12} className="mr-1" /> 
                      <span className="truncate">{group.members.length} medlemmer</span>
                      <span className="mx-1">•</span>
                      <span className="text-cybergold-500">{format(group.createdAt, 'dd.MM.yyyy')}</span>
                    </div>
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
