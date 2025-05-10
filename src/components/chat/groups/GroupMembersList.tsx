import React from 'react';
import { UserAvatar } from '../header/UserAvatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GroupMember } from '@/types/group';
import { Crown, Shield, Star, MoreHorizontal, UserX, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GroupMembersListProps {
  members: GroupMember[];
  currentUserId: string;
  userProfiles: Record<string, any>;
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
        title: 'Medlem oppgradert',
        description: 'Medlemmet er nå administrator',
      });
      onMemberUpdated?.();
    } catch (error) {
      console.error('Error promoting member:', error);
      toast({
        title: 'Kunne ikke oppgradere medlem',
        description: 'En feil oppstod. Prøv igjen senere.',
        variant: 'destructive',
      });
    }
  };

  const handleDemoteFromAdmin = async (memberId: string) => {
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
        title: 'Medlem nedgradert',
        description: 'Medlemmet er ikke lenger administrator',
      });
      onMemberUpdated?.();
    } catch (error) {
      console.error('Error demoting member:', error);
      toast({
        title: 'Kunne ikke nedgradere medlem',
        description: 'En feil oppstod. Prøv igjen senere.',
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
        title: 'Medlem fjernet',
        description: 'Medlemmet er fjernet fra gruppen',
      });
      onMemberUpdated?.();
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: 'Kunne ikke fjerne medlem',
        description: 'En feil oppstod. Prøv igjen senere.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-2">
      {members.map((member) => {
        const userProfile = userProfiles[member.user_id];
        const isCurrentUser = member.user_id === currentUserId;
        const isAdminMember = member.role === 'admin';

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
                <div className="text-xs text-cybergold-500">
                  {isAdminMember && (
                    <Badge variant="secondary" className="mr-1">
                      <Crown className="h-3 w-3 mr-0.5" />
                      Admin
                    </Badge>
                  )}
                  {isCurrentUser && <Badge variant="outline">Meg</Badge>}
                </div>
              </div>
            </div>
            {isAdmin && !isCurrentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-cyberdark-800">
                    <MoreHorizontal className="h-4 w-4 text-cybergold-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" forceMount className="w-48 bg-cyberdark-900 border-cyberdark-700 text-cybergold-200">
                  {isAdminMember ? (
                    <DropdownMenuItem onClick={() => handleDemoteFromAdmin(member.user_id)} className="focus:bg-cyberdark-800">
                      <Shield className="h-4 w-4 mr-2" />
                      Fjern Admin
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => handlePromoteToAdmin(member.user_id)} className="focus:bg-cyberdark-800">
                      <Crown className="h-4 w-4 mr-2" />
                      Gjør til Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleRemoveMember(member.user_id)} className="text-red-500 focus:bg-cyberdark-800">
                    <UserX className="h-4 w-4 mr-2" />
                    Fjern fra gruppen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        );
      })}
    </div>
  );
};
