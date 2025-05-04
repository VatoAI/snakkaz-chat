import React, { useState, useEffect, useRef } from 'react';
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
  Share2,
  QrCode,
  Check,
  Camera,
  Image
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { GroupMessageList } from '@/components/chat/GroupMessageList';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { MessageInput } from '@/components/message-input/MessageInput';
import { Group, GroupVisibility, GroupMember, GroupMessage } from '@/features/groups/types/group';
import { SecurityLevel } from '@/types/security';
import { usePresence } from '@/hooks/usePresence';
import { UserStatus } from '@/types/presence';
import { ChatMessage, normalizeMessage } from '@/types/messages';

// Define Group type with compatibility for both property naming styles
type GroupType = Group & {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  memberCount?: number;
  visibility?: GroupVisibility; // This is now properly defined in types/group.ts
  securityLevel?: SecurityLevel;
  is_premium?: boolean;
};

// Define getGroupMemberById function properly
const getGroupMemberById = (members: GroupMember[] | undefined, userId: string): GroupMember | null => {
  if (!members || !Array.isArray(members)) return null;
  return members.find(member => member.userId === userId || member.user_id === userId) || null;
};

const GroupChatPage = () => {
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { userProfiles, fetchProfiles } = useProfiles();
  const { handleStatusChange, userPresence } = usePresence(user?.id || null);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for active group
  const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isJoiningGroup, setIsJoiningGroup] = useState(false);
  const [isInvitingMembers, setIsInvitingMembers] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [groupPassword, setGroupPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupVisibility, setNewGroupVisibility] = useState<GroupVisibility>('private');
  const [newGroupPassword, setNewGroupPassword] = useState('');
  const [newGroupEncrypted, setNewGroupEncrypted] = useState(true);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [disappearingTime, setDisappearingTime] = useState(0);
  const [inviteLink, setInviteLink] = useState('');
  const [groupAvatarPreview, setGroupAvatarPreview] = useState('');
  const [groupAvatarFile, setGroupAvatarFile] = useState<File | null>(null);
  const [muteNotifications, setMuteNotifications] = useState(false);
  const [initialDisappearingTime, setInitialDisappearingTime] = useState(0);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [replyToMessage, setReplyToMessage] = useState<ChatMessage | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  
  // Get groups
  const { 
    groups, 
    refreshGroups: fetchGroups,
    handleCreateGroup: createGroup,
    loading: groupsLoading 
  } = useGroups({ currentUserId: user?.id || '' });

  // Since leaveGroup doesn't exist in useGroups, we'll define a local function
  const leaveGroup = async (groupId: string) => {
    try {
      // Implementation would depend on your API
      // This is a placeholder implementation
      console.log(`Leaving group with id: ${groupId}`);
      await fetchGroups(); // Refresh groups after leaving
      return true;
    } catch (error) {
      console.error("Error leaving group:", error);
      throw error;
    }
  };
  
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
    loadGroup,
    editMessage,
    deleteMessage,
    reactToMessage,
    replyToMessage: replyToMessageFunc,
    loadMessages,
    offlineIndicator
  } = useGroupChat(selectedGroup?.id);
  
  // Update presence when switching groups
  useEffect(() => {
    if (selectedGroup?.id && user?.id) {
      // Update status to online when group changes
      handleStatusChange('online');
    } else {
      handleStatusChange('online');
    }
    
    return () => {
      // When component unmounts, set status to online (not offline)
      if (user?.id) {
        handleStatusChange('online');
      }
    };
  }, [selectedGroup?.id, user?.id, handleStatusChange]);
  
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
        // Cast to GroupType to ensure type compatibility
        setSelectedGroup(foundGroup as unknown as GroupType);
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

  // Function to convert SecurityLevel to MessageInput.securityLevel
  const mapSecurityLevelToMessageInput = (level?: SecurityLevel): 'p2p_e2ee' | 'server_e2ee' | 'standard' => {
    if (!level) return 'standard';
    
    // Convert values between the different type definitions
    if (level === 'high' || level === 'maximum' || level === 'server_e2ee') return 'server_e2ee';
    if (level === 'p2p_e2ee') return 'p2p_e2ee';
    return 'standard';
  };
  
  // Helper function to check if the group has a high security level
  const isHighSecurityGroup = (level?: SecurityLevel): boolean => {
    if (!level) return false;
    return level === 'high' || level === 'maximum' || level === 'p2p_e2ee' || level === 'server_e2ee';
  };

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
      
      const securityLevel = newGroupEncrypted ? "server_e2ee" : "standard";
      
      // Fix: Pass a string as expected by the createGroup function
      const newGroup = await createGroup(
        newGroupName.trim(),
        newGroupDesc.trim(),
        newGroupVisibility,
        securityLevel
      );
      
      toast({
        title: "Gruppe opprettet",
        description: `Gruppen "${newGroupName}" er opprettet`,
      });
      
      if (newGroup) {
        // Cast to GroupType to ensure type compatibility
        setSelectedGroup(newGroup as unknown as GroupType);
        setIsCreatingGroup(false);
      }
      
      // Reset form
      setNewGroupName('');
      setNewGroupDesc('');
      setNewGroupVisibility('private');
      setNewGroupPassword('');
      setSelectedMembers([]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Kunne ikke opprette gruppen";
      toast({
        variant: "destructive",
        title: "Feil ved oppretting av gruppe",
        description: errorMessage,
      });
    }
  };
  
  const handleJoinGroup = async (code: string, password?: string) => {
    try {
      await codeToJoin(code);
      
      // Vi oppdaterer gruppene for å få den nye gruppen
      await fetchGroups();
      
      // Sjekk om vi finner den nye gruppen
      const joinedGroup = groups.find(g => g.id === code);
      if (joinedGroup) {
        // Cast to GroupType to ensure type compatibility
        setSelectedGroup(joinedGroup as unknown as GroupType);
        toast({
          title: "Gruppe tilgang",
          description: `Du har blitt med i "${joinedGroup.name}"`,
        });
      }
      
      setIsJoiningGroup(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Kunne ikke bli med i gruppen";
      toast({
        variant: "destructive",
        title: "Feil ved tilkobling til gruppe",
        description: errorMessage,
      });
    }
  };

  // Helper function for simulating joining a group via code
  const codeToJoin = async (code: string) => {
    return new Promise<void>((resolve, reject) => {
      // Simulates an API request
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Kunne ikke forlate gruppen";
      toast({
        variant: "destructive",
        title: "Feil ved utmelding",
        description: errorMessage,
      });
    }
  };
  
  const handleSendMessage = async (text: string) => {
    if (!selectedGroup) return;
    
    try {
      if (editingMessageId) {
        // Oppdater en eksisterende melding
        await editMessage(editingMessageId, text);
        setEditingMessageId(null);
      } else if (replyToMessage) {
        // Send som svar på en melding
        await replyToMessageFunc(replyToMessage.id, text);
        setReplyToMessage(null);
      } else {
        // Send ny melding
        await sendMessage({
          text: text.trim(),
          ttl: disappearingTime > 0 ? disappearingTime : undefined
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Feil ved sending av melding",
        description: error instanceof Error ? error.message : "Kunne ikke sende meldingen",
      });
    }
  };
  
  // Håndter opplasting av media
  const handleSendMedia = async (mediaData: { 
    url: string, 
    thumbnailUrl?: string, 
    ttl?: number, 
    isEncrypted?: boolean 
  }) => {
    if (!selectedGroup) return;
    
    try {
      const mediaType = mediaData.url.includes('.mp4') || mediaData.url.includes('.webm') 
        ? 'video' 
        : 'image';
      
      await sendMessage({
        mediaUrl: mediaData.url,
        mediaType,
        thumbnailUrl: mediaData.thumbnailUrl,
        ttl: mediaData.ttl || disappearingTime,
        isEncrypted: mediaData.isEncrypted
      });
      
      toast({
        title: "Media sendt",
        description: `${mediaType === 'video' ? 'Video' : 'Bilde'} er sendt til gruppen`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Feil ved sending av media",
        description: error instanceof Error ? error.message : "Kunne ikke sende media",
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
      
      // Kopier til clipboard
      navigator.clipboard.writeText(link);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Kunne ikke generere invitasjonslenke";
      toast({
        variant: "destructive",
        title: "Feil ved generering av invitasjonslenke",
        description: errorMessage,
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

  // Handle file uploads via file input
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast({
        variant: "destructive",
        title: "Ugyldig filtype",
        description: "Du kan bare laste opp bilder eller video",
      });
      return;
    }
    
    // Her ville vi vanligvis ha lastet opp filen til en server og fått URL'en tilbake
    // For demo formål bruker vi en lokal URL
    const localUrl = URL.createObjectURL(file);
    
    handleSendMedia({
      url: localUrl,
      isEncrypted: selectedGroup?.securityLevel === "high"
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle message editing
  const handleEditMessage = (message: ChatMessage | GroupMessage) => {
    setEditingMessageId(message.id);
    // Setter meldingsteksten i input-feltet
    // Dette må gjøres i MessageInput komponenten
  };
  
  // Handle message deletion
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      toast({
        title: "Melding slettet",
        description: "Meldingen er slettet fra samtalen",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Feil ved sletting",
        description: error instanceof Error ? error.message : "Kunne ikke slette meldingen",
      });
    }
  };
  
  // Handle reply to message
  const handleReplyToMessage = (message: ChatMessage | GroupMessage) => {
    setReplyToMessage(message as ChatMessage);
  };
  
  // Handle reactions to messages
  const handleReactionAdd = async (messageId: string, emoji: string) => {
    try {
      await reactToMessage(messageId, emoji);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Feil ved reaksjon",
        description: error instanceof Error ? error.message : "Kunne ikke legge til reaksjon",
      });
    }
  };
  
  // Load more messages (older)
  const handleLoadMoreMessages = async () => {
    if (!group) return;
    
    try {
      // Assuming loadMessages can handle pagination
      await loadMessages(50);
      // Update hasMoreMessages based on response
      // For now, just set it to false for demonstration
      setHasMoreMessages(false);
    } catch (error) {
      console.error('Error loading more messages:', error);
    }
  };

  const handleGroupAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setGroupAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setGroupAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSelectedMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };
  
  // Render the UI
  // Render group list if no group is selected
  if (!selectedGroup) {
    return (
      <div className="container max-w-6xl mx-auto py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-cybergold-300">Grupper</h1>
          <Button onClick={() => setIsCreatingGroup(true)} className="bg-cybergold-600 text-black hover:bg-cybergold-500">
            <Plus className="h-4 w-4 mr-2" />
            Lag ny gruppe
          </Button>
        </div>
        
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Søk etter grupper..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-cyberdark-800 text-cybergold-200 border-cyberdark-700 focus:border-cybergold-500"
          />
        </div>
        
        {groupsLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 text-cybergold-500 animate-spin" />
          </div>
        ) : filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map(group => (
              <Card key={group.id} className="bg-cyberdark-900 border-cyberdark-700">
                <CardHeader>
                  <CardTitle className="text-cybergold-300">{group.name}</CardTitle>
                  <CardDescription className="text-cybergold-500">{group.description || ""}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-cybergold-400">
                    {group.memberCount || group.members?.length || 0} medlemmer
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="secondary" 
                    onClick={() => setSelectedGroup(group as unknown as GroupType)}>
                    Vis chat
                  </Button>
                  <div className="flex items-center gap-1">
                    {group.visibility === 'private' && (
                      <Lock className="h-4 w-4 text-cybergold-500" />
                    )}
                    {group.securityLevel === "high" && (
                      <Shield className="h-4 w-4 text-green-500" />
                    )}
                    {group.is_premium && (
                      <Star className="h-4 w-4 text-cybergold-400" />
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-cybergold-500">
            Ingen grupper funnet.
          </div>
        )}
        
        {/* Create Group Dialog */}
        <Dialog open={isCreatingGroup} onOpenChange={setIsCreatingGroup}>
          <DialogContent className="bg-cyberdark-900 border-cybergold-500/30 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-cybergold-300">Lag ny gruppe</DialogTitle>
              <DialogDescription className="text-cybergold-500">
                Fyll ut skjemaet nedenfor for å opprette en ny gruppe.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-cybergold-300">
                  Navn
                </label>
                <Input
                  type="text"
                  id="name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="col-span-3 bg-cyberdark-800 text-cybergold-200 border-cyberdark-700 focus:border-cybergold-500"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="description" className="text-right text-cybergold-300">
                  Beskrivelse
                </label>
                <Textarea
                  id="description"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="col-span-3 bg-cyberdark-800 text-cybergold-200 border-cyberdark-700 focus:border-cybergold-500"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="visibility" className="text-right text-cybergold-300">
                  Synlighet
                </label>
                <select
                  id="visibility"
                  value={newGroupVisibility}
                  onChange={(e) => setNewGroupVisibility(e.target.value as GroupVisibility)}
                  className="col-span-3 bg-cyberdark-800 text-cybergold-200 border-cyberdark-700 focus:border-cybergold-500"
                >
                  <option value="private">Privat</option>
                  <option value="public">Offentlig</option>
                  <option value="hidden">Skjult</option>
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="encrypted" className="text-right text-cybergold-300">
                  Kryptert
                </label>
                <Switch
                  id="encrypted"
                  checked={newGroupEncrypted}
                  onCheckedChange={(checked) => setNewGroupEncrypted(checked)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" onClick={handleCreateGroup} className="bg-cybergold-600 text-black hover:bg-cybergold-500">
                Opprett gruppe
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Join Group Dialog */}
        <Dialog open={isJoiningGroup} onOpenChange={setIsJoiningGroup}>
          <DialogContent className="bg-cyberdark-900 border-cybergold-500/30 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-cybergold-300">Bli med i gruppe</DialogTitle>
              <DialogDescription className="text-cybergold-500">
                Skriv inn gruppekoden for å bli med.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="code" className="text-right text-cybergold-300">
                  Kode
                </label>
                <Input
                  type="text"
                  id="code"
                  value={groupPassword}
                  onChange={(e) => setGroupPassword(e.target.value)}
                  className="col-span-3 bg-cyberdark-800 text-cybergold-200 border-cyberdark-700 focus:border-cybergold-500"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" onClick={() => handleJoinGroup(groupPassword)} className="bg-cybergold-600 text-black hover:bg-cybergold-500">
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
                  {selectedGroup.memberCount || selectedGroup.members?.length || 0} medlemmer 
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
            {/* Offline indicator */}
            {offlineIndicator && (
              <div className="mr-3 flex items-center px-2 py-1 bg-red-950/50 border border-red-800/60 rounded-full">
                <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                <span className="text-xs text-red-400">Offline</span>
              </div>
            )}
            
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
      
      {/* Offline mode banner */}
      {offlineIndicator && (
        <div className="bg-red-950/30 px-4 py-2 border-b border-red-800/30 flex items-center">
          <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-sm text-red-300 flex-1">
            Du er offline. Meldinger vil bli lagret lokalt og sendt når du er tilkoblet igjen.
          </span>
          <button 
            className="text-xs text-red-400 hover:text-red-300 underline"
            onClick={() => window.location.reload()}
          >
            Prøv på nytt
          </button>
        </div>
      )}
      
      {/* Messages area */}
      <div className="flex-1 overflow-hidden">
        <GroupMessageList 
          messages={Array.isArray(groupMessages) 
            ? groupMessages.map(msg => normalizeMessage(msg))
            : []} 
          isLoading={messagesLoading}
          userProfiles={userProfiles}
          onMessageEdit={handleEditMessage}
          onMessageDelete={handleDeleteMessage}
          onMessageReply={handleReplyToMessage}
          onReactionAdd={handleReactionAdd}
          hasMoreMessages={hasMoreMessages}
          loadMoreMessages={handleLoadMoreMessages}
          currentUserId={user?.id}
          offlineMode={offlineIndicator}
        />
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t border-cyberdark-700">
        <MessageInput
          onSendMessage={handleSendMessage}
          onSendEnhancedMedia={handleSendMedia}
          editingMessageId={editingMessageId}
          editingContent={editingMessageId ? (
            groupMessages.find(m => m.id === editingMessageId)?.content || '') : ''}
          securityLevel={mapSecurityLevelToMessageInput(selectedGroup.securityLevel)}
          showSecurityIndicator={true}
          onCancelEdit={() => setEditingMessageId(null)}
          replyToMessage={replyToMessage}
          onCancelReply={() => setReplyToMessage(null)}
          ttl={disappearingTime}
          onChangeTtl={toggleDisappearingMessages}
          isEncrypted={isHighSecurityGroup(selectedGroup.securityLevel)}
        />
      </div>
      
      {/* Hidden file input for image uploads */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*,video/*" 
        onChange={handleFileUpload} 
        className="hidden" 
      />
    </div>
  );
};

export default GroupChatPage;
