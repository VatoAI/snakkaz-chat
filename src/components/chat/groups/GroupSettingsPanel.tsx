import React, { useState, useEffect } from 'react';
import { Group, GroupMember, GroupRole } from '@/types/group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, Users, Settings, Lock, Image, 
  Trash, Save, X, Edit, UserPlus, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';

interface GroupSettingsPanelProps {
  group: Group;
  currentUserId: string;
  members: GroupMember[];
  userProfiles: Record<string, any>;
  onClose: () => void;
  refreshGroup: () => void;
}

export const GroupSettingsPanel: React.FC<GroupSettingsPanelProps> = ({
  group,
  currentUserId,
  members,
  userProfiles,
  onClose,
  refreshGroup
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('general');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [inviteLink, setInviteLink] = useState<string>('');
  const [isProcessingInvite, setIsProcessingInvite] = useState<boolean>(false);

  // Form state
  const [groupName, setGroupName] = useState<string>(group.name);
  const [groupDescription, setGroupDescription] = useState<string>(group.description || '');
  const [groupAvatar, setGroupAvatar] = useState<string>(group.avatar_url || '');
  const [allowMediaSharing, setAllowMediaSharing] = useState<boolean>(group.allow_media_sharing !== false);
  const [allowLinkPreviews, setAllowLinkPreviews] = useState<boolean>(group.allow_link_previews !== false);
  const [allowMemberInvites, setAllowMemberInvites] = useState<boolean>(group.allow_member_invites === true);
  const [isPrivate, setIsPrivate] = useState<boolean>(group.is_private !== false);
  const [securityLevel, setSecurityLevel] = useState<string>(group.security_level || 'standard');

  // Check if current user is admin
  const isAdmin = members.some(member => 
    member.user_id === currentUserId && member.role === 'admin'
  );

  // Generate invite link
  const generateInviteLink = async () => {
    setIsProcessingInvite(true);
    try {
      // Create a time-limited invitation in the database
      const { data, error } = await supabase
        .from('group_invites')
        .insert({
          group_id: group.id,
          created_by: currentUserId,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          max_uses: 10
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const link = `${window.location.origin}/join-group/${data.invite_code}`;
        setInviteLink(link);
        
        toast({
          title: "Invitation link created",
          description: "The link will be valid for 7 days or 10 uses",
        });
      }
    } catch (error) {
      console.error("Failed to generate invite link:", error);
      toast({
        title: "Failed to create invite",
        description: "Could not generate invitation link",
        variant: "destructive",
      });
    } finally {
      setIsProcessingInvite(false);
    }
  };

  // Save group settings
  const saveGroupSettings = async () => {
    if (!isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only admins can update group settings",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('group_chats')
        .update({
          name: groupName,
          description: groupDescription,
          avatar_url: groupAvatar,
          allow_media_sharing: allowMediaSharing,
          allow_link_previews: allowLinkPreviews,
          allow_member_invites: allowMemberInvites,
          is_private: isPrivate,
          security_level: securityLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', group.id);
      
      if (error) throw error;
      
      toast({
        title: "Settings saved",
        description: "Group settings have been updated successfully",
      });
      
      setEditMode(false);
      refreshGroup(); // Refresh group data
    } catch (error) {
      console.error("Failed to save group settings:", error);
      toast({
        title: "Failed to save settings",
        description: "An error occurred while updating group settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update member role
  const updateMemberRole = async (userId: string, newRole: GroupRole) => {
    if (!isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only admins can change member roles",
        variant: "destructive",
      });
      return;
    }
    
    // Don't allow changing your own role if you're the last admin
    if (userId === currentUserId && newRole !== 'admin') {
      const admins = members.filter(m => m.role === 'admin');
      if (admins.length <= 1) {
        toast({
          title: "Action not allowed",
          description: "You are the last admin. Assign another admin first.",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      const { error } = await supabase
        .from('group_members')
        .update({ role: newRole })
        .eq('group_id', group.id)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Role updated",
        description: "Member's role has been updated successfully",
      });
      
      refreshGroup(); // Refresh member data
    } catch (error) {
      console.error("Failed to update member role:", error);
      toast({
        title: "Failed to update role",
        description: "An error occurred while updating the member's role",
        variant: "destructive",
      });
    }
  };

  // Remove member from group
  const removeMember = async (userId: string) => {
    if (!isAdmin && userId !== currentUserId) {
      toast({
        title: "Permission denied",
        description: "Only admins can remove other members",
        variant: "destructive",
      });
      return;
    }
    
    // Don't allow removing yourself if you're the last admin
    if (userId === currentUserId && isAdmin) {
      const admins = members.filter(m => m.role === 'admin');
      if (admins.length <= 1) {
        toast({
          title: "Action not allowed",
          description: "You are the last admin. Assign another admin first.",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', group.id)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // If removing self, close the panel and go back
      if (userId === currentUserId) {
        toast({
          title: "Left group",
          description: "You have left the group",
        });
        onClose();
        return;
      }
      
      toast({
        title: "Member removed",
        description: "Member has been removed from the group",
      });
      
      refreshGroup(); // Refresh member data
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast({
        title: "Failed to remove member",
        description: "An error occurred while removing the member",
        variant: "destructive",
      });
    }
  };

  // Delete group (admin only)
  const deleteGroup = async () => {
    if (!isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only admins can delete the group",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Delete all messages first
      await supabase
        .from('messages')
        .delete()
        .eq('group_id', group.id);
      
      // Delete all members
      await supabase
        .from('group_members')
        .delete()
        .eq('group_id', group.id);
      
      // Delete the group itself
      const { error } = await supabase
        .from('group_chats')
        .delete()
        .eq('id', group.id);
      
      if (error) throw error;
      
      toast({
        title: "Group deleted",
        description: "The group has been permanently deleted",
      });
      
      onClose(); // Close panel and return to list
    } catch (error) {
      console.error("Failed to delete group:", error);
      toast({
        title: "Failed to delete group",
        description: "An error occurred while deleting the group",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-cyberdark-900 border-l border-cyberdark-700">
      <div className="p-4 border-b border-cyberdark-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-cybergold-300 flex items-center">
          <Settings className="mr-2 h-5 w-5 text-cybergold-500" />
          Group Settings
        </h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-gray-400 hover:text-cybergold-400"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-grow">
        <div className="border-b border-cyberdark-800">
          <TabsList className="bg-transparent p-2">
            <TabsTrigger 
              value="general" 
              className="data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-400"
            >
              General
            </TabsTrigger>
            <TabsTrigger 
              value="members" 
              className="data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-400"
            >
              Members
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-400"
            >
              Security
            </TabsTrigger>
            <TabsTrigger 
              value="danger" 
              className="data-[state=active]:bg-cyberdark-800 data-[state=active]:text-red-400"
            >
              Danger Zone
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-grow overflow-auto p-4">
          {/* General Settings Tab */}
          <TabsContent value="general" className="mt-0">
            <Card className="bg-cyberdark-850 border-cyberdark-700">
              <CardHeader>
                <CardTitle className="text-cybergold-200">Group Information</CardTitle>
                <CardDescription>
                  Basic information about your group chat
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {!editMode ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-16 w-16 border-2 border-cybergold-600/30">
                        {groupAvatar ? (
                          <AvatarImage src={groupAvatar} alt={groupName} />
                        ) : (
                          <AvatarFallback className="bg-cybergold-950 text-cybergold-400 text-xl">
                            {groupName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-cybergold-200">{groupName}</h3>
                        <p className="text-gray-400 text-sm">
                          Created {new Date(group.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {groupDescription && (
                      <div className="mt-3 text-gray-300">
                        {groupDescription}
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <Badge variant={isPrivate ? "outline" : "secondary"} className="mr-2">
                        {isPrivate ? "Private Group" : "Public Group"}
                      </Badge>
                      <Badge variant="outline" className="bg-cyberdark-800">
                        {members.length} members
                      </Badge>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-sm font-medium text-cybergold-300 mb-1">Features</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${allowMediaSharing ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm text-gray-300">Media sharing</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${allowLinkPreviews ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm text-gray-300">Link previews</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${allowMemberInvites ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm text-gray-300">Member invites</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="space-y-1 flex-grow">
                        <Label htmlFor="groupName" className="text-cybergold-300">
                          Group Name
                        </Label>
                        <Input
                          id="groupName"
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                          className="bg-cyberdark-900 border-cyberdark-700"
                          placeholder="Enter group name"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="groupAvatar" className="text-cybergold-300">
                        Avatar URL
                      </Label>
                      <Input
                        id="groupAvatar"
                        value={groupAvatar}
                        onChange={(e) => setGroupAvatar(e.target.value)}
                        className="bg-cyberdark-900 border-cyberdark-700"
                        placeholder="Enter avatar URL"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="groupDescription" className="text-cybergold-300">
                        Description
                      </Label>
                      <Textarea
                        id="groupDescription"
                        value={groupDescription}
                        onChange={(e) => setGroupDescription(e.target.value)}
                        className="bg-cyberdark-900 border-cyberdark-700 min-h-[100px]"
                        placeholder="Describe your group"
                      />
                    </div>
                    
                    <div className="space-y-3 pt-2">
                      <h4 className="text-sm font-medium text-cybergold-300">Features</h4>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="allowMediaSharing" className="text-gray-300">
                            Media Sharing
                          </Label>
                          <p className="text-xs text-gray-500">
                            Allow members to share images and files
                          </p>
                        </div>
                        <Switch
                          id="allowMediaSharing"
                          checked={allowMediaSharing}
                          onCheckedChange={setAllowMediaSharing}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="allowLinkPreviews" className="text-gray-300">
                            Link Previews
                          </Label>
                          <p className="text-xs text-gray-500">
                            Show previews of shared links in chat
                          </p>
                        </div>
                        <Switch
                          id="allowLinkPreviews"
                          checked={allowLinkPreviews}
                          onCheckedChange={setAllowLinkPreviews}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="allowMemberInvites" className="text-gray-300">
                            Member Invites
                          </Label>
                          <p className="text-xs text-gray-500">
                            Allow members to invite others
                          </p>
                        </div>
                        <Switch
                          id="allowMemberInvites"
                          checked={allowMemberInvites}
                          onCheckedChange={setAllowMemberInvites}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="isPrivate" className="text-gray-300">
                            Private Group
                          </Label>
                          <p className="text-xs text-gray-500">
                            Only accessible through invitations
                          </p>
                        </div>
                        <Switch
                          id="isPrivate"
                          checked={isPrivate}
                          onCheckedChange={setIsPrivate}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="justify-between border-t border-cyberdark-700 pt-4">
                {!editMode ? (
                  <Button
                    variant="outline"
                    onClick={() => setEditMode(true)}
                    disabled={!isAdmin}
                    className="border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-950/30"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Settings
                  </Button>
                ) : (
                  <div className="flex space-x-2 w-full justify-end">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setEditMode(false);
                        // Reset form to original values
                        setGroupName(group.name);
                        setGroupDescription(group.description || '');
                        setGroupAvatar(group.avatar_url || '');
                        setAllowMediaSharing(group.allow_media_sharing !== false);
                        setAllowLinkPreviews(group.allow_link_previews !== false);
                        setAllowMemberInvites(group.allow_member_invites === true);
                        setIsPrivate(group.is_private !== false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={saveGroupSettings}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
            
            {isAdmin && (
              <Card className="mt-4 bg-cyberdark-850 border-cyberdark-700">
                <CardHeader>
                  <CardTitle className="text-cybergold-200">Invite People</CardTitle>
                  <CardDescription>
                    Generate an invitation link to share with others
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {inviteLink ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-300">Share this link with people you want to invite:</p>
                      <div className="flex">
                        <Input
                          readOnly
                          value={inviteLink}
                          className="bg-cyberdark-900 border-cyberdark-700 rounded-r-none"
                        />
                        <Button
                          className="rounded-l-none"
                          onClick={() => {
                            navigator.clipboard.writeText(inviteLink);
                            toast({
                              title: "Link copied",
                              description: "Invitation link copied to clipboard",
                            });
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={generateInviteLink}
                      disabled={isProcessingInvite}
                      className="w-full border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-950/30"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      {isProcessingInvite ? 'Generating...' : 'Generate Invitation Link'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Members Tab */}
          <TabsContent value="members" className="mt-0">
            <Card className="bg-cyberdark-850 border-cyberdark-700">
              <CardHeader>
                <CardTitle className="text-cybergold-200">Member Management</CardTitle>
                <CardDescription>
                  {members.length} members in this group
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  {members.map((member) => {
                    const profile = userProfiles[member.user_id] || {};
                    const isSelf = member.user_id === currentUserId;
                    
                    return (
                      <div 
                        key={member.user_id} 
                        className="flex items-center justify-between p-2 rounded-md hover:bg-cyberdark-800"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            {profile.avatar_url ? (
                              <AvatarImage src={profile.avatar_url} alt={profile.username} />
                            ) : (
                              <AvatarFallback className="bg-cybergold-950 text-cybergold-400">
                                {profile.username ? profile.username[0] : '?'}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          
                          <div>
                            <p className="text-sm font-medium text-cybergold-200">
                              {profile.username || profile.full_name || 'Unknown User'}
                              {isSelf && <span className="ml-1 text-gray-500">(You)</span>}
                            </p>
                            <p className="text-xs text-gray-500">
                              {isSelf ? 'This is you' : `User ID: ${member.user_id.substring(0, 8)}...`}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {/* Role badge & role selector (if admin) */}
                          {isAdmin && !isSelf ? (
                            <Select
                              value={member.role}
                              onValueChange={(value) => updateMemberRole(member.user_id, value as GroupRole)}
                            >
                              <SelectTrigger className="w-[110px] h-8 text-xs bg-cyberdark-900 border-cyberdark-700">
                                <SelectValue placeholder={member.role} />
                              </SelectTrigger>
                              <SelectContent className="bg-cyberdark-900 border-cyberdark-700">
                                <SelectItem value="admin" className="text-cybergold-400">
                                  Admin
                                </SelectItem>
                                <SelectItem value="moderator" className="text-blue-400">
                                  Moderator
                                </SelectItem>
                                <SelectItem value="member">
                                  Member
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge 
                              variant="outline"
                              className={`
                                ${member.role === 'admin' ? 'bg-cybergold-950 text-cybergold-400 border-cybergold-700/30' : ''}
                                ${member.role === 'moderator' ? 'bg-blue-950 text-blue-400 border-blue-700/30' : ''}
                                ${member.role === 'member' ? 'bg-cyberdark-900 text-gray-400 border-cyberdark-700' : ''}
                              `}
                            >
                              {member.role}
                            </Badge>
                          )}
                          
                          {/* Remove button */}
                          {((isAdmin && !isSelf) || (!isAdmin && isSelf)) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-gray-400 hover:text-red-400 hover:bg-red-950/20 h-8 w-8"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-cyberdark-900 border-cyberdark-700">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-cybergold-200">
                                    {isSelf ? 'Leave Group' : 'Remove Member'}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {isSelf
                                      ? "Are you sure you want to leave this group? You'll need an invitation to rejoin."
                                      : `Are you sure you want to remove ${profile.username || 'this member'} from the group?`
                                    }
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-cyberdark-800 hover:bg-cyberdark-700">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() => removeMember(member.user_id)}
                                  >
                                    {isSelf ? 'Leave Group' : 'Remove Member'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            {/* Permissions card */}
            <Card className="mt-4 bg-cyberdark-850 border-cyberdark-700">
              <CardHeader>
                <CardTitle className="text-cybergold-200">Role Permissions</CardTitle>
                <CardDescription>
                  What each role can do in the group
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-cybergold-400 flex items-center">
                      <Shield className="mr-1 h-4 w-4" /> Admin
                    </h4>
                    <p className="text-xs text-gray-400">
                      Can edit group settings, manage members, change roles, and delete the group.
                    </p>
                  </div>
                  
                  <Separator className="bg-cyberdark-700" />
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-blue-400 flex items-center">
                      <Shield className="mr-1 h-4 w-4" /> Moderator
                    </h4>
                    <p className="text-xs text-gray-400">
                      Can pin messages, delete any message, and manage media content.
                    </p>
                  </div>
                  
                  <Separator className="bg-cyberdark-700" />
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300 flex items-center">
                      <Users className="mr-1 h-4 w-4" /> Member
                    </h4>
                    <p className="text-xs text-gray-400">
                      Can send messages, upload media (if allowed), and manage their own content.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security" className="mt-0">
            <Card className="bg-cyberdark-850 border-cyberdark-700">
              <CardHeader>
                <CardTitle className="text-cybergold-200">Security Settings</CardTitle>
                <CardDescription>
                  Control the security level and privacy of this group
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="securityLevel" className="text-cybergold-300">
                    Security Level
                  </Label>
                  
                  {!editMode ? (
                    <div className="space-y-2">
                      <div className={`
                        flex items-center p-3 rounded-md
                        ${securityLevel === 'p2p_e2ee' ? 'bg-green-950/20 border border-green-800/30' : 
                          securityLevel === 'server_e2ee' ? 'bg-blue-950/20 border border-blue-800/30' : 
                          'bg-cyberdark-900 border border-cyberdark-700'}
                      `}>
                        <div className="mr-3">
                          <Lock className={`
                            h-6 w-6
                            ${securityLevel === 'p2p_e2ee' ? 'text-green-500' : 
                              securityLevel === 'server_e2ee' ? 'text-blue-500' : 
                              'text-gray-500'}
                          `} />
                        </div>
                        <div>
                          <h4 className={`
                            font-medium text-sm
                            ${securityLevel === 'p2p_e2ee' ? 'text-green-400' : 
                              securityLevel === 'server_e2ee' ? 'text-blue-400' : 
                              'text-gray-300'}
                          `}>
                            {securityLevel === 'p2p_e2ee' ? 'Maximum Security (P2P E2EE)' : 
                             securityLevel === 'server_e2ee' ? 'High Security (Server E2EE)' : 
                             'Standard Security'}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {securityLevel === 'p2p_e2ee' ? 'End-to-end encrypted with peer-to-peer connections' : 
                             securityLevel === 'server_e2ee' ? 'End-to-end encrypted with server relay' : 
                             'Standard server-side encryption'}
                          </p>
                        </div>
                      </div>
                      
                      {!isAdmin && (
                        <p className="text-xs text-gray-500">
                          Only group admins can change the security level.
                        </p>
                      )}
                    </div>
                  ) : (
                    <Select
                      value={securityLevel}
                      onValueChange={setSecurityLevel}
                      disabled={!isAdmin}
                    >
                      <SelectTrigger className="bg-cyberdark-900 border-cyberdark-700">
                        <SelectValue placeholder="Select security level" />
                      </SelectTrigger>
                      <SelectContent className="bg-cyberdark-900 border-cyberdark-700">
                        <SelectItem value="p2p_e2ee" className="text-green-400">
                          Maximum Security (P2P E2EE)
                        </SelectItem>
                        <SelectItem value="server_e2ee" className="text-blue-400">
                          High Security (Server E2EE)
                        </SelectItem>
                        <SelectItem value="standard" className="text-gray-300">
                          Standard Security
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium text-cybergold-300 mb-2">Security Features</h4>
                    
                    {!editMode ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded-md bg-cyberdark-900">
                          <div className="flex items-center">
                            <Lock className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-300">Private Group</span>
                          </div>
                          <Badge variant={isPrivate ? "default" : "secondary"} className="text-xs">
                            {isPrivate ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-gray-300 flex items-center">
                              <Lock className="h-4 w-4 mr-2" />
                              Private Group
                            </Label>
                            <p className="text-xs text-gray-500 ml-6">
                              Only invited members can join
                            </p>
                          </div>
                          <Switch
                            checked={isPrivate}
                            onCheckedChange={setIsPrivate}
                            disabled={!isAdmin}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              
              {editMode && (
                <CardFooter className="justify-end border-t border-cyberdark-700 pt-4">
                  <Button
                    onClick={saveGroupSettings}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Security Settings'}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          {/* Danger Zone Tab */}
          <TabsContent value="danger" className="mt-0">
            <Card className="bg-cyberdark-850 border-red-900/30">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Actions that cannot be undone
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {/* Leave Group Option (for non-admin or if there are multiple admins) */}
                  {(!isAdmin || members.filter(m => m.role === 'admin').length > 1) && (
                    <div className="border border-red-900/30 rounded-md p-4 bg-red-950/10">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium text-gray-200">Leave Group</h4>
                          <p className="text-xs text-gray-500">
                            Remove yourself from this group. You'll need an invitation to rejoin.
                          </p>
                        </div>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              className="bg-red-900/30 hover:bg-red-800/50 text-red-300"
                            >
                              Leave Group
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-cyberdark-900 border-cyberdark-700">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-cybergold-200">Leave Group</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to leave this group? You'll need an invitation to rejoin.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-cyberdark-800 hover:bg-cyberdark-700">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => removeMember(currentUserId)}
                              >
                                Leave Group
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )}
                  
                  {/* Delete Group Option (admin only) */}
                  {isAdmin && (
                    <div className="border border-red-900/30 rounded-md p-4 bg-red-950/10">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium text-gray-200">Delete Group</h4>
                          <p className="text-xs text-gray-500">
                            Permanently remove this group and all its messages. This cannot be undone.
                          </p>
                        </div>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              className="bg-red-900/30 hover:bg-red-800/50 text-red-300"
                            >
                              Delete Group
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-cyberdark-900 border-cyberdark-700">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-cybergold-200">Delete Group</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the group "{group.name}" and all its messages.
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-cyberdark-800 hover:bg-cyberdark-700">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={deleteGroup}
                              >
                                Delete Group
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
