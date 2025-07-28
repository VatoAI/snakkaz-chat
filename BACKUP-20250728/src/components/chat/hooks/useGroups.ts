import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Group } from '@/types/groups';
import { useToast } from '@/hooks/use-toast';
import { SecurityLevel } from '@/types/security';

export interface UseGroupsProps {
  currentUserId: string;
  userProfiles?: Record<string, any>;
}

export const useGroups = ({ currentUserId, userProfiles }: UseGroupsProps) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch groups on mount
  useEffect(() => {
    refreshGroups();
  }, [currentUserId]);

  // Handle group creation
  const handleCreateGroup = async (formData: {
    name: string;
    description?: string;
    visibility: string;
    securityLevel: SecurityLevel;
    password?: string;
  }) => {
    try {
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: formData.name,
          description: formData.description,
          creator_id: currentUserId,
          visibility: formData.visibility,
          security_level: formData.securityLevel,
          password: formData.password,
          is_premium: false,
        })
        .select()
        .single();

      if (groupError) {
        throw groupError;
      }

      toast({
        title: 'Gruppe opprettet',
        description: 'Gruppen ble opprettet',
      });

      refreshGroups();
      return groupData.id;
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast({
        title: 'Kunne ikke opprette gruppe',
        description: error.message || 'En feil oppstod. Prøv igjen senere.',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Handle joining a group
  const handleJoinGroup = async (groupId: string, password?: string) => {
    try {
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (groupError) {
        throw groupError;
      }

      if (groupData.visibility === 'private' && !password) {
        toast({
          title: 'Passord kreves',
          description: 'Denne gruppen krever et passord for å bli med.',
          variant: 'destructive',
        });
        return false;
      }

      if (groupData.password && groupData.password !== password) {
        toast({
          title: 'Feil passord',
          description: 'Feil passord. Prøv igjen.',
          variant: 'destructive',
        });
        return false;
      }

      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: currentUserId,
          role: 'member',
        });

      if (memberError) {
        throw memberError;
      }

      toast({
        title: 'Du er med i gruppen',
        description: 'Du er nå medlem av gruppen.',
      });

      refreshGroups();
      return true;
    } catch (error: any) {
      console.error('Error joining group:', error);
      toast({
        title: 'Kunne ikke bli med i gruppen',
        description: error.message || 'En feil oppstod. Prøv igjen senere.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Refresh groups
  const refreshGroups = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          members:group_members(count)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const groupsWithMemberCount = data.map(group => ({
          ...group,
          memberCount: group.members ? group.members.length : 0,
        }));

        setGroups(groupsWithMemberCount as Group[]);
      }
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Kunne ikke laste inn grupper. Prøv igjen senere.');
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  return {
    groups,
    setGroups,
    selectedGroup,
    setSelectedGroup,
    isLoading,
    error,
    handleCreateGroup,
    handleJoinGroup,
    refreshGroups,
  };
};
