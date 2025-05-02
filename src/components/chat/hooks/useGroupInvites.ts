
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Group, GroupInvite } from '@/types/group';
import { useToast } from '@/hooks/use-toast';

export const useGroupInvites = (userId: string | null) => {
  const [invites, setInvites] = useState<GroupInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { toast } = useToast();
  
  const fetchInvites = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('group_invites')
        .select(`
          id,
          group_id,
          invited_by,
          status,
          created_at,
          expires_at,
          groups:group_id (name)
        `)
        .eq('invited_user_id', userId)
        .eq('status', 'pending');
        
      if (error) throw error;
      
      // Transform data to match GroupInvite interface
      const formattedInvites: GroupInvite[] = data.map(invite => ({
        id: invite.id,
        groupId: invite.group_id,
        group_id: invite.group_id,
        invitedById: invite.invited_by,
        invited_by: invite.invited_by,
        invitedUserId: userId,
        invited_user_id: userId,
        status: 'pending',
        createdAt: invite.created_at,
        created_at: invite.created_at,
        expiresAt: invite.expires_at,
        expires_at: invite.expires_at,
        group_name: invite.groups?.name || 'Unknown Group',
      }));
      
      setInvites(formattedInvites);
      
      // Show invite dialog if there are pending invites
      if (formattedInvites.length > 0 && !showInviteDialog) {
        setShowInviteDialog(true);
      }
    } catch (error) {
      console.error('Error fetching group invites:', error);
      toast({
        title: 'Error',
        description: 'Failed to load group invitations.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast, showInviteDialog]);
  
  const acceptInvite = useCallback(async (invite: GroupInvite) => {
    if (!userId) return;
    
    try {
      // Update invite status
      const { error: updateError } = await supabase
        .from('group_invites')
        .update({ status: 'accepted' })
        .eq('id', invite.id);
        
      if (updateError) throw updateError;
      
      // Add user as group member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: invite.groupId || invite.group_id,
          user_id: userId,
          role: 'member',
        });
        
      if (memberError) throw memberError;
      
      // Update local state
      setInvites(prev => prev.filter(i => i.id !== invite.id));
      
      toast({
        title: 'Success',
        description: `You have joined "${invite.group_name}"`,
      });
    } catch (error) {
      console.error('Error accepting group invite:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept invitation.',
        variant: 'destructive',
      });
    }
  }, [userId, toast]);
  
  const declineInvite = useCallback(async (invite: GroupInvite) => {
    try {
      // Update invite status
      const { error } = await supabase
        .from('group_invites')
        .update({ status: 'rejected' })
        .eq('id', invite.id);
        
      if (error) throw error;
      
      // Update local state
      setInvites(prev => prev.filter(i => i.id !== invite.id));
      
      toast({
        title: 'Invitation declined',
        description: `You have declined to join "${invite.group_name}"`,
      });
    } catch (error) {
      console.error('Error declining group invite:', error);
      toast({
        title: 'Error',
        description: 'Failed to decline invitation.',
        variant: 'destructive',
      });
    }
  }, [toast]);
  
  useEffect(() => {
    if (userId) {
      fetchInvites();
    }
  }, [userId, fetchInvites]);
  
  return {
    invites,
    loading,
    showInviteDialog,
    setShowInviteDialog,
    fetchInvites,
    acceptInvite,
    declineInvite,
    // Add these properties to fix the errors
    groupInvites: invites,
    setGroupInvites: setInvites
  };
};
