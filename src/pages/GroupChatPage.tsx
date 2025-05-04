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
  Lock,
  Shield,
  Star,
  Loader2,
  ArrowLeft,
  Menu,
  Clock,
  LogOut,
  Settings,
  Share2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Group, GroupVisibility, GroupMember, GroupMessage } from '@/features/groups/types/group';
import { SecurityLevel } from '@/types/security';
import { usePresence } from '@/hooks/usePresence';
import { ChatMessage, normalizeMessage } from '@/types/messages';
import AppChatInterface from '@/components/chat/AppChatInterface';

// Define Group type with compatibility for both property naming styles
type GroupType = Group & {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  memberCount?: number;
  visibility?: GroupVisibility;
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
  const [groupPassword, setGroupPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupVisibility, setNewGroupVisibility] = useState<GroupVisibility>('private');
  const [newGroupEncrypted, setNewGroupEncrypted] = useState(true);
  const [disappearingTime, setDisappearingTime] = useState(0);
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
      handleStatusChange('online');
    } else {
      handleStatusChange('online');
    }
    
    return () => {
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
        setSelectedGroup(foundGroup as unknown as GroupType);
      }
    }
  }, [id, groups]);

  // Mark messages as read when viewing a group
  useEffect(() => {
    if (selectedGroup?.id) {
      loadGroup();
    }
  }, [selectedGroup?.id, loadGroup]);

  // Function to convert SecurityLevel to MessageInput.securityLevel
  const mapSecurityLevelToMessageInput = (level?: SecurityLevel): 'p2p_e2ee' | 'server_e2ee' | 'standard' => {
    if (!level) return 'standard';
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
        setSelectedGroup(newGroup as unknown as GroupType);
        setIsCreatingGroup(false);
      }
      
      setNewGroupName('');
      setNewGroupDesc('');
      setNewGroupVisibility('private');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Kunne ikke opprette gruppen";
      toast({
        variant: "destructive",
        title: "Feil ved oppretting av gruppe",
        description: errorMessage,
      });
    }
  };
  
  const handleJoinGroup = async (code: string) => {
    try {
      await codeToJoin(code);
      await fetchGroups();
      const joinedGroup = groups.find(g => g.id === code);
      if (joinedGroup) {
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

  const codeToJoin = async (code: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

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
  
  const handleSendMessage = async (text: string, attachments?: File[]) => {
    if (!selectedGroup) return;
    try {
      if (attachments && attachments.length > 0) {
        for (const file of attachments) {
          const localUrl = URL.createObjectURL(file);
          const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
          await sendMessage({
            mediaUrl: localUrl,
            mediaType,
            ttl: disappearingTime > 0 ? disappearingTime : undefined,
            isEncrypted: selectedGroup.securityLevel === "high"
          });
        }
      } else if (editingMessageId) {
        await editMessage(editingMessageId, text);
        setEditingMessageId(null);
      } else if (replyToMessage) {
        await replyToMessageFunc(replyToMessage.id, text);
        setReplyToMessage(null);
      } else {
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
  
  const handleLoadMoreMessages = async () => {
    if (!group) return;
    try {
      await loadMessages(50);
      setHasMoreMessages(false);
    } catch (error) {
      console.error('Error loading more messages:', error);
    }
  };

  const renderGroupHeader = () => {
    if (!selectedGroup) return null;
    return (
      <>
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
                        {disappearingTime} sekunder
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              {offlineIndicator && (
                <div className="mr-3 flex items-center px-2 py-1 bg-red-950/50 border border-red-800/60 rounded-full">
                  <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                  <span className="text-xs text-red-400">Offline</span>
                </div>
              )}
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
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Vis medlemmer
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-cybergold-400 focus:text-cybergold-300 focus:bg-cyberdark-700"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Inviter medlemmer
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-cybergold-400 focus:text-cybergold-300 focus:bg-cyberdark-700"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Gruppeinnstillinger
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-cyberdark-700" />
                  <DropdownMenuItem 
                    className="text-amber-400 focus:text-amber-300 focus:bg-cyberdark-700"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {disappearingTime > 0 ? 'Deaktiver selvslettende meldinger' : 'Aktiver selvslettende meldinger'}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-cybergold-400 focus:text-cybergold-300 focus:bg-cyberdark-700"
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
      </>
    );
  };
  
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

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <AppChatInterface
        messages={Array.isArray(groupMessages) 
          ? groupMessages.map(msg => normalizeMessage(msg))
          : []} 
        variant="group"
        currentUserId={user?.id}
        chatTitle={selectedGroup.name}
        chatSubtitle={`${selectedGroup.memberCount || selectedGroup.members?.length || 0} medlemmer`}
        placeholder={`Skriv en melding til ${selectedGroup.name}...`}
        disableInput={false}
        isMessageRead={() => true}
        onSendMessage={handleSendMessage}
        onEditMessage={(message) => setEditingMessageId(message.id)}
        onDeleteMessage={deleteMessage}
        onReplyToMessage={(message) => setReplyToMessage(message as ChatMessage)}
        onReactionSelect={handleReactionAdd}
        onMessageExpired={(messageId) => deleteMessage(messageId)}
        onLoadMore={handleLoadMoreMessages}
        hasMoreMessages={hasMoreMessages}
        loading={messagesLoading}
        userStatus={userPresence}
        securityLevel={selectedGroup.securityLevel || 'standard'}
        ephemeralMessagesEnabled={true}
        ephemeralMessageTTL={disappearingTime}
        inputAttachmentsEnabled={true}
        inputReactionsEnabled={true}
        inputEncryptionEnabled={isHighSecurityGroup(selectedGroup.securityLevel)}
        renderHeader={renderGroupHeader}
      />
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*,video/*" 
        className="hidden" 
      />
    </div>
  );
};

export default GroupChatPage;
