/**
 * InvitesPage Component
 * 
 * Side for å administrere gruppeinvitasjoner
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useGroup } from '@/features/groups/context/GroupContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UserPlus, 
  Users, 
  Check, 
  X, 
  Search, 
  Clock, 
  ArrowLeft,
  ExternalLink,
  Share2
} from 'lucide-react';
import { TelegramIcon, FacebookIcon, InstagramIcon, SnapchatIcon, TikTokIcon } from '@/features/groups/components/SocialIcons';

const InvitesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    myInvites, 
    acceptInvite, 
    rejectInvite, 
    loading 
  } = useGroup();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  
  // Filter invites based on search
  const filteredInvites = myInvites.filter(invite => 
    invite.group?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invite.creator?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle accepting an invite
  const handleAcceptInvite = async (inviteCode: string) => {
    const success = await acceptInvite(inviteCode);
    if (success) {
      toast({
        title: 'Invitasjon godtatt!',
        description: 'Du er nå medlem av gruppen.',
      });
    }
  };
  
  // Handle rejecting an invite
  const handleRejectInvite = async (inviteId: string) => {
    const success = await rejectInvite(inviteId);
    if (success) {
      toast({
        title: 'Invitasjon avvist',
        description: 'Invitasjonen er fjernet.',
      });
    }
  };
  
  // Mock data for sent invites (would come from API)
  const sentInvites = [
    {
      id: '1',
      group_id: 'group1',
      group: {
        name: 'Design System',
        avatar_url: '/assets/design.jpg',
        member_count: 12
      },
      recipient_email: 'designer@example.com',
      status: 'pending',
      platform: 'telegram',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString()
    },
    {
      id: '2',
      group_id: 'group2',
      group: {
        name: 'MCP Development',
        avatar_url: '/assets/mcp.jpg',
        member_count: 8
      },
      recipient_email: 'dev@example.com',
      status: 'accepted',
      platform: 'facebook',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString()
    }
  ];
  
  // Get platform icon
  const getPlatformIcon = (platform?: string) => {
    switch (platform) {
      case 'telegram':
        return <TelegramIcon className="w-4 h-4 text-blue-500" />;
      case 'facebook':
        return <FacebookIcon className="w-4 h-4 text-blue-600" />;
      case 'instagram':
        return <InstagramIcon className="w-4 h-4 text-pink-600" />;
      case 'snapchat':
        return <SnapchatIcon className="w-4 h-4 text-yellow-400" />;
      case 'tiktok':
        return <TikTokIcon className="w-4 h-4 text-black" />;
      default:
        return <UserPlus className="w-4 h-4 text-gray-500" />;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">Invitasjoner</h1>
        </div>
      </div>
      
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Søk i invitasjoner..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'received' | 'sent')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received">
            Mottatt ({myInvites.length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            Sendt ({sentInvites.length})
          </TabsTrigger>
        </TabsList>
        
        {/* Received Invites */}
        <TabsContent value="received">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredInvites.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-lg">
              <UserPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Ingen invitasjoner</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Ingen invitasjoner matcher søket ditt.' : 'Du har ingen ventende invitasjoner.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4 mt-6">
              {filteredInvites.map(invite => (
                <Card key={invite.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="mr-3">
                          <AvatarImage src={invite.group?.avatar_url} />
                          <AvatarFallback>{invite.group?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{invite.group?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Fra {invite.creator?.username || 'En bruker'}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(invite.created_at)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {invite.group?.member_count || 0} medlemmer
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Utløper {formatDate(invite.expires_at)}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-end gap-2 w-full">
                      <Button 
                        variant="outline" 
                        onClick={() => handleRejectInvite(invite.id)}
                      >
                        <X className="w-4 h-4 mr-2" /> Avvis
                      </Button>
                      <Button 
                        onClick={() => handleAcceptInvite(invite.invite_code)}
                      >
                        <Check className="w-4 h-4 mr-2" /> Godta
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Sent Invites */}
        <TabsContent value="sent">
          <div className="space-y-4 mt-6">
            {sentInvites.length === 0 ? (
              <div className="text-center py-12 bg-muted rounded-lg">
                <Share2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Ingen sendte invitasjoner</h3>
                <p className="text-muted-foreground">
                  Du har ikke sendt noen invitasjoner ennå.
                </p>
              </div>
            ) : (
              sentInvites.map(invite => (
                <Card key={invite.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="mr-3">
                          <AvatarImage src={invite.group?.avatar_url} />
                          <AvatarFallback>{invite.group?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{invite.group?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Til {invite.recipient_email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(invite.platform)}
                        <Badge 
                          variant={invite.status === 'accepted' ? 'default' : 'secondary'}
                        >
                          {invite.status === 'accepted' ? 'Godtatt' : 
                           invite.status === 'rejected' ? 'Avvist' : 'Venter'}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {invite.group?.member_count || 0} medlemmer
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Sendt {formatDate(invite.created_at)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Utløper {formatDate(invite.expires_at)}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-end gap-2 w-full">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Se gruppe
                      </Button>
                      {invite.status === 'pending' && (
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4 mr-2" />
                          Send igjen
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvitesPage;
