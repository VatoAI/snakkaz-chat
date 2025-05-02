
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { GroupInvite } from '@/types/group';

export function useGroupInvites(currentUserId: string) {
  const [invites, setInvites] = useState<GroupInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { toast } = useToast();

  const fetchInvites = async () => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('group_invites')
        .select(`
          id,
          groupId:group_id,
          invitedById:invited_by,
          invitedUserId:invited_user_id,
          status,
          createdAt:created_at,
          expiresAt:expires_at,
          groups:group_id (
            name
          ),
          profiles:invited_by (
            username
          )
        `)
        .eq('invited_user_id', currentUserId)
        .eq('status', 'pending');

      if (error) throw error;

      const formattedInvites = data.map(invite => ({
        ...invite,
        group_name: invite.groups?.name,
        sender_username: invite.profiles?.username
      }));

      setInvites(formattedInvites);
    } catch (error) {
      console.error('Error fetching group invites:', error);
      toast({
        title: 'Error',
        description: 'Failed to load group invitations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptInvite = async (invite: GroupInvite) => {
    try {
      // Update invite status
      const { error: updateError } = await supabase
        .from('group_invites')
        .update({ status: 'accepted' })
        .eq('id', invite.id);

      if (updateError) throw updateError;

      // Add user to group members
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: invite.groupId || invite.group_id,
          user_id: currentUserId,
          role: 'member'
        });

      if (memberError) throw memberError;

      // Update local state
      setInvites(prev => prev.filter(i => i.id !== invite.id));

      toast({
        title: 'Success',
        description: `You have joined the group: ${invite.group_name || 'Unknown group'}`,
      });

      return Promise.resolve();
    } catch (error) {
      console.error('Error accepting invite:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept invitation',
        variant: 'destructive'
      });
      return Promise.reject(error);
    }
  };

  const declineInvite = async (invite: GroupInvite) => {
    try {
      const { error } = await supabase
        .from('group_invites')
        .update({ status: 'rejected' })
        .eq('id', invite.id);

      if (error) throw error;

      setInvites(prev => prev.filter(i => i.id !== invite.id));

      toast({
        title: 'Invitation declined',
        description: `You have declined the invitation to join ${invite.group_name || 'the group'}`,
      });

      return Promise.resolve();
    } catch (error) {
      console.error('Error declining invite:', error);
      toast({
        title: 'Error',
        description: 'Failed to decline invitation',
        variant: 'destructive'
      });
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchInvites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  return {
    invites,
    loading,
    showInviteDialog,
    setShowInviteDialog,
    fetchInvites,
    acceptInvite,
    declineInvite
  };
}
