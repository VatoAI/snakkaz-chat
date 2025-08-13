
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Group, GroupMember, GroupVisibility, GroupWritePermission } from '@/types/group';
import { SecurityLevel } from '@/types/security';

export const useGroupCreation = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupVisibility, setGroupVisibility] = useState<GroupVisibility>('public');
  const [groupSecurityLevel, setGroupSecurityLevel] = useState<SecurityLevel>('standard');
  const [groupPassword, setGroupPassword] = useState('');
  const [groupWritePermissions, setGroupWritePermissions] = useState<GroupWritePermission>('all');

  const resetForm = () => {
    setGroupName('');
    setGroupDescription('');
    setGroupVisibility('public');
    setGroupSecurityLevel('standard');
    setGroupPassword('');
    setGroupWritePermissions('all');
  };

  const createGroup = async (userId: string) => {
    if (!groupName) {
      toast({ 
        title: 'Group name required',
        description: 'Please enter a name for your group.',
        variant: 'destructive'
      });
      return null;
    }

    try {
      setIsCreating(true);

      const timestamp = new Date().toISOString();

      // First create the group
      const newGroup = {
        creator_id: userId,
        name: groupName,
        description: groupDescription,
        visibility: groupVisibility,
        security_level: groupSecurityLevel,
        password: groupPassword,
        created_at: timestamp,
        updated_at: timestamp,
        write_permissions: groupWritePermissions
      };

      const { data, error } = await supabase
        .from('groups')
        .insert(newGroup)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (!data?.id) {
        throw new Error('Failed to create group - no ID returned');
      }
      
      const groupId = data.id;

      // Now add the creator as an admin member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: userId,
          role: 'admin',
          joined_at: timestamp,
          can_write: true
        });

      if (memberError) {
        throw memberError;
      }

      toast({
        title: 'Group created',
        description: `Your group "${groupName}" has been created successfully.`,
      });

      resetForm();
      return data as Group;
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: 'Failed to create group',
        description: 'There was an error creating your group. Please try again.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    isCreating,
    groupName,
    setGroupName,
    groupDescription,
    setGroupDescription,
    groupVisibility,
    setGroupVisibility,
    groupSecurityLevel,
    setGroupSecurityLevel,
    groupPassword, 
    setGroupPassword,
    groupWritePermissions,
    setGroupWritePermissions,
    createGroup,
    resetForm
  };
};
