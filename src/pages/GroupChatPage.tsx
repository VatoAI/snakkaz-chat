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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  ArrowLeft,
  Menu,
  Clock,
  Bell,
  BellOff,
  Trash2,
  LogOut,
  Settings,
  Download,
  UserX,
  Share2,
  QrCode
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import MessageInput from '@/components/MessageInput';
import { Group, GroupVisibility, SecurityLevel } from '@/types/groups';

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
  const [isInvitingMembers, setIsInvitingMembers] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [groupPassword, setGroupPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupVisibility, setNewGroupVisibility] = useState<GroupVisibility>('private');
  const [newGroupPassword, setNewGroupPassword] = useState('');
  const [newGroupEncrypted, setNewGroupEncrypted] = useState(true);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [disappearingTime, setDisappearingTime] = useState(0);
  const [inviteLink, setInviteLink] = useState('');
  
  // Get groups
  const { 
    groups, 
    fetchGroups,
    createGroup,
    leaveGroup,
    inviteToGroup,
    loading: groupsLoading 
  } = useGroups();
  
  // Filter groups based on search
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Load group messages when selected
  const {
    group,
    messages: groupMessages,
    loading: messagesLoading,
    sendMessage,
    loadGroup
  } = useGroupChat(selectedGroup?.id);
  
  useEffect(() => {
    if (user?.id) {
      fetchGroups();
      fetchProfiles();
    }
  }, [user?.id, fetchGroups, fetchProfiles]);
  
  // If URL includes a group ID, select that group
  useEffect(() => {
    if (id && groups.length > 0) {
      const foundGroup = groups.find(g => g.id === id);
      if (foundGroup) {
        setSelectedGroup(foundGroup);
      }
    }
  }, [id, groups]);

  // Mark messages as read when viewing a group
  useEffect(() => {
    if (selectedGroup?.id) {
      // Vi har ikke en direkte markAsRead-metode, men loadGroup oppdaterer data
      loadGroup();
    }
  }, [selectedGroup?.id, loadGroup]);

  // Handle creating a new group
  const handleCreateGroup = async () => {
    try {
      if (!newGroupName.trim()) {
        toast({
          variant: "destructive",
          title: "Gruppenavn mangler",
          description: "Du må angi et navn for gruppen",
        });
        return;
      }
      
      const newGroup = await createGroup({
        name: newGroupName.trim(),
        description: newGroupDesc.trim(),
        visibility: newGroupVisibility,
        securityLevel: newGroupEncrypted ? "high" : "standard"
      });
      
      toast({
        title: "Gruppe opprettet",
        description: `Gruppen "${newGroupName}" er opprettet`,
      });
      
      if (newGroup) {
        setSelectedGroup(newGroup);
        setIsCreatingGroup(false);
      }
      
      // Reset form
      setNewGroupName('');
      setNewGroupDesc('');
      setNewGroupVisibility('private');
      setNewGroupPassword('');
      setSelectedMembers([]);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Feil ved oppretting av gruppe",
        description: error.message || "Kunne ikke opprette gruppen",
      });
    }
  };
  
  const handleJoinGroup = async (code: string, password?: string) => {
    // Denne metoden finnes ikke direkte i useGroups, 
    // men vi kan simulere det ved å bruke acceptInvite
    try {
      await codeToJoin(code);
      
      // Vi oppdaterer gruppene for å få den nye gruppen
      await fetchGroups();
      
      // Sjekk om vi finner den nye gruppen
      const joinedGroup = groups.find(g => g.id === code);
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

  // Hjelpefunksjon for å simulere tiltredelse i en gruppe via kode
  const codeToJoin = async (code: string) => {
    return new Promise<void>((resolve, reject) => {
      // Simulerer en API-forespørsel
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  // Handle leaving a group
  const handleLeaveGroup = async () => {
    if (!selectedGroup) return;
    
    try {
      await leaveGroup(selectedGroup.id);
      
      toast({
        title: "Forlatt gruppe",
        description: `Du har forlatt "${selectedGroup.name}"`,
      });
      
      setSelectedGroup(null);
      navigate('/group-chat');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Feil ved utmelding",
        description: error.message || "Kunne ikke forlate gruppen",
      });
    }
  };
  
  const handleSendMessage = async (text: string, options?: { mediaUrl?: string, mediaType?: string }) => {
    if (!selectedGroup || (!text.trim() && !options?.mediaUrl)) return;
    
    try {
      await sendMessage({
        text: text.trim(),
        mediaUrl: options?.mediaUrl,
        mediaType: options?.mediaType,
        ttl: disappearingTime > 0 ? disappearingTime : undefined
      });
      
      setNewMessage('');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Feil ved sending av melding",
        description: error.message || "Kunne ikke sende meldingen",
      });
    }
  };

  // Generate invite link for a group
  const handleGenerateInviteLink = async () => {
    if (!selectedGroup) return;
    
    try {
      // Vi har ikke en direkte generateInviteLink-metode, 
      // så vi simulerer det her
      const link = `https://snakkaz.no/join/${selectedGroup.id}`;
      setInviteLink(link);
      
      toast({
        title: "Invitasjonslink generert",
        description: "Lenken er kopiert til utklippstavlen",
      });
      
      // Copy to clipboard
      navigator.clipboard.writeText(link);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Feil ved generering av invitasjonslenke",
        description: error.message || "Kunne ikke generere invitasjonslenke",
      });
    }
  };
  
  // Toggle disappearing messages
  const toggleDisappearingMessages = (value: number) => {
    setDisappearingTime(value);
    
    toast({
      title: value > 0 ? "Selvslettende meldinger aktivert" : "Selvslettende meldinger deaktivert",
      description: value > 0 
        ? `Meldinger vil slettes etter ${getDisappearingMessageLabel(value)}`
        : "Meldinger vil ikke slettes automatisk",
    });
  };
  
  // Helper to get label for disappearing messages
  const getDisappearingMessageLabel = (seconds: number) => {
    if (seconds < 60) return `${seconds} sekunder`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutter`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} timer`;
    return `${Math.floor(seconds / 86400)} dager`;
  };

  // Convert group message to ChatMessage format
  const convertMessageFormat = (message: any, isCurrentUser: boolean) => {
    return {
      id: message.id,
      content: message.text,
      sender_id: message.senderId,
      created_at: new Date(message.createdAt).toISOString(),
      media: message.mediaUrl ? {
        url: message.mediaUrl,
        type: message.mediaType
      } : undefined,
      ttl: message.ttl,
      status: isCurrentUser ? 'delivered' as const : undefined,
      readBy: message.readBy
    };
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
                    <div className="flex items-center gap-3">
                      {group.avatarUrl ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img 
                            src={group.avatarUrl} 
                            alt={group.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-cybergold-900/30 flex items-center justify-center text-lg font-medium text-cybergold-400">
                          {group.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-cybergold-300">{group.name}</CardTitle>
                        <CardDescription className="text-cybergold-500">
                          {group.memberCount} medlemmer
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {group.visibility === 'private' && <Lock className="h-4 w-4 text-cybergold-500" />}
                      {group.securityLevel === "high" && <Shield className="h-4 w-4 text-green-500" />}
                      {group.is_premium && <Star className="h-4 w-4 text-cybergold-400" />}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-cybergold-400 line-clamp-2">
                    {group.description || "Ingen beskrivelse"}
                  </p>
                </CardContent>
                <CardFooter className="border-t border-cyberdark-700 pt-3">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex -space-x-2">
                      {/* Member avatars would go here */}
                      <div className="flex h-6 w-6 rounded-full bg-cyberdark-800 items-center justify-center text-xs text-cybergold-400 border border-cyberdark-900">
                        +{group.memberCount || 0}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-xs text-cybergold-500">
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                        {group.unreadCount || 0}
                      </div>
                      {group.updatedAt && (
                        <div className="flex items-center text-xs text-cybergold-600">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {new Date(group.updatedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {/* Create Group Dialog */}
        <Dialog open={isCreatingGroup} onOpenChange={setIsCreatingGroup}>
          <DialogContent className="bg-cyberdark-900 border-cybergold-500/30 max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-cybergold-300">Opprett ny gruppe</DialogTitle>
              <DialogDescription className="text-cybergold-500">
                Fyll inn informasjon om den nye gruppen
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="group-name" className="text-sm font-medium text-cybergold-300">
                  Gruppenavn *
                </label>
                <Input
                  id="group-name"
                  placeholder="Skriv et navn for gruppen"
                  className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-300"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="group-description" className="text-sm font-medium text-cybergold-300">
                  Beskrivelse (valgfri)
                </label>
                <Textarea
                  id="group-description"
                  placeholder="Beskriv hva gruppen handler om"
                  className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-300 min-h-[80px] resize-none"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="is-private" className="text-sm font-medium text-cybergold-300">
                      Privat gruppe
                    </label>
                    <Switch 
                      id="is-private"
                      checked={newGroupVisibility === 'private'}
                      onCheckedChange={(checked) => setNewGroupVisibility(checked ? 'private' : 'public')}
                    />
                  </div>
                  <p className="text-xs text-cybergold-600">
                    Krever passord for å bli med
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="is-encrypted" className="text-sm font-medium text-cybergold-300">
                      Ende-til-ende kryptering
                    </label>
                    <Switch 
                      id="is-encrypted"
                      checked={newGroupEncrypted}
                      onCheckedChange={setNewGroupEncrypted}
                    />
                  </div>
                  <p className="text-xs text-cybergold-600">
                    Alle meldinger krypteres
                  </p>
                </div>
              </div>
              
              {newGroupVisibility === 'private' && (
                <div className="space-y-2">
                  <label htmlFor="group-password" className="text-sm font-medium text-cybergold-300">
                    Gruppepassord *
                  </label>
                  <Input
                    id="group-password"
                    type="password"
                    placeholder="Velg et sterkt passord"
                    className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-300"
                    value={newGroupPassword}
                    onChange={(e) => setNewGroupPassword(e.target.value)}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-cybergold-300">
                  Legg til medlemmer
                </label>
                <div className="max-h-[120px] overflow-y-auto bg-cyberdark-800 rounded border border-cybergold-500/30 p-2">
                  {/* Her ville vi normalt vise en liste over venner som kan legges til */}
                  {/* For demo-formål viser vi bare en enkel melding */}
                  <p className="text-sm text-cybergold-500 text-center py-4">
                    Her vil du kunne velge fra din venneliste.
                  </p>
                </div>
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
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim() || (newGroupVisibility === 'private' && !newGroupPassword.trim())}
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
              
              <div className="flex items-center gap-2 mt-4">
                <div className="w-full border-t border-cyberdark-700"></div>
                <span className="text-xs text-cybergold-500">ELLER</span>
                <div className="w-full border-t border-cyberdark-700"></div>
              </div>
              
              <div className="text-center">
                <Button 
                  variant="outline"
                  className="border-cybergold-500/30 text-cybergold-400"
                  onClick={() => {
                    // Her ville vi normalt åpne QR-kode skanner
                    toast({
                      title: "QR-kode skanner",
                      description: "Skann en gruppe QR-kode for å bli med",
                    });
                  }}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Skann QR-kode
                </Button>
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
                  // Dette er forenklet for demo-formål
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
            
            <div className="flex items-center">
              {selectedGroup.avatarUrl ? (
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img 
                    src={selectedGroup.avatarUrl} 
                    alt={selectedGroup.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-cybergold-900/30 flex items-center justify-center mr-3 text-lg font-medium text-cybergold-400">
                  {selectedGroup.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div>
                <h2 className="text-lg font-medium text-cybergold-300">{selectedGroup.name}</h2>
                <p className="text-xs text-cybergold-500">
                  {selectedGroup.memberCount} medlemmer 
                  {disappearingTime > 0 && (
                    <span className="ml-2 flex items-center">
                      • <Clock className="h-3 w-3 inline mr-1 ml-1 text-amber-400" />
                      {getDisappearingMessageLabel(disappearingTime)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Security indicators */}
            <div className="flex items-center gap-1 mr-3">
              {selectedGroup.visibility === 'private' && (
                <div className="p-1 rounded-full bg-cyberdark-800" title="Privat gruppe">
                  <Lock className="h-4 w-4 text-cybergold-500" />
                </div>
              )}
              {selectedGroup.securityLevel === "high" && (
                <div className="p-1 rounded-full bg-cyberdark-800" title="Ende-til-ende kryptert">
                  <Shield className="h-4 w-4 text-green-500" />
                </div>
              )}
              {selectedGroup.is_premium && (
                <div className="p-1 rounded-full bg-cyberdark-800" title="Premium gruppe">
                  <Star className="h-4 w-4 text-cybergold-400" />
                </div>
              )}
            </div>
            
            {/* Group actions menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-cyberdark-800 border-cyberdark-700">
                <DropdownMenuLabel className="text-cybergold-300">Gruppe handlinger</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-cyberdark-700" />
                <DropdownMenuItem 
                  className="text-cybergold-400 focus:text-cybergold-300 focus:bg-cyberdark-700"
                  onClick={() => setShowMembersDialog(true)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Vis medlemmer
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-cybergold-400 focus:text-cybergold-300 focus:bg-cyberdark-700"
                  onClick={() => setIsInvitingMembers(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Inviter medlemmer
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-cybergold-400 focus:text-cybergold-300 focus:bg-cyberdark-700"
                  onClick={() => setShowSettingsDialog(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Gruppeinnstillinger
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-cyberdark-700" />
                <DropdownMenuItem 
                  className="text-amber-400 focus:text-amber-300 focus:bg-cyberdark-700"
                  onClick={() => {
                    // Toggle meny for selvslettende meldinger
                    setDisappearingTime(disappearingTime === 0 ? 86400 : 0);
                  }}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {disappearingTime > 0 ? 'Deaktiver selvslettende meldinger' : 'Aktiver selvslettende meldinger'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-cybergold-400 focus:text-cybergold-300 focus:bg-cyberdark-700"
                  onClick={handleGenerateInviteLink}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Del invitasjonslenke
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-cyberdark-700" />
                <DropdownMenuItem 
                  className="text-red-400 focus:text-red-300 focus:bg-cyberdark-700"
                  onClick={handleLeaveGroup}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Forlat gruppe
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Premium banner for premium groups */}
      {selectedGroup.is_premium && (
        <div className="bg-gradient-to-r from-cybergold-900 to-cybergold-800 px-4 py-1.5 flex items-center">
          <Star className="h-3.5 w-3.5 text-cybergold-400 mr-1.5" />
          <span className="text-xs text-cybergold-300">Premium-gruppe med forbedret sikkerhet og ytelse</span>
        </div>
      )}
      
      {/* Encryption indicator */}
      {selectedGroup.securityLevel === "high" && (
        <div className="bg-cyberdark-900 px-4 py-2 border-b border-cybergold-500/30 flex items-center">
          <Shield className="h-4 w-4 text-green-500 mr-2" />
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
        ) : !groupMessages || groupMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-cybergold-500/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-cybergold-400" />
            </div>
            <h3 className="text-xl font-medium text-cybergold-300 mb-2">Ingen meldinger ennå</h3>
            <p className="text-cybergold-500 mb-6">
              Send den første meldingen for å starte samtalen!
            </p>
            {selectedGroup.securityLevel === "high" && (
              <div className="bg-green-900/20 border border-green-900/30 rounded-lg p-3 mb-4 max-w-md">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-400 font-medium">Sikker gruppesamtale</p>
                    <p className="text-xs text-green-500">
                      Denne samtalen er Ende-til-Ende kryptert. Ingen utenfor gruppen, ikke engang serveren, kan lese meldingene.
                    </p>
                  </div>
                </div>
              </div>
            )}
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
            {groupMessages.map(message => {
              const isCurrentUser = message.senderId === user?.id;
              return (
                <ChatMessage 
                  key={message.id}
                  message={convertMessageFormat(message, isCurrentUser)}
                  isCurrentUser={isCurrentUser}
                  userProfiles={userProfiles}
                  isEncrypted={selectedGroup.securityLevel === "high"}
                />
              );
            })}
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="border-t border-cyberdark-700 bg-cyberdark-900">
        <MessageInput
          onSendMessage={handleSendMessage}
          placeholder="Skriv en melding..."
          securityLevel={selectedGroup.securityLevel === "high" ? 'server_e2ee' : 'standard'}
          showSecurityIndicator={true}
        />
      </div>
      
      {/* Members Dialog */}
      <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
        <DialogContent className="bg-cyberdark-900 border-cybergold-500/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cybergold-300">Gruppemedlemmer</DialogTitle>
            <DialogDescription className="text-cybergold-500">
              {selectedGroup.memberCount} medlemmer i {selectedGroup.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="space-y-3 py-2">
              {/* Medlemslisten ville normalt komme fra selectedGroup.members */}
              {/* For demo-formål viser vi bare noen eksempler */}
              <div className="flex items-center justify-between p-2 hover:bg-cyberdark-800 rounded">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-cyberdark-700 mr-3"></div>
                  <div>
                    <p className="text-sm text-cybergold-300">Brukernavn</p>
                    <p className="text-xs text-cybergold-600">Gruppeadmin</p>
                  </div>
                </div>
                <div className="h-2.5 w-2.5 rounded-full bg-green-500" title="Online"></div>
              </div>
              
              <div className="flex items-center justify-between p-2 hover:bg-cyberdark-800 rounded">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-cyberdark-700 mr-3"></div>
                  <div>
                    <p className="text-sm text-cybergold-300">Bruker 2</p>
                    <p className="text-xs text-cybergold-600">Medlem</p>
                  </div>
                </div>
                <div className="h-2.5 w-2.5 rounded-full bg-gray-500" title="Offline"></div>
              </div>
              
              {/* Og noen duplikater for å vise scrollfunksjonalitet */}
              <div className="flex items-center justify-between p-2 hover:bg-cyberdark-800 rounded">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-cyberdark-700 mr-3"></div>
                  <div>
                    <p className="text-sm text-cybergold-300">Bruker 3</p>
                    <p className="text-xs text-cybergold-600">Medlem</p>
                  </div>
                </div>
                <div className="h-2.5 w-2.5 rounded-full bg-green-500" title="Online"></div>
              </div>
              
              <div className="flex items-center justify-between p-2 hover:bg-cyberdark-800 rounded">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-cyberdark-700 mr-3"></div>
                  <div>
                    <p className="text-sm text-cybergold-300">Bruker 4</p>
                    <p className="text-xs text-cybergold-600">Medlem</p>
                  </div>
                </div>
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500" title="Idle"></div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowMembersDialog(false)}>
              Lukk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="bg-cyberdark-900 border-cybergold-500/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cybergold-300">Gruppeinnstillinger</DialogTitle>
            <DialogDescription className="text-cybergold-500">
              Juster innstillinger for {selectedGroup.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-cybergold-300">
                Selvslettende meldinger
              </label>
              <select
                value={disappearingTime}
                onChange={(e) => toggleDisappearingMessages(Number(e.target.value))}
                className="w-full bg-cyberdark-800 border-cyberdark-700 text-cybergold-300 rounded-md p-2"
              >
                <option value="0">Av</option>
                <option value="300">5 minutter</option>
                <option value="3600">1 time</option>
                <option value="86400">1 dag</option>
                <option value="604800">7 dager</option>
              </select>
              <p className="text-xs text-cybergold-600">
                Når aktivert vil meldinger forsvinne hos alle etter den angitte tiden
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-cybergold-300">
                  Lydløs varsling
                </label>
                <Switch />
              </div>
              <p className="text-xs text-cybergold-600">
                Motta varsler uten lyd for denne gruppen
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-cybergold-300">
                  Ikke forstyrr
                </label>
                <Switch />
              </div>
              <p className="text-xs text-cybergold-600">
                Ikke vis varsler for denne gruppen i det hele tatt
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            {/* Admin actions would go here if the user is an admin */}
            {true && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  toast({
                    variant: "destructive",
                    title: "Advarsel",
                    description: "Denne handlingen kan ikke angres",
                  });
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Slett gruppe
              </Button>
            )}
            <Button onClick={() => setShowSettingsDialog(false)}>
              Lukk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Invite Members Dialog */}
      <Dialog open={isInvitingMembers} onOpenChange={setIsInvitingMembers}>
        <DialogContent className="bg-cyberdark-900 border-cybergold-500/30">
          <DialogHeader>
            <DialogTitle className="text-cybergold-300">Inviter til gruppen</DialogTitle>
            <DialogDescription className="text-cybergold-500">
              Del denne linken eller QR-koden for å invitere andre
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="bg-cyberdark-800 p-4 rounded-lg flex flex-col items-center">
              {/* QR code would go here */}
              <div className="w-40 h-40 bg-white p-2 rounded-lg mb-4">
                <div className="bg-cyberdark-900 w-full h-full flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-white" />
                </div>
              </div>
              
              <p className="text-center text-xs text-cybergold-600 mb-2">
                Skann denne QR-koden med kameraet i Snakkaz-appen
              </p>
              
              <Button
                className="bg-cybergold-600 text-black hover:bg-cybergold-700 text-sm"
                onClick={handleGenerateInviteLink}
              >
                <Share2 className="h-3.5 w-3.5 mr-1.5" />
                Generer ny invitasjonslenke
              </Button>
            </div>
            
            {inviteLink && (
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={inviteLink}
                  className="bg-cyberdark-800 border-cyberdark-700 text-cybergold-300"
                  onClick={(e) => {
                    (e.target as HTMLInputElement).select();
                    navigator.clipboard.writeText(inviteLink);
                    toast({
                      title: "Kopiert",
                      description: "Invitasjonslenke kopiert til utklippstavlen",
                    });
                  }}
                />
                <Button
                  className="bg-cybergold-600 text-black hover:bg-cybergold-700"
                  onClick={() => {
                    navigator.clipboard.writeText(inviteLink);
                    toast({
                      title: "Kopiert",
                      description: "Invitasjonslenke kopiert til utklippstavlen",
                    });
                  }}
                >
                  Kopier
                </Button>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsInvitingMembers(false)}>
              Lukk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupChatPage;