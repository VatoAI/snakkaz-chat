/**
 * GroupSettingsPage Component
 * 
 * Side for administrering av gruppeinnstillinger
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useGroup } from '@/features/groups/context/GroupContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Settings, 
  Users, 
  UserPlus, 
  UserMinus,
  Crown,
  Shield,
  User,
  Trash2,
  ArrowLeft,
  Lock,
  Globe,
  Camera,
  Share2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Member } from '@/features/groups/context/GroupContext';
import SendInviteModal from '@/features/groups/components/SendInviteModal';

const GroupSettingsPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    selectedGroup,
    getGroupById,
    updateGroup,
    deleteGroup,
    leaveGroup,
    removeMember,
    updateMemberRole,
    setSelectedGroup
  } = useGroup();
  
  // State
  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'invites' | 'danger'>('general');
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  
  // Form state
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    is_private: false
  });
  
  // Load group data
  useEffect(() => {
    const loadGroup = async () => {
      if (!groupId) return;
      
      setLoading(true);
      try {
        const group = await getGroupById(groupId);
        if (group) {
          setSelectedGroup(group);
          setGroupData({
            name: group.name,
            description: group.description || '',
            is_private: group.is_private
          });
          
          // Mock members data (would come from API)
          const mockMembers: Member[] = [
            {
              id: '1',
              user_id: group.created_by,
              role: 'admin',
              joined_at: group.created_at,
              user: {
                username: 'GroupCreator',
                avatar_url: '/assets/admin.jpg',
                online: true
              }
            },
            {
              id: '2',
              user_id: 'user2',
              role: 'moderator',
              joined_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
              user: {
                username: 'ModUser',
                avatar_url: '/assets/mod.jpg',
                online: false
              }
            },
            {
              id: '3',
              user_id: 'user3',
              role: 'member',
              joined_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
              user: {
                username: 'RegularUser',
                avatar_url: '/assets/user.jpg',
                online: true
              }
            }
          ];
          setMembers(mockMembers);
        } else {
          navigate('/groups');
        }
      } catch (error) {
        console.error('Error loading group:', error);
        navigate('/groups');
      } finally {
        setLoading(false);
      }
    };
    
    loadGroup();
  }, [groupId, getGroupById, setSelectedGroup, navigate]);
  
  // Check if current user is admin
  const isAdmin = members.some(member => 
    member.user_id === user?.id && member.role === 'admin'
  );
  
  // Check if current user is admin or moderator
  const canModerate = members.some(member => 
    member.user_id === user?.id && ['admin', 'moderator'].includes(member.role)
  );
  
  // Update group settings
  const handleUpdateGroup = async () => {
    if (!groupId || !isAdmin) return;
    
    const success = await updateGroup(groupId, groupData);
    if (success) {
      toast({
        title: 'Gruppeinformasjon oppdatert',
        description: 'Endringene er lagret.',
      });
    }
  };
  
  // Delete group
  const handleDeleteGroup = async () => {
    if (!groupId || !isAdmin) return;
    
    const success = await deleteGroup(groupId);
    if (success) {
      navigate('/groups');
    }
  };
  
  // Leave group
  const handleLeaveGroup = async () => {
    if (!groupId) return;
    
    const success = await leaveGroup(groupId);
    if (success) {
      navigate('/groups');
    }
  };
  
  // Remove member
  const handleRemoveMember = async (userId: string) => {
    if (!groupId || !canModerate) return;
    
    if (confirm('Er du sikker på at du vil fjerne dette medlemmet?')) {
      const success = await removeMember(groupId, userId);
      if (success) {
        setMembers(prev => prev.filter(member => member.user_id !== userId));
      }
    }
  };
  
  // Update member role
  const handleUpdateMemberRole = async (userId: string, newRole: Member['role']) => {
    if (!groupId || !isAdmin) return;
    
    const success = await updateMemberRole(groupId, userId, newRole);
    if (success) {
      setMembers(prev => 
        prev.map(member => 
          member.user_id === userId 
            ? { ...member, role: newRole }
            : member
        )
      );
    }
  };
  
  // Get role badge
  const getRoleBadge = (role: Member['role']) => {
    switch (role) {
      case 'admin':
        return (
          <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
            <Crown className="w-3 h-3 mr-1" /> Admin
          </Badge>
        );
      case 'moderator':
        return (
          <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
            <Shield className="w-3 h-3 mr-1" /> Moderator
          </Badge>
        );
      case 'member':
        return (
          <Badge variant="outline">
            <User className="w-3 h-3 mr-1" /> Medlem
          </Badge>
        );
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!selectedGroup) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Gruppe ikke funnet</h2>
        <Button onClick={() => navigate('/groups')}>Tilbake til grupper</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/group/${groupId}`)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedGroup.avatar_url} />
              <AvatarFallback>{selectedGroup.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{selectedGroup.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                {selectedGroup.is_private ? (
                  <>
                    <Lock className="w-4 h-4" /> Privat gruppe
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" /> Offentlig gruppe
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Generelt</TabsTrigger>
          <TabsTrigger value="members">Medlemmer ({members.length})</TabsTrigger>
          <TabsTrigger value="invites">Invitasjoner</TabsTrigger>
          <TabsTrigger value="danger">Farlig sone</TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gruppeinformasjon</CardTitle>
              <CardDescription>
                Administrer grunnleggende informasjon om gruppen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Gruppenavn</Label>
                <Input
                  id="name"
                  value={groupData.name}
                  onChange={(e) => setGroupData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isAdmin}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Beskrivelse</Label>
                <Textarea
                  id="description"
                  value={groupData.description}
                  onChange={(e) => setGroupData(prev => ({ ...prev, description: e.target.value }))}
                  disabled={!isAdmin}
                  placeholder="Beskriv hva gruppen handler om..."
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="private"
                  checked={groupData.is_private}
                  onCheckedChange={(checked) => setGroupData(prev => ({ ...prev, is_private: checked }))}
                  disabled={!isAdmin}
                />
                <Label htmlFor="private">Privat gruppe</Label>
              </div>
              
              {!isAdmin && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Info className="w-4 h-4" />
                    Du må være administrator for å endre disse innstillingene.
                  </div>
                </div>
              )}
            </CardContent>
            {isAdmin && (
              <CardFooter>
                <Button onClick={handleUpdateGroup}>
                  Lagre endringer
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Medlemmer</h3>
              <p className="text-muted-foreground">Administrer gruppemedlemmer og roller.</p>
            </div>
            {canModerate && (
              <Button onClick={() => setShowInviteModal(true)}>
                <UserPlus className="w-4 h-4 mr-2" /> Inviter
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {members.map(member => (
              <Card key={member.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.user.avatar_url} />
                        <AvatarFallback>{member.user.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.user.username}</p>
                        <p className="text-sm text-muted-foreground">
                          Ble med {formatDate(member.joined_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {member.user.online && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                        {getRoleBadge(member.role)}
                      </div>
                    </div>
                    
                    {canModerate && member.user_id !== user?.id && (
                      <div className="flex items-center gap-2">
                        {isAdmin && member.role !== 'admin' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateMemberRole(
                              member.user_id, 
                              member.role === 'moderator' ? 'member' : 'moderator'
                            )}
                          >
                            {member.role === 'moderator' ? 'Fjern moderator' : 'Gjør til moderator'}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveMember(member.user_id)}
                        >
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Invites Tab */}
        <TabsContent value="invites" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Invitasjoner</h3>
              <p className="text-muted-foreground">Administrer aktive invitasjoner til gruppen.</p>
            </div>
            {canModerate && (
              <Button onClick={() => setShowInviteModal(true)}>
                <Share2 className="w-4 h-4 mr-2" /> Ny invitasjon
              </Button>
            )}
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <Share2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Ingen aktive invitasjoner</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Danger Zone */}
        <TabsContent value="danger" className="space-y-6 mt-6">
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Farlig sone
              </CardTitle>
              <CardDescription>
                Irreversible handlinger som kan påvirke gruppen permanent.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border border-destructive/20 rounded-lg">
                  <h4 className="font-medium mb-2">Forlat gruppe</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Du vil ikke lenger være medlem av denne gruppen og miste tilgang til alle meldinger.
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setShowLeaveDialog(true)}
                  >
                    Forlat gruppe
                  </Button>
                </div>
                
                {isAdmin && (
                  <div className="p-4 border border-destructive/20 rounded-lg">
                    <h4 className="font-medium mb-2">Slett gruppe</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Dette vil slette gruppen permanent. Alle meldinger og data vil gå tapt.
                    </p>
                    <Button 
                      variant="destructive"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Slett gruppe
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Invite Modal */}
      {showInviteModal && (
        <SendInviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          groupId={groupId!}
          groupName={selectedGroup.name}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Slett gruppe</DialogTitle>
            <DialogDescription>
              Er du sikker på at du vil slette "{selectedGroup.name}"? 
              Denne handlingen kan ikke angres.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Avbryt
            </Button>
            <Button variant="destructive" onClick={handleDeleteGroup}>
              Slett gruppe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Leave Confirmation Dialog */}
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forlat gruppe</DialogTitle>
            <DialogDescription>
              Er du sikker på at du vil forlate "{selectedGroup.name}"? 
              Du kan bli invitert tilbake senere.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLeaveDialog(false)}>
              Avbryt
            </Button>
            <Button variant="destructive" onClick={handleLeaveGroup}>
              Forlat gruppe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupSettingsPage;
