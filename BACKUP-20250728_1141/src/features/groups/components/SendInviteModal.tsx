/**
 * SendInviteModal Component
 * 
 * FASE 2: Moderne invite-system med sosiale medier-integrasjon og link-deling
 * Lar brukere invitere til grupper via populære plattformer som Telegram, Snapchat, Facebook, Instagram og TikTok
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageCircle,
  Send, 
  Copy, 
  Check, 
  Users, 
  Search,
  Clock,
  X,
  Share2,
  QrCode,
  AlertCircle,
  Smartphone,
  Facebook,
  Instagram,
  Camera as SnapchatIcon,
  Send as TelegramIcon,
  Image as TikTokIcon
} from 'lucide-react';
import { cn, generateInviteCode } from '@/lib/utils';

interface User {
  id: string;
  username: string;
  avatar_url?: string;
  email?: string;
}

interface SendInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
  className?: string;
}

const SendInviteModal: React.FC<SendInviteModalProps> = ({
  isOpen,
  onClose,
  groupId,
  groupName,
  className
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // State
  const [activeTab, setActiveTab] = useState<'social' | 'link' | 'search'>('social');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['telegram']);
  const [inviteLink, setInviteLink] = useState('');
  const [inviteMessage, setInviteMessage] = useState(
    `Bli med i min gruppe "${groupName}" på SnakkaZ! Det er så mye bedre enn andre plattformer - raskere, sikrere og med bedre MCP-integrering! 🚀`
  );
  const [linkCopied, setLinkCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableSound, setEnableSound] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [sentInvites, setSentInvites] = useState<string[]>([]);

  // Platforms configuration
  const platforms = [
    { id: 'telegram', name: 'Telegram', icon: TelegramIcon, color: 'bg-blue-500', benefits: 'Raskere og bedre gruppesamtaler enn Telegram' },
    { id: 'snapchat', name: 'Snapchat', icon: SnapchatIcon, color: 'bg-yellow-400', benefits: 'Meldinger som ikke forsvinner som på Snapchat' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600', benefits: 'Mer privat enn Facebook Messenger' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-600', benefits: 'Raskere og mer responsivt enn Instagram DMs' },
    { id: 'tiktok', name: 'TikTok', icon: TikTokIcon, color: 'bg-black', benefits: 'Bedre gruppesamtaler enn TikTok DMs' }
  ];

  // Generate invitation link
  const generateLink = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Generate a unique invite code
      const inviteCode = generateInviteCode();
      
      // Store the invite in the database
      const { error } = await supabase
        .from('group_invites')
        .insert({
          group_id: groupId,
          created_by: user.id,
          invite_code: inviteCode,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        });
      
      if (error) throw error;
      
      // Create the invite link
      const baseUrl = window.location.origin;
      const newInviteLink = `${baseUrl}/invite/${inviteCode}`;
      setInviteLink(newInviteLink);
      
    } catch (err) {
      console.error('Error creating invite:', err);
      toast({
        title: 'Kunne ikke generere invitasjonslink',
        description: 'Vennligst prøv igjen senere.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Copy invite link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    
    toast({
      title: 'Invitasjonslenke kopiert!',
      description: 'Du kan nå dele den hvor du vil.',
    });
    
    setTimeout(() => {
      setLinkCopied(false);
    }, 3000);
  };

  // Toggle selected platform
  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId) 
        : [...prev, platformId]
    );
  };

  // Share invitation to selected platform
  const shareToPlatform = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return;

    const shareMessage = `${inviteMessage}\n\n${inviteLink}`;
    
    // Implementation for sharing to different platforms
    switch (platformId) {
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(inviteMessage)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}&quote=${encodeURIComponent(inviteMessage)}`, '_blank');
        break;
      case 'instagram':
        // Instagram doesn't have a direct share URL, copy to clipboard instead
        navigator.clipboard.writeText(shareMessage);
        toast({
          title: `Tekst kopiert for deling på ${platform.name}!`,
          description: 'Lim det inn i Instagram-appen.',
        });
        break;
      default:
        navigator.clipboard.writeText(shareMessage);
        toast({
          title: `Tekst kopiert for deling på ${platform.name}!`,
          description: 'Lim det inn i appen.',
        });
    }
  };

  // Search for users
  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .or(`username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
        .limit(10);
      
      if (error) throw error;
      
      setSearchResults(data || []);
    } catch (err) {
      console.error('Error searching users:', err);
      toast({
        title: 'Søkefeil',
        description: 'Kunne ikke søke etter brukere. Prøv igjen senere.',
        variant: 'destructive',
      });
    }
  };

  // Add user to selection
  const addUser = (user: User) => {
    if (!selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers(prev => [...prev, user]);
    }
  };

  // Remove user from selection
  const removeUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(user => user.id !== userId));
  };

  // Send direct invites to selected users
  const sendDirectInvites = async () => {
    if (selectedUsers.length === 0) return;
    
    setLoading(true);
    try {
      const invites = selectedUsers.map(user => ({
        group_id: groupId,
        invited_user_id: user.id,
        invited_by: user?.id || '',
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      }));
      
      const { data, error } = await supabase
        .from('group_invites')
        .insert(invites)
        .select('invited_user_id');
      
      if (error) throw error;
      
      setSentInvites((data || []).map((invite: any) => invite.invited_user_id));
      
      toast({
        title: 'Invitasjoner sendt!',
        description: `Sendt til ${selectedUsers.length} ${selectedUsers.length === 1 ? 'bruker' : 'brukere'}.`,
      });
    } catch (err) {
      console.error('Error sending invites:', err);
      toast({
        title: 'Kunne ikke sende invitasjoner',
        description: 'Vennligst prøv igjen senere.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate QR code for invite link
  const generateQRCode = () => {
    if (!inviteLink) return null;
    
    // This would actually generate a QR code in a real implementation
    return (
      <div className="w-48 h-48 bg-white p-4 mx-auto rounded-lg flex items-center justify-center">
        <QrCode className="w-32 h-32 text-cyberdark-900" />
      </div>
    );
  };
  
  // Effect for searching users when query changes
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery) {
        searchUsers();
      }
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "bg-cyberdark-900 border-cyberdark-700 text-cybergold-100 p-0 max-w-md md:max-w-lg overflow-hidden",
        className
      )}>
        <DialogHeader className="px-4 pt-4">
          <DialogTitle className="text-xl text-cybergold-100 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-cybergold-400" />
            Inviter til {groupName}
          </DialogTitle>
          <DialogDescription className="text-cybergold-400">
            Del gruppen din med venner fra dine favorittplattformer
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="social" value={activeTab} onValueChange={(val: any) => setActiveTab(val)} className="w-full">
          <TabsList className="grid grid-cols-3 bg-cyberdark-800 p-1 mx-4">
            <TabsTrigger value="social" className="text-sm text-cybergold-100 data-[state=active]:bg-cybergold-600/10">
              <Share2 className="h-4 w-4 mr-1.5" /> Sosiale medier
            </TabsTrigger>
            <TabsTrigger value="link" className="text-sm text-cybergold-100 data-[state=active]:bg-cybergold-600/10">
              <QrCode className="h-4 w-4 mr-1.5" /> Invitasjonslenke
            </TabsTrigger>
            <TabsTrigger value="search" className="text-sm text-cybergold-100 data-[state=active]:bg-cybergold-600/10">
              <Search className="h-4 w-4 mr-1.5" /> Finn brukere
            </TabsTrigger>
          </TabsList>
          
          <div className="p-4 overflow-auto max-h-[60vh]">
            {/* Social Media Tab */}
            <TabsContent value="social" className="space-y-4 mt-1">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-cybergold-300 mb-2">Velg plattformer</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {platforms.map(platform => (
                      <div
                        key={platform.id}
                        onClick={() => handlePlatformToggle(platform.id)}
                        className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedPlatforms.includes(platform.id)
                            ? 'border-cybergold-500 bg-cybergold-900/20'
                            : 'border-cyberdark-700 hover:border-cyberdark-600'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full ${platform.color} flex items-center justify-center mb-2`}>
                          <platform.icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm text-cybergold-100">{platform.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm text-cybergold-300">
                    Tilpass meldingen
                  </Label>
                  <Textarea
                    id="message"
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    placeholder="Skriv en personlig invitasjon..."
                    className="h-24 bg-cyberdark-800 border-cyberdark-700 text-cybergold-100 placeholder:text-cybergold-500 resize-none"
                  />
                </div>
                
                {!inviteLink && (
                  <Button
                    onClick={generateLink}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyberblue-600 to-cyberblue-800 text-white hover:from-cyberblue-700 hover:to-cyberblue-900"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Genererer invitasjonslenke...
                      </>
                    ) : (
                      'Generer invitasjonslenke'
                    )}
                  </Button>
                )}
                
                {inviteLink && (
                  <div className="space-y-4">
                    <div className="bg-cyberdark-800/50 p-3 rounded-md border border-cyberdark-600">
                      <p className="text-sm text-cybergold-400 break-all">{inviteLink}</p>
                    </div>
                    
                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                      {selectedPlatforms.map(platformId => {
                        const platform = platforms.find(p => p.id === platformId);
                        if (!platform) return null;
                        
                        return (
                          <Button
                            key={platformId}
                            onClick={() => shareToPlatform(platformId)}
                            className="bg-cyberdark-800 hover:bg-cyberdark-700 border border-cyberdark-600 text-cybergold-100 text-sm"
                          >
                            <platform.icon className="h-4 w-4 mr-1.5" />
                            Del på {platform.name}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-cybergold-900/10 border border-cybergold-700/20 p-3 rounded-lg">
                <h4 className="font-medium text-cybergold-200 mb-2 flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  SnakkaZ fordeler
                </h4>
                <ul className="space-y-1 text-xs text-cybergold-400">
                  {selectedPlatforms.map(platformId => {
                    const platform = platforms.find(p => p.id === platformId);
                    return platform ? (
                      <li key={platformId} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-cybergold-500 flex-shrink-0" />
                        {platform.benefits}
                      </li>
                    ) : null;
                  })}
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-cybergold-500 flex-shrink-0" />
                    Avansert MCP-integrering med AI-assistanse
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-cybergold-500 flex-shrink-0" />
                    Bedre personvern og sikkerhet
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            {/* Invite Link Tab */}
            <TabsContent value="link" className="space-y-4 mt-1">
              <div className="space-y-4">
                <p className="text-cybergold-400 text-sm">
                  Generer en invitasjonslenke som du kan dele hvor som helst. Lenken er gyldig i 7 dager.
                </p>
                
                {!inviteLink ? (
                  <Button
                    onClick={generateLink}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyberblue-600 to-cyberblue-800 text-white hover:from-cyberblue-700 hover:to-cyberblue-900"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Genererer invitasjonslenke...
                      </>
                    ) : (
                      'Generer invitasjonslenke'
                    )}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-cyberdark-800 p-3 rounded-md border border-cyberdark-600 flex-1">
                        <p className="text-sm font-mono text-cybergold-300 break-all">{inviteLink}</p>
                      </div>
                      <Button
                        size="icon"
                        onClick={copyToClipboard}
                        className="bg-cyberdark-800 hover:bg-cyberdark-700 border border-cyberdark-600 text-cybergold-100 h-[46px] w-[46px]"
                      >
                        {linkCopied ? (
                          <Check className="h-4 w-4 text-cybergreen-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    {generateQRCode()}
                    
                    <div className="p-4 bg-cyberdark-800/50 rounded-lg border border-cyberdark-600">
                      <h4 className="font-medium text-sm text-cybergold-200 mb-3 flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-cybergold-400" />
                        Mobil notifikasjoner
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-join" className="flex items-center gap-2 text-sm text-cybergold-300">
                            Varsle meg når noen blir med
                          </Label>
                          <Switch 
                            id="notify-join" 
                            checked={enableNotifications}
                            onCheckedChange={setEnableNotifications}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-sound" className="flex items-center gap-2 text-sm text-cybergold-300">
                            Lyd ved nye medlemmer
                          </Label>
                          <Switch 
                            id="notify-sound" 
                            checked={enableSound}
                            onCheckedChange={setEnableSound}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Search Users Tab */}
            <TabsContent value="search" className="space-y-4 mt-1">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-cybergold-500" />
                  <Input
                    placeholder="Søk etter brukere..."
                    className="pl-8 bg-cyberdark-800 border-cyberdark-700 text-cybergold-100"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {selectedUsers.length > 0 && (
                  <div>
                    <Label className="text-sm text-cybergold-300 mb-2 block">
                      Valgte brukere ({selectedUsers.length})
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedUsers.map(user => (
                        <Badge
                          key={user.id}
                          className="bg-cyberdark-800 text-cybergold-100 hover:bg-cyberdark-700 pl-1.5 pr-1 py-0.5"
                        >
                          <Avatar className="h-4 w-4 mr-1">
                            <AvatarFallback className="text-[8px]">{user.username?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {user.username}
                          <button
                            onClick={() => removeUser(user.id)}
                            className="ml-1 text-cybergold-400 hover:text-cybergold-100 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {searchResults.length > 0 ? (
                  <div>
                    <Label className="text-sm text-cybergold-300 mb-2 block">
                      Søkeresultater
                    </Label>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {searchResults.map(user => {
                        const isSelected = selectedUsers.some(u => u.id === user.id);
                        const isInvited = sentInvites.includes(user.id);
                        
                        return (
                          <button
                            key={user.id}
                            onClick={() => !isInvited && addUser(user)}
                            disabled={isInvited}
                            className={cn(
                              "w-full flex items-center gap-2 p-2 rounded-md text-left",
                              isSelected ? "bg-cybergold-900/20 border border-cybergold-500" : "hover:bg-cyberdark-800",
                              isInvited ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                            )}
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-cybergold-100">{user.username}</span>
                            {isSelected && (
                              <Check className="h-4 w-4 text-cybergold-500 ml-auto" />
                            )}
                            {isInvited && (
                              <span className="text-xs text-cybergold-400 ml-auto">Invitert</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : searchQuery ? (
                  <div className="text-center p-4">
                    <p className="text-cybergold-400 text-sm">
                      Ingen brukere funnet for "{searchQuery}"
                    </p>
                  </div>
                ) : null}
                
                {selectedUsers.length > 0 && (
                  <Button
                    onClick={sendDirectInvites}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyberblue-600 to-cyberblue-800 text-white hover:from-cyberblue-700 hover:to-cyberblue-900"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Sender invitasjoner...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-1.5" />
                        Send {selectedUsers.length} invitasjoner
                      </>
                    )}
                  </Button>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        <DialogFooter className="border-t border-cyberdark-700 bg-cyberdark-900/60 p-3 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-cyberdark-600 text-cybergold-100 hover:bg-cyberdark-800"
          >
            Lukk
          </Button>
          
          {inviteLink && (
            <div className="flex gap-2">
              <Button
                onClick={copyToClipboard}
                className="bg-cyberdark-800 hover:bg-cyberdark-700 border border-cyberdark-600 text-cybergold-100"
                size="sm"
              >
                {linkCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-1 text-cybergreen-500" />
                    Kopiert
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Kopier lenke
                  </>
                )}
              </Button>
              
              {activeTab === 'social' && selectedPlatforms.length > 0 && (
                <Button
                  onClick={() => shareToPlatform(selectedPlatforms[0])}
                  className="bg-gradient-to-r from-cyberblue-600 to-cyberblue-800 text-white hover:from-cyberblue-700 hover:to-cyberblue-900"
                  size="sm"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Del nå
                </Button>
              )}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendInviteModal;
