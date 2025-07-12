/**
 * GroupSettingsPanel Component
 * 
 * Full-featured group settings panel with multiple tabs for group administration
 * Part of FASE 2 implementation
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader, Save, Users, Shield, AlertTriangle, X } from 'lucide-react';
import { GroupRole, SecurityLevel } from '@/features/groups/types/group';
import { GroupMember } from '@/types/group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface GroupSettingsPanelProps {
  groupId: string;
  onClose: () => void;
  onSaved?: () => void;
}

const GroupSettingsPanel: React.FC<GroupSettingsPanelProps> = ({ 
  groupId,
  onClose,
  onSaved 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  // Group state
  const [groupDetails, setGroupDetails] = useState<{
    id: string;
    name: string;
    description: string;
    avatar_url: string | null;
    securityLevel: SecurityLevel;
    allowMediaSharing: boolean;
    allowLinkPreviews: boolean;
    allowMemberInvites: boolean;
    isPrivate: boolean;
    creator_id: string;
  }>({
    id: groupId,
    name: '',
    description: '',
    avatar_url: null,
    securityLevel: 'standard',
    allowMediaSharing: true,
    allowLinkPreviews: true,
    allowMemberInvites: false,
    isPrivate: true,
    creator_id: '',
  });

  // Members state
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [userRole, setUserRole] = useState<GroupRole>('member');
  const [inviteEmail, setInviteEmail] = useState('');

  // Fetch group details
  useEffect(() => {
    const fetchGroupDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch group information
        const { data: groupData, error: groupError } = await supabase
          .from('group_chats')
          .select('*')
          .eq('id', groupId)
          .single();

        if (groupError) throw groupError;

        // Fetch group members
        const { data: membersData, error: membersError } = await supabase
          .from('group_members')
          .select('*, profiles:user_id(*)')
          .eq('group_id', groupId);

        if (membersError) throw membersError;

        // Fetch group settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('group_settings')
          .select('*')
          .eq('group_id', groupId)
          .single();

        const settings = settingsError ? null : settingsData;

        // Update state with fetched data
        setGroupDetails({
          id: groupId,
          name: groupData.name,
          description: groupData.description || '',
          avatar_url: groupData.avatar_url,
          securityLevel: settings?.security_level || 'standard',
          allowMediaSharing: settings?.allow_media_sharing ?? true,
          allowLinkPreviews: settings?.allow_link_previews ?? true,
          allowMemberInvites: settings?.allow_member_invites ?? false,
          isPrivate: settings?.is_private ?? true,
          creator_id: groupData.creator_id,
        });

        // Process members
        const processedMembers = membersData.map((member: any) => ({
          id: member.id,
          user_id: member.user_id,
          group_id: member.group_id,
          role: member.role,
          joined_at: member.joined_at,
          username: member.profiles?.username || 'Unknown',
          avatar_url: member.profiles?.avatar_url || null,
        }));

        setMembers(processedMembers);

        // Determine current user's role
        const currentUserMember = processedMembers.find(
          (member) => member.user_id === user?.id
        );
        if (currentUserMember) {
          setUserRole(currentUserMember.role as GroupRole);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching group details:', error);
        toast({
          title: 'Failed to load group settings',
          description: 'Please try again or contact support.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };

    if (groupId && user?.id) {
      fetchGroupDetails();
    }
  }, [groupId, user?.id, toast]);

  // Function to save changes
  const saveChanges = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      // Update group details
      const { error: groupUpdateError } = await supabase
        .from('group_chats')
        .update({
          name: groupDetails.name,
          description: groupDetails.description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', groupId);

      if (groupUpdateError) throw groupUpdateError;

      // Update or insert group settings
      const { error: settingsError } = await supabase
        .from('group_settings')
        .upsert({
          group_id: groupId,
          security_level: groupDetails.securityLevel,
          allow_media_sharing: groupDetails.allowMediaSharing,
          allow_link_previews: groupDetails.allowLinkPreviews,
          allow_member_invites: groupDetails.allowMemberInvites,
          is_private: groupDetails.isPrivate,
          updated_at: new Date().toISOString(),
          updated_by: user.id,
        });

      if (settingsError) throw settingsError;

      toast({
        title: 'Group settings saved',
        description: 'Your changes have been applied successfully.',
      });

      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      console.error('Error saving group settings:', error);
      toast({
        title: 'Failed to save settings',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Function to change member role
  const changeMemberRole = async (memberId: string, newRole: GroupRole) => {
    try {
      if (!user?.id || userRole !== 'admin' && groupDetails.creator_id !== user?.id) {
        toast({
          title: 'Permission denied',
          description: 'You do not have permission to change member roles.',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('group_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      // Update local state
      setMembers(members.map(member => 
        member.id === memberId ? { ...member, role: newRole } : member
      ));

      toast({
        title: 'Member role updated',
        description: 'The member role has been updated successfully.',
      });
    } catch (error) {
      console.error('Error changing member role:', error);
      toast({
        title: 'Failed to update member role',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    }
  };

  // Function to remove a member
  const removeMember = async (memberId: string, userId: string) => {
    try {
      if (!user?.id || (userRole !== 'admin' && userRole !== 'moderator' && groupDetails.creator_id !== user?.id)) {
        toast({
          title: 'Permission denied',
          description: 'You do not have permission to remove members.',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      // Update local state
      setMembers(members.filter(member => member.id !== memberId));

      toast({
        title: 'Member removed',
        description: 'The member has been removed from the group.',
      });
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: 'Failed to remove member',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    }
  };

  // Function to invite a new member
  const inviteMember = async () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Check if user exists
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', inviteEmail)
        .single();

      if (userError || !userData) {
        toast({
          title: 'User not found',
          description: 'No user with this email address was found.',
          variant: 'destructive',
        });
        return;
      }

      // Check if already a member
      const { data: existingMember, error: memberCheckError } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', userData.id)
        .single();

      if (existingMember) {
        toast({
          title: 'Already a member',
          description: 'This user is already a member of the group.',
          variant: 'destructive',
        });
        return;
      }

      // Create group invite
      const { error: inviteError } = await supabase
        .from('group_invites')
        .insert({
          group_id: groupId,
          invited_user_id: userData.id,
          invited_by: user?.id,
          status: 'pending',
        });

      if (inviteError) throw inviteError;

      toast({
        title: 'Invitation sent',
        description: 'The user has been invited to join the group.',
      });

      // Clear the input
      setInviteEmail('');
    } catch (error) {
      console.error('Error inviting member:', error);
      toast({
        title: 'Failed to send invitation',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    }
  };

  // Function to delete the group
  const deleteGroup = async () => {
    if (!user?.id || user.id !== groupDetails.creator_id) {
      toast({
        title: 'Permission denied',
        description: 'Only the group creator can delete the group.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Delete group
      const { error } = await supabase
        .from('group_chats')
        .delete()
        .eq('id', groupId);

      if (error) throw error;

      toast({
        title: 'Group deleted',
        description: 'The group has been deleted successfully.',
      });

      // Close panel and navigate away
      onClose();
    } catch (error) {
      console.error('Error deleting group:', error);
      toast({
        title: 'Failed to delete group',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setConfirmDeleteVisible(false);
    }
  };

  // Check user permissions
  const canManageGroup = userRole === 'admin' || userRole === 'moderator' || user?.id === groupDetails.creator_id;
  const canDeleteGroup = user?.id === groupDetails.creator_id;
  const canModifySettings = userRole === 'admin' || user?.id === groupDetails.creator_id;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-cybergold-500 mx-auto mb-2" />
          <p className="text-cybergold-500">Loading group settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h2 className="text-lg font-semibold text-cybergold-400">Group Settings: {groupDetails.name}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
            <TabsTrigger value="members" className="flex-1">Members</TabsTrigger>
            <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
            <TabsTrigger value="danger" className="flex-1 text-destructive">Danger</TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">Group Name</Label>
                <Input 
                  id="group-name"
                  value={groupDetails.name} 
                  onChange={(e) => setGroupDetails({...groupDetails, name: e.target.value})}
                  disabled={!canModifySettings}
                  placeholder="Enter group name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="group-description">Description</Label>
                <Textarea 
                  id="group-description"
                  value={groupDetails.description} 
                  onChange={(e) => setGroupDetails({...groupDetails, description: e.target.value})}
                  disabled={!canModifySettings}
                  placeholder="Enter group description"
                  rows={4}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="media-sharing">Allow Media Sharing</Label>
                  <p className="text-sm text-muted-foreground">Enable sharing of images and files</p>
                </div>
                <Switch 
                  id="media-sharing"
                  checked={groupDetails.allowMediaSharing} 
                  onCheckedChange={(checked) => setGroupDetails({...groupDetails, allowMediaSharing: checked})}
                  disabled={!canModifySettings}
                />
              </div>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            {canManageGroup && (
              <Card>
                <CardContent className="pt-4">
                  <h3 className="text-base font-semibold mb-2">Invite Members</h3>
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Enter email address" 
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                    <Button onClick={inviteMember}>
                      Invite
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <h3 className="text-base font-semibold mt-4 mb-2">Members ({members.length})</h3>
            
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between border-b border-border pb-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar_url || undefined} alt={member.username} />
                      <AvatarFallback>{member.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.role}
                        {member.user_id === groupDetails.creator_id ? ' (creator)' : ''}
                      </p>
                    </div>
                  </div>
                  
                  {canManageGroup && member.user_id !== user?.id && member.user_id !== groupDetails.creator_id && (
                    <div className="flex items-center space-x-2">
                      <Select 
                        value={member.role}
                        onValueChange={(value) => changeMemberRole(member.id, value as GroupRole)}
                        disabled={!canManageGroup || member.user_id === groupDetails.creator_id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => removeMember(member.id, member.user_id)}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="security-level">Security Level</Label>
                <Select 
                  value={groupDetails.securityLevel}
                  onValueChange={(value) => setGroupDetails({...groupDetails, securityLevel: value as SecurityLevel})}
                  disabled={!canModifySettings}
                >
                  <SelectTrigger id="security-level">
                    <SelectValue placeholder="Select security level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="maximum">Maximum</SelectItem>
                    {user?.premium && <SelectItem value="premium">Premium E2EE</SelectItem>}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Higher security levels enable additional encryption features.
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="link-previews">Allow Link Previews</Label>
                  <p className="text-sm text-muted-foreground">Enable previews for links shared in chat</p>
                </div>
                <Switch 
                  id="link-previews"
                  checked={groupDetails.allowLinkPreviews} 
                  onCheckedChange={(checked) => setGroupDetails({...groupDetails, allowLinkPreviews: checked})}
                  disabled={!canModifySettings}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="member-invites">Allow Member Invites</Label>
                  <p className="text-sm text-muted-foreground">Let members invite others to the group</p>
                </div>
                <Switch 
                  id="member-invites"
                  checked={groupDetails.allowMemberInvites} 
                  onCheckedChange={(checked) => setGroupDetails({...groupDetails, allowMemberInvites: checked})}
                  disabled={!canModifySettings}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="private-group">Private Group</Label>
                  <p className="text-sm text-muted-foreground">Group is not discoverable and requires invitation</p>
                </div>
                <Switch 
                  id="private-group"
                  checked={groupDetails.isPrivate} 
                  onCheckedChange={(checked) => setGroupDetails({...groupDetails, isPrivate: checked})}
                  disabled={!canModifySettings}
                />
              </div>
            </div>
          </TabsContent>

          {/* Danger Zone Tab */}
          <TabsContent value="danger" className="space-y-4">
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <h3 className="text-base font-semibold text-destructive">Danger Zone</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Leave Group</p>
                      <p className="text-sm text-muted-foreground">
                        You will no longer have access to this group's messages
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => {
                        const currentMember = members.find(m => m.user_id === user?.id);
                        if (currentMember) {
                          removeMember(currentMember.id, currentMember.user_id);
                          onClose();
                        }
                      }}
                    >
                      Leave Group
                    </Button>
                  </div>
                  
                  {canDeleteGroup && (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Delete Group</p>
                        <p className="text-sm text-muted-foreground">
                          This action cannot be undone. All messages will be permanently deleted.
                        </p>
                      </div>
                      <Button 
                        variant="destructive"
                        onClick={() => setConfirmDeleteVisible(true)}
                      >
                        Delete Group
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Actions footer */}
      <div className="p-4 border-t border-border mt-auto flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button 
          onClick={saveChanges}
          disabled={isSaving || !canModifySettings}
        >
          {isSaving ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={confirmDeleteVisible} onOpenChange={setConfirmDeleteVisible}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <p className="text-center font-semibold">Are you absolutely sure?</p>
            <p className="text-center text-sm text-muted-foreground">
              This will permanently delete the group and all its messages.
              This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <Button variant="outline" onClick={() => setConfirmDeleteVisible(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteGroup}>
              Yes, Delete Group
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupSettingsPanel;
