import React from 'react';
import { UserAvatar } from '../header/UserAvatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GroupMember, GroupRole } from '@/types/group';
import { Crown, Shield, Star, MoreHorizontal, UserX, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { hasRolePermission, getRoleLabel } from '@/utils/group-roles';

interface GroupMembersListProps {
  members: GroupMember[];
  currentUserId: string;
  userProfiles: Record<string, { 
    username?: string;
    full_name?: string;
    avatar_url?: string;
    status?: string;
  }>;
  isAdmin: boolean;
  groupId: string;
  onMemberUpdated?: () => void;
  isMobile?: boolean;
}

export const GroupMembersList: React.FC<GroupMembersListProps> = ({
  members,
  currentUserId,
  userProfiles,
  isAdmin,
  groupId,
  onMemberUpdated,
  isMobile = false
}) => {
  const { toast } = useToast();

  const handlePromoteToAdmin = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .update({ role: 'admin' })
        .eq('group_id', groupId)
        .eq('user_id', memberId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Member promoted',
        description: 'Member is now an administrator',
      });
      onMemberUpdated?.();
    } catch (error) {
      console.error('Error promoting member:', error);
      toast({
        title: 'Could not promote member',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePromoteToModerator = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .update({ role: 'moderator' })
        .eq('group_id', groupId)
        .eq('user_id', memberId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Member promoted',
        description: 'Member is now a moderator',
      });
      onMemberUpdated?.();
    } catch (error) {
      console.error('Error promoting to moderator:', error);
      toast({
        title: 'Could not promote member',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handlePromoteToPremium = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .update({ role: 'premium' })
        .eq('group_id', groupId)
        .eq('user_id', memberId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Member promoted',
        description: 'Member is now a premium member',
      });
      onMemberUpdated?.();
    } catch (error) {
      console.error('Error promoting to premium:', error);
      toast({
        title: 'Could not promote member',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDemoteToMember = async (memberId: string, currentRole: GroupRole) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .update({ role: 'member' })
        .eq('group_id', groupId)
        .eq('user_id', memberId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Member demoted',
        description: `Member is no longer a ${getRoleLabel(currentRole).toLowerCase()}`,
      });
      onMemberUpdated?.();
    } catch (error) {
      console.error('Error demoting member:', error);
      toast({
        title: 'Could not demote member',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', memberId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Member removed',
        description: 'Member has been removed from the group',
      });
      onMemberUpdated?.();
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: 'Could not remove member',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const getRoleIcon = (role: GroupRole) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3 mr-0.5" />;
      case 'moderator':
        return <Shield className="h-3 w-3 mr-0.5" />;
      case 'premium':
        return <Star className="h-3 w-3 mr-0.5" />;
      default:
        return <Users className="h-3 w-3 mr-0.5" />;
    }
  };
  
  const getRoleBadgeVariant = (role: GroupRole) => {
    switch (role) {
      case 'admin':
        return "secondary";
      case 'moderator':
        return "default";
      case 'premium':
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-2">
      {members.map((member) => {
        const userProfile = userProfiles[member.user_id];
        const isCurrentUser = member.user_id === currentUserId;
        const memberRole = member.role as GroupRole;
        
        // Check if current user can manage this member's role (admins can manage all, moderators can only manage regular members)
        const currentUserRole = members.find(m => m.user_id === currentUserId)?.role as GroupRole || 'member';
        const canManageMember = hasRolePermission(currentUserRole, 'admin') || 
                              (hasRolePermission(currentUserRole, 'moderator') && memberRole === 'member');
        
        // Admin check
        const adminCount = members.filter(m => m.role === 'admin').length;
        const isLastAdmin = memberRole === 'admin' && adminCount === 1;

        return (
          <div key={member.user_id} className="flex items-center justify-between p-2 rounded-md bg-cyberdark-900/50 border border-cyberdark-700">
            <div className="flex items-center space-x-2">
              <UserAvatar
                src={userProfile?.avatar_url || undefined}
                alt={userProfile?.username || 'Group Member'}
                size={32}
              />
              <div>
                <div className="text-sm font-medium text-cybergold-300">{userProfile?.username || 'Unknown User'}</div>
                <div className="text-xs text-cybergold-500 flex items-center gap-1">
                  <Badge variant={getRoleBadgeVariant(memberRole)} className="mr-1">
                    {getRoleIcon(memberRole)}
                    {getRoleLabel(memberRole)}
                  </Badge>
                  {isCurrentUser && <Badge variant="outline">You</Badge>}
                </div>
              </div>
            </div>
            {canManageMember && !isCurrentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-cyberdark-800">
                    <MoreHorizontal className="h-4 w-4 text-cybergold-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" forceMount className="w-48 bg-cyberdark-900 border-cyberdark-700 text-cybergold-200">
                  {/* Role management options */}
                  {hasRolePermission(currentUserRole, 'admin') && (
                    <>
                      {memberRole !== 'admin' ? (
                        <DropdownMenuItem onClick={() => handlePromoteToAdmin(member.user_id)} className="focus:bg-cyberdark-800">
                          <Crown className="h-4 w-4 mr-2 text-amber-400" />
                          Promote to Admin
                        </DropdownMenuItem>
                      ) : !isLastAdmin && (
                        <DropdownMenuItem onClick={() => handleDemoteToMember(member.user_id, memberRole)} className="focus:bg-cyberdark-800">
                          <Shield className="h-4 w-4 mr-2 text-cybergold-400" />
                          Demote to Member
                        </DropdownMenuItem>
                      )}
                      
                      {memberRole !== 'moderator' && memberRole !== 'admin' ? (
                        <DropdownMenuItem onClick={() => handlePromoteToModerator(member.user_id)} className="focus:bg-cyberdark-800">
                          <Shield className="h-4 w-4 mr-2 text-cybergold-400" />
                          Promote to Moderator
                        </DropdownMenuItem>
                      ) : memberRole === 'moderator' && (
                        <DropdownMenuItem onClick={() => handleDemoteToMember(member.user_id, memberRole)} className="focus:bg-cyberdark-800">
                          <Users className="h-4 w-4 mr-2" />
                          Demote to Member
                        </DropdownMenuItem>
                      )}
                      
                      {memberRole !== 'premium' && memberRole !== 'admin' && memberRole !== 'moderator' ? (
                        <DropdownMenuItem onClick={() => handlePromoteToPremium(member.user_id)} className="focus:bg-cyberdark-800">
                          <Star className="h-4 w-4 mr-2 text-purple-400" />
                          Promote to Premium
                        </DropdownMenuItem>
                      ) : memberRole === 'premium' && (
                        <DropdownMenuItem onClick={() => handleDemoteToMember(member.user_id, memberRole)} className="focus:bg-cyberdark-800">
                          <Users className="h-4 w-4 mr-2" />
                          Demote to Member
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                  
                  {/* Moderators can only remove members if the current user is at least a moderator */}
                  {hasRolePermission(currentUserRole, 'moderator') && memberRole !== 'admin' && (
                    <DropdownMenuItem onClick={() => handleRemoveMember(member.user_id)} className="text-red-500 focus:bg-cyberdark-800">
                      <UserX className="h-4 w-4 mr-2" />
                      Remove from group
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        );
      })}
    </div>
  );
};
