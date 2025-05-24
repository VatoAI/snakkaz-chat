/**
 * GroupAdministration Component
 * 
 * This is a simplified version of the GroupSettingsPanel
 * Compatible with the existing GroupChatView implementation
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
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader, Save, Users, Shield, AlertTriangle, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GroupAdministrationProps {
  groupId: string;
  onClose: () => void;
  onUpdate?: () => void;
}

/**
 * GroupAdministration component for Snakkaz Chat FASE 2
 * A simplified version that works with existing code structure
 */
const GroupAdministration: React.FC<GroupAdministrationProps> = ({ 
  groupId,
  onClose,
  onUpdate 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [userRole, setUserRole] = useState<string>('member');
  
  // Group state
  const [groupDetails, setGroupDetails] = useState({
    name: '',
    description: '',
    avatar_url: null,
    security_level: 'standard',
    allow_media_sharing: true,
    allow_link_previews: true,
    allow_member_invites: false,
    is_private: true,
    creator_id: '',
  });

  // Members state
  const [members, setMembers] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');

  // Load group details
  useEffect(() => {
    const fetchGroup = async () => {
      if (!groupId || !user?.id) return;
      
      setIsLoading(true);
      try {
        // Get group details
        const { data: group, error: groupError } = await supabase
          .from('group_chats')
          .select('*')
          .eq('id', groupId)
          .single();
          
        if (groupError) throw groupError;

        // Get group settings
        const { data: settings, error: settingsError } = await supabase
          .from('group_settings')
          .select('*')
          .eq('group_id', groupId)
          .single();
          
        // Get members
        const { data: membersData, error: membersError } = await supabase
          .from('group_members')
          .select(`*, profiles:user_id(id, username, avatar_url)`)
          .eq('group_id', groupId);
          
        if (membersError) throw membersError;

        // Get current user's role
        const currentMember = membersData.find((m: any) => m.user_id === user.id);
        if (currentMember) {
          setUserRole(currentMember.role);
        }

        setGroupDetails({
          name: group.name,
          description: group.description || '',
          avatar_url: group.avatar_url,
          security_level: settings?.security_level || 'standard',
          allow_media_sharing: settings?.allow_media_sharing ?? true,
          allow_link_previews: settings?.allow_link_previews ?? true,
          allow_member_invites: settings?.allow_member_invites ?? false,
          is_private: settings?.is_private ?? true,
          creator_id: group.creator_id,
        });
        
        setMembers(membersData.map((m: any) => ({
          ...m,
          username: m.profiles?.username || 'Unknown',
          avatar_url: m.profiles?.avatar_url
        })));
        
      } catch (error) {
        console.error('Error loading group:', error);
        toast({
          title: 'Failed to load group settings',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGroup();
  }, [groupId, user?.id, toast]);

  // Save group settings
  const saveChanges = async () => {
    if (!user?.id) return;
    
    // Check permissions
    if (userRole !== 'admin' && user.id !== groupDetails.creator_id) {
      toast({
        title: 'Permission denied',
        description: 'You do not have permission to modify group settings.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSaving(true);
    try {
      // Update group details
      const { error: groupError } = await supabase
        .from('group_chats')
        .update({
          name: groupDetails.name,
          description: groupDetails.description,
        })
        .eq('id', groupId);
        
      if (groupError) throw groupError;
      
      // Update or create group settings
      const { error: settingsError } = await supabase
        .from('group_settings')
        .upsert({
          group_id: groupId,
          security_level: groupDetails.security_level,
          allow_media_sharing: groupDetails.allow_media_sharing,
          allow_link_previews: groupDetails.allow_link_previews,
          allow_member_invites: groupDetails.allow_member_invites,
          is_private: groupDetails.is_private,
          updated_at: new Date().toISOString(),
        });
        
      if (settingsError) throw settingsError;
      
      toast({
        title: 'Settings updated',
        description: 'Group settings have been updated successfully.',
      });
      
      if (onUpdate) {
        onUpdate();
      }
      
    } catch (error) {
      console.error('Error saving group settings:', error);
      toast({
        title: 'Failed to save settings',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Send invite
  const sendInvite = async () => {
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
        
      if (userError) {
        toast({
          title: 'User not found',
          description: 'No user with this email address was found.',
          variant: 'destructive',
        });
        return;
      }
      
      // Check if already a member
      const { data: memberData } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', userData.id)
        .single();
        
      if (memberData) {
        toast({
          title: 'Already a member',
          description: 'This user is already a member of the group.',
          variant: 'destructive',
        });
        return;
      }
      
      // Send invite
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
      
      // Clear input
      setInviteEmail('');
      
    } catch (error) {
      console.error('Error sending invite:', error);
      toast({
        title: 'Failed to send invitation',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    }
  };
  
  // Change member role
  const changeMemberRole = async (memberId: string, newRole: string) => {
    if (userRole !== 'admin' && user?.id !== groupDetails.creator_id) {
      toast({
        title: 'Permission denied',
        description: 'You do not have permission to change member roles.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('group_members')
        .update({ role: newRole })
        .eq('id', memberId);
        
      if (error) throw error;
      
      // Update local state
      setMembers(members.map(m => 
        m.id === memberId ? { ...m, role: newRole } : m
      ));
      
      toast({
        title: 'Role updated',
        description: 'The member role has been updated.',
      });
      
    } catch (error) {
      console.error('Error changing role:', error);
      toast({
        title: 'Failed to update role',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    }
  };
  
  // Remove member
  const removeMember = async (memberId: string) => {
    if (userRole !== 'admin' && userRole !== 'moderator' && user?.id !== groupDetails.creator_id) {
      toast({
        title: 'Permission denied',
        description: 'You do not have permission to remove members.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('id', memberId);
        
      if (error) throw error;
      
      // Update local state
      setMembers(members.filter(m => m.id !== memberId));
      
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Loader className="h-8 w-8 animate-spin text-cybergold-500 mr-2" />
        <span className="text-cybergold-500">Loading group settings...</span>
      </div>
    );
  }
  
  // Check permissions
  const canManageGroup = userRole === 'admin' || userRole === 'moderator' || user?.id === groupDetails.creator_id;
  const canModifySettings = userRole === 'admin' || user?.id === groupDetails.creator_id;

  return (
    <div className="flex flex-col h-full bg-background rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold text-cybergold-400">Group Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input 
                id="group-name"
                value={groupDetails.name}
                onChange={(e) => setGroupDetails({...groupDetails, name: e.target.value})}
                disabled={!canModifySettings}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="group-description">Description</Label>
              <Textarea 
                id="group-description"
                value={groupDetails.description}
                onChange={(e) => setGroupDetails({...groupDetails, description: e.target.value})}
                disabled={!canModifySettings}
                rows={4}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-media">Allow Media Sharing</Label>
              <Switch 
                id="allow-media"
                checked={groupDetails.allow_media_sharing}
                onCheckedChange={(checked) => setGroupDetails({...groupDetails, allow_media_sharing: checked})}
                disabled={!canModifySettings}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="members" className="mt-4">
            {canManageGroup && (
              <div className="mb-6 p-4 border rounded-lg">
                <h3 className="text-sm font-medium mb-2">Invite New Member</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                  <Button onClick={sendInvite}>Send Invite</Button>
                </div>
              </div>
            )}
            
            <h3 className="text-sm font-medium mb-2">Members ({members.length})</h3>
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-2 border-b">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar_url} />
                      <AvatarFallback>{member.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.username}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  
                  {canManageGroup && member.user_id !== user?.id && (
                    <div className="flex items-center gap-2">
                      {user?.id === groupDetails.creator_id && (
                        <Select
                          value={member.role}
                          onValueChange={(value) => changeMemberRole(member.id, value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeMember(member.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="security-level">Security Level</Label>
              <Select 
                value={groupDetails.security_level}
                onValueChange={(value) => setGroupDetails({...groupDetails, security_level: value})}
                disabled={!canModifySettings}
              >
                <SelectTrigger id="security-level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="maximum">Maximum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-invites">Allow Member Invites</Label>
              <Switch 
                id="allow-invites"
                checked={groupDetails.allow_member_invites}
                onCheckedChange={(checked) => setGroupDetails({...groupDetails, allow_member_invites: checked})}
                disabled={!canModifySettings}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="private-group">Private Group</Label>
              <Switch 
                id="private-group"
                checked={groupDetails.is_private}
                onCheckedChange={(checked) => setGroupDetails({...groupDetails, is_private: checked})}
                disabled={!canModifySettings}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="p-4 border-t flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button 
          onClick={saveChanges} 
          disabled={isSaving || !canModifySettings}
        >
          {isSaving ? (
            <>
              <Loader className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default GroupAdministration;
