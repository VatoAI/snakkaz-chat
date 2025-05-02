
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Group, GroupInvite, SecurityLevel, GroupVisibility } from '@/types/group';
import { useToast } from '@/components/ui/use-toast';

export function useGroupsApi(userId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchGroups = async (): Promise<Group[]> => {
    setIsLoading(true);
    try {
      // First, fetch the user's group memberships
      const { data: memberships, error: membershipError } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('userId', userId);

      if (membershipError) {
        throw membershipError;
      }

      const memberGroupIds = memberships?.map(m => m.group_id) || [];

      // Fetch groups that the user is a member of
      const { data: groups, error: groupsError } = await supabase
        .from('groups')
        .select(`
          *,
          members:group_members(*)
        `)
        .in('id', memberGroupIds);

      if (groupsError) {
        throw groupsError;
      }

      return (groups || []).map(transformGroupData);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch groups',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createGroup = async (
    name: string, 
    visibility: GroupVisibility, 
    securityLevel: SecurityLevel
  ): Promise<Group | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('groups')
        .insert({
          name,
          visibility,
          security_level: securityLevel,
          createdBy: userId,
          is_premium: false
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Add creator as admin member
      await supabase.from('group_members').insert({
        groupId: data.id,
        userId,
        role: 'admin'
      });

      // Set up encryption key if needed
      if (securityLevel === 'high' || securityLevel === 'maximum') {
        await supabase.from('group_encryption').insert({
          group_id: data.id,
          created_by: userId,
          session_key: generateRandomKey()
        });
      }

      toast({
        title: 'Success',
        description: `Group "${name}" was created`,
      });

      return transformGroupData(data);
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: 'Error',
        description: 'Failed to create group',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to generate a random encryption key
  const generateRandomKey = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  // Transform database group data to match our Group interface
  const transformGroupData = (data: any): Group => {
    return {
      id: data.id,
      name: data.name,
      createdAt: data.created_at,
      createdBy: data.creator_id || data.createdBy,
      updatedAt: data.updated_at || data.created_at,
      avatarUrl: data.avatar_url,
      visibility: data.visibility || 'private',
      securityLevel: data.security_level || data.securityLevel || 'standard',
      is_premium: !!data.is_premium,
      members: data.members?.map((m: any) => ({
        id: m.id,
        userId: m.user_id || m.userId,
        groupId: m.group_id || m.groupId,
        role: m.role,
        joinedAt: m.joined_at || m.joinedAt || m.created_at,
        can_write: m.can_write !== false
      })) || [],
      type: data.type || 'standard',
      isPublic: data.visibility === 'public'
    };
  };

  return {
    isLoading,
    fetchGroups,
    createGroup
  };
}
