import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Group, CreateGroupData, GroupInvitation } from '../types';
import { useToast } from '@/components/ui/use-toast';

export function useGroupsApi() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [invites, setInvites] = useState<GroupInvitation[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState<string>('');
  const { toast } = useToast();

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*');
        
      if (error) throw error;
      
      setGroups(data || []);
      return data;
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to fetch groups');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (groupData: CreateGroupData) => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .insert(groupData)
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: 'Gruppe opprettet',
        description: 'Gruppen ble opprettet.',
      });
      
      return data;
    } catch (err) {
      console.error('Error creating group:', err);
      toast({
        variant: 'destructive',
        title: 'Kunne ikke opprette gruppe',
        description: 'Det oppstod en feil ved opprettelse av gruppen.',
      });
      throw err;
    }
  };
  
  const createPremiumGroup = async (groupData: CreateGroupData) => {
    // A premium version of createGroup with additional features
    return createGroup({
      ...groupData,
      is_premium: true
    });
  };

  return {
    groups,
    myGroups,
    loading,
    error,
    activeGroupId,
    setActiveGroupId,
    invites,
    isPremium,
    createGroup,
    createPremiumGroup,
    fetchGroups
  };
}
