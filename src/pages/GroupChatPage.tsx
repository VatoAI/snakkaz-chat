import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useGroups } from '@/hooks/useGroups';
import { useGroupChat } from '@/hooks/useGroupChat';
import { useProfiles } from '@/hooks/useProfiles';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Users,
  UserPlus,
  Plus,
  Search,
  MessageSquare,
  Lock,
  Shield,
  Star,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const GroupChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { userProfiles, fetchProfiles } = useProfiles();
  
  // State for active group
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isJoiningGroup, setIsJoiningGroup] = useState(false);
  const [groupPassword, setGroupPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get groups
  const { 
    groups, 
    loadGroups, 
    createGroup, 
    joinGroup,
    loading: groupsLoading 
  } = useGroups({
    userId: user?.id || ''
  });
  
  // Filter groups based on search
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Load group messages when selected
  const {
    messages: groupMessages,
    sendMessage,
    loading: messagesLoading
  } = useGroupChat(selectedGroup?.id);
  
  useEffect(() => {
    if (user?.id) {
      loadGroups();
      fetchProfiles();
    }
  }, [user?.id]);
  
  // If URL includes a group ID, select that group
  useEffect(() => {
    if (id && groups.length > 0) {
      const group = groups.find(g => g.id === id);
      if (group) {
        setSelectedGroup(group);
      }
    }
  }, [id, groups]);

  const handleCreateGroup = async (data: any) => {
    try {
      const newGroup = await createGroup({
        name: data.name,
        description: data.description,
        isPrivate: data.isPrivate,
        password: data.password,
        members: data.members
      });
      
      toast({
        title: "Gruppe opprettet",
        description: `Gruppen "${data.name}" er opprettet`,
      });
      
      setSelectedGroup(newGroup);
      setIsCreatingGroup(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Feil ved oppretting av gruppe",
        description: error.message || "Kunne ikke opprette gruppen",
      });
    }
  };
  
  const handleJoinGroup = async (groupId: string, password?: string) => {
    try {
      await joinGroup(groupId, password);
      
      const joinedGroup = groups.find(g => g.id === groupId);
      if (joinedGroup) {
        setSelectedGroup(joinedGroup);
        toast({
          title: "Gruppe tilgang",
          description: `Du har blitt med i "${joinedGroup.name}"`,
        });
      }
      
      setIsJoiningGroup(false);
      setGroupPassword('');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Feil ved tilkobling til gruppe",
        description: error.message || "Kunne ikke bli med i gruppen",
      });
    }
  };
  
  const handleSendMessage = async (text: string, file?: File) => {
    if (!selectedGroup) return;
    
    try {
      await sendMessage({
        text,
        mediaFile: file,
        groupId: selectedGroup.id
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Feil ved sending av melding",
        description: error.message || "Kunne ikke sende meldingen",
      });
    }
  };
  
  // Render group list if no group is selected
  if (!selectedGroup) {
    return (
      <div className="container max-w-6xl mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-cybergold-300">Gruppechatter</h1>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-cybergold-500/30 text-cybergold-400"
              onClick={() => setIsJoiningGroup(true)}
            >
              <Users className="h-4 w-4 mr-2" />
              Bli med i gruppe
            </Button>
            
            <Button
              className="bg-cybergold-600 text-black hover:bg-cybergold-700"
              onClick={() => setIsCreatingGroup(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Opprett ny gruppe
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cybergold-500" size={18} />
          <Input
            type="text"
            placeholder="Søk etter grupper..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-cyberdark-800 border-cybergold-500/30 text-cybergold-300"
          />
        </div>
        
        {/* Group list */}
        {groupsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cybergold-400" />
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-cyberdark-800 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-cybergold-500/70" />
            </div>
            <h3 className="text-xl font-medium text-cybergold-300 mb-2">Ingen grupper funnet</h3>
            <p className="text-cybergold-500 mb-6">
              {searchQuery ? 
                "Ingen grupper matcher søket. Prøv et annet søkeord." : 
                "Du er ikke medlem i noen grupper ennå."}
            </p>
            <Button
              className="bg-cybergold-600 text-black hover:bg-cybergold-700"
              onClick={() => setIsCreatingGroup(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Opprett din første gruppe
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map(group => (
              <Card 
                key={group.id} 
                className="bg-cyberdark-900 border-cybergold-500/30 hover:border-cybergold-500/60 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedGroup(group);
                  navigate(`/group-chat/${group.id}`);
                }}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-cybergold-300">{group.name}</CardTitle>
                    {group.isPrivate && <Lock className="h-4 w-4 text-cybergold-500" />}
                  </div>
                  <CardDescription className="text-cybergold-500">
                    {group.memberCount || group.members?.length || 0} medlemmer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-cybergold-400">
                    {group.description || "Ingen beskrivelse"}
                  </p>
                </CardContent>
                <CardFooter className="border-t border-cyberdark-700 pt-3">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex -space-x-2">
                      {/* Member avatars would go here */}
                      <div className="flex h-6 w-6 rounded-full bg-cyberdark-800 items-center justify-center text-xs text-cybergold-400 border border-cyberdark-900">
                        +{group.memberCount || group.members?.length || 0}
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-cybergold-500">
                      <MessageSquare className="h-3.5 w-3.5 mr-1" />
                      {group.messageCount || 0} meldinger
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {/* Create Group Dialog */}
        <Dialog open={isCreatingGroup} onOpenChange={setIsCreatingGroup}>
          <DialogContent className="bg-cyberdark-900 border-cybergold-500/30">
            <DialogHeader>
              <DialogTitle className="text-cybergold-300">Opprett ny gruppe</DialogTitle>
              <DialogDescription className="text-cybergold-500">
                Fyll inn informasjon om den nye gruppen
              </DialogDescription>
            </DialogHeader>
            
            {/* Group creation form would go here */}
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="group-name" className="text-sm font-medium text-cybergold-300">
                  Gruppenavn
                </label>
                <Input
                  id="group-name"
                  placeholder="Skriv et navn for gruppen"
                  className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-300"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="group-description" className="text-sm font-medium text-cybergold-300">
                  Beskrivelse (valgfri)
                </label>
                <Input
                  id="group-description"
                  placeholder="Beskriv hva gruppen handler om"
                  className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-300"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="is-private" className="rounded text-cybergold-600" />
                <label htmlFor="is-private" className="text-sm font-medium text-cybergold-300">
                  Privat gruppe (krever passord for å bli med)
                </label>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCreatingGroup(false)}
                className="border-cybergold-500/30 text-cybergold-400"
              >
                Avbryt
              </Button>
              <Button 
                className="bg-cybergold-600 text-black hover:bg-cybergold-700"
                onClick={() => {
                  // Simplified for demo purposes
                  handleCreateGroup({
                    name: "Ny Gruppe", 
                    description: "Gruppe opprettet", 
                    isPrivate: false 
                  });
                }}
              >
                Opprett gruppe
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Join Group Dialog */}
        <Dialog open={isJoiningGroup} onOpenChange={setIsJoiningGroup}>
          <DialogContent className="bg-cyberdark-900 border-cybergold-500/30">
            <DialogHeader>
              <DialogTitle className="text-cybergold-300">Bli med i gruppe</DialogTitle>
              <DialogDescription className="text-cybergold-500">
                Skriv inn gruppe-ID eller invitasjonskode
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="group-id" className="text-sm font-medium text-cybergold-300">
                  Gruppe-ID eller invitasjonskode
                </label>
                <Input
                  id="group-id"
                  placeholder="f.eks. abc123"
                  className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-300"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="group-password" className="text-sm font-medium text-cybergold-300">
                  Passord (hvis nødvendig)
                </label>
                <Input
                  id="group-password"
                  type="password"
                  placeholder="Skriv gruppens passord"
                  className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-300"
                  value={groupPassword}
                  onChange={(e) => setGroupPassword(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsJoiningGroup(false)}
                className="border-cybergold-500/30 text-cybergold-400"
              >
                Avbryt
              </Button>
              <Button 
                className="bg-cybergold-600 text-black hover:bg-cybergold-700"
                onClick={() => {
                  // This is simplified for demo
                  handleJoinGroup("demo-group-id", groupPassword);
                }}
              >
                Bli med
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // If a group is selected, show the group chat interface
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Group header */}
      <div className="bg-cyberdark-900 border-b border-cyberdark-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 h-8 w-8 text-cybergold-400"
              onClick={() => {
                setSelectedGroup(null);
                navigate('/group-chat');
              }}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div>
              <h2 className="text-lg font-medium text-cybergold-300">{selectedGroup.name}</h2>
              <p className="text-xs text-cybergold-500">
                {selectedGroup.memberCount || selectedGroup.members?.length || 0} medlemmer
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedGroup.isPrivate && (
              <Lock className="h-4 w-4 text-cybergold-500" />
            )}
            {selectedGroup.isPremium && (
              <Star className="h-4 w-4 text-cybergold-400" />
            )}
          </div>
        </div>
      </div>
      
      {/* Premium banner for premium groups */}
      {selectedGroup.isPremium && (
        <div className="bg-gradient-to-r from-cybergold-900 to-cybergold-800 px-4 py-1.5 flex items-center">
          <Star className="h-3.5 w-3.5 text-cybergold-400 mr-1.5" />
          <span className="text-xs text-cybergold-300">Premium-gruppe med forbedret sikkerhet og ytelse</span>
        </div>
      )}
      
      {/* Encryption indicator */}
      {selectedGroup.isEncrypted && (
        <div className="bg-cyberdark-900 px-4 py-2 border-b border-cybergold-500/30 flex items-center">
          <Shield className="h-4 w-4 text-cybergold-500 mr-2" />
          <span className="text-sm text-cybergold-300">
            Denne gruppesamtalen er beskyttet med ende-til-ende kryptering
          </span>
        </div>
      )}
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-cyberdark-950">
        {messagesLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cybergold-400" />
          </div>
        ) : groupMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-cybergold-500/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-cybergold-400" />
            </div>
            <h3 className="text-xl font-medium text-cybergold-300 mb-2">Ingen meldinger ennå</h3>
            <p className="text-cybergold-500 mb-6">
              Send den første meldingen for å starte samtalen!
            </p>
            <Button
              className="bg-cybergold-600 text-black hover:bg-cybergold-700"
              onClick={() => {
                handleSendMessage("Hei alle sammen! 👋");
              }}
            >
              Send første melding
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Messages would be displayed here */}
            <div className="flex justify-start">
              <div className="bg-cyberdark-800 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center mb-1">
                  <div className="h-6 w-6 rounded-full bg-cyberdark-700 mr-2"></div>
                  <span className="text-xs text-cybergold-500">Bruker • 10:30</span>
                </div>
                <p className="text-cybergold-300">Hei, velkommen til gruppesamtalen!</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <div className="bg-cybergold-600 text-black rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center justify-end mb-1">
                  <span className="text-xs opacity-70">Deg • 10:32</span>
                </div>
                <p>Takk! Hyggelig å være her.</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="border-t border-cyberdark-700 bg-cyberdark-900 p-4">
        <form className="flex gap-2" onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.querySelector('input') as HTMLInputElement;
          handleSendMessage(input.value);
          input.value = '';
        }}>
          <Input
            placeholder="Skriv en melding..."
            className="flex-1 bg-cyberdark-800 border-cyberdark-700 text-cybergold-300"
          />
          <Button 
            type="submit"
            className="bg-cybergold-600 hover:bg-cybergold-700 text-black"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default GroupChatPage;