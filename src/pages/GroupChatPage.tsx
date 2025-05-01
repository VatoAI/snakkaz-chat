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
import MessageInput from '@/components/message-input/MessageInput';
import { Group, GroupVisibility, SecurityLevel } from '@/types/group';
import { usePresence } from '@/hooks/usePresence';

const GroupChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { userProfiles, fetchProfiles } = useProfiles();
  const { updatePresence, presenceData } = usePresence();
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for active group
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
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
  const [replyToMessage, setReplyToMessage] = useState<any | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  
  // Get groups
  const { 
    groups, 
    fetchGroups,
    createGroup,
    loading: groupsLoading 
  } = useGroups();

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
    loadMessages
  } = useGroupChat(selectedGroup?.id);
  
  // Oppdater presence når vi bytter gruppe
  useEffect(() => {
    if (selectedGroup?.id && user?.id) {
      updatePresence({
        status: 'online',
        currentGroupId: selectedGroup.id,
        lastActive: new Date()
      });
    } else {
      updatePresence({
        status: 'online',
        currentGroupId: null,
        lastActive: new Date()
      });
    }
    
    return () => {
      // Når komponenten unmounter, fjern currentGroupId
      if (user?.id) {
        updatePresence({
          status: 'online',
          currentGroupId: null,
          lastActive: new Date()
        });
      }
    };
  }, [selectedGroup?.id, user?.id, updatePresence]);
  
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Kunne ikke bli med i gruppen";
      toast({
        variant: "destructive",
        title: "Feil ved tilkobling til gruppe",
        description: errorMessage,
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

  // Håndter bilde/mediaopplastning via fil-input
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
  
  // Håndter redigering av melding
  const handleEditMessage = (message: any) => {
    setEditingMessageId(message.id);
    // Setter meldingsteksten i input-feltet
    // Dette må gjøres i MessageInput komponenten
  };
  
  // Håndter sletting av melding
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
  
  // Håndter svar på melding
  const handleReplyToMessage = (message: any) => {
    setReplyToMessage(message);
  };
  
  // Håndter reaksjoner på melding
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
  
  // Laster flere meldinger (eldre)
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
  
  // Render group list if no group is selected
  if (!selectedGroup) {
    // ... existing group list code ...
    return (
      <div className="container max-w-6xl mx-auto py-6">
        {/* ... existing code ... */}
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
      
      {/* Messages area - Now using our new GroupMessageList component */}
      <div className="flex-1 overflow-hidden">
        <GroupMessageList 
          messages={groupMessages || []}
          isLoading={messagesLoading}
          userProfiles={userProfiles}
          onMessageEdit={handleEditMessage}
          onMessageDelete={handleDeleteMessage}
          onMessageReply={handleReplyToMessage}
          onReactionAdd={handleReactionAdd}
          onLoadMore={handleLoadMoreMessages}
          hasMoreMessages={hasMoreMessages}
          isEncryptedGroup={selectedGroup.securityLevel === "high"}
        />
      </div>
      
      {/* Hidden file input for media uploads */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*"
        onChange={handleFileUpload}
      />
      
      {/* Bottom menu bar with camera/gallery shortcuts */}
      <div className="bg-cyberdark-900 border-t border-b border-cyberdark-700 px-4 py-2 flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-cybergold-500"
            onClick={() => fileInputRef.current?.click()}
            title="Send bilde eller video"
          >
            <Image className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-cybergold-500"
            onClick={() => {
              // Ta bilde med kamera
              // For demo-formål viser vi bare en toast
              toast({
                title: "Kamera",
                description: "Kamera-funksjonalitet vil være tilgjengelig snart"
              });
            }}
            title="Ta bilde med kamera"
          >
            <Camera className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Disappearing messages selector */}
        {disappearingTime > 0 && (
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 text-amber-400 mr-1.5" />
            <select 
              value={disappearingTime}
              onChange={(e) => toggleDisappearingMessages(Number(e.target.value))}
              className="text-xs bg-cyberdark-800 border-none text-amber-400 rounded py-1"
            >
              <option value="300">5 minutter</option>
              <option value="3600">1 time</option>
              <option value="86400">1 dag</option>
              <option value="604800">7 dager</option>
              <option value="0">Deaktiver</option>
            </select>
          </div>
        )}
      </div>
      
      {/* Input area - Using our improved MessageInput component */}
      <div className="bg-cyberdark-900">
        <MessageInput
          onSendMessage={handleSendMessage}
          onSendMedia={handleSendMedia}
          placeholder={
            editingMessageId ? "Rediger melding..." : 
            replyToMessage ? "Skriv et svar..." : 
            "Skriv en melding..."
          }
          securityLevel={selectedGroup.securityLevel === "high" ? 'server_e2ee' : 'standard'}
          showSecurityIndicator={true}
          editingMessage={editingMessageId ? {
            id: editingMessageId,
            content: groupMessages?.find(m => m.id === editingMessageId)?.text || ''
          } : null}
          onCancelEdit={() => setEditingMessageId(null)}
          autoFocus={!!editingMessageId}
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
          
          {/* ...dialog content... */}
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
          
          {/* ...dialog content... */}
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
          
          {/* ...dialog content... */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupChatPage;