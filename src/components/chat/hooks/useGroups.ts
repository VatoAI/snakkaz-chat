
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Group, GroupInvite, GroupMember } from "@/types/group";
import { SecurityLevel } from "@/types/security";
import { useToast } from "@/components/ui/use-toast";

interface UseGroupsProps {
  currentUserId: string;
  userProfiles: Record<string, { username: string | null, avatar_url: string | null }>;
}

export function useGroups({ currentUserId }: UseGroupsProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const { toast } = useToast();

  const fetchGroups = useCallback(async () => {
    try {
      const { data: memberData, error: memberError } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', currentUserId);

      if (memberError) throw memberError;

      if (memberData && memberData.length > 0) {
        const groupIds = memberData.map(m => m.group_id);

        const { data: groupsData, error: groupsError } = await supabase
          .from('groups')
          .select('id, name, created_at, creator_id, security_level, password, avatar_url')
          .in('id', groupIds);

        if (groupsError) throw groupsError;

        const groupsWithMembers = await Promise.all(
          groupsData.map(async (group) => {
            const { data: members, error: membersError } = await supabase
              .from('group_members')
              .select('id, user_id, role, joined_at, group_id')
              .eq('group_id', group.id);

            if (membersError) throw membersError;

            return {
              ...group,
              members: (members || []).map(member => ({
                ...member,
                group_id: member.group_id ?? group.id,
                role: member.role as 'admin' | 'member'
              }))
            } as Group;
          })
        );

        setGroups(groupsWithMembers);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast({
        title: "Kunne ikke hente grupper",
        description: "En feil oppstod. Prøv igjen senere.",
        variant: "destructive"
      });
    }
  }, [currentUserId, toast]);

  useEffect(() => {
    if (currentUserId) {
      fetchGroups();
    }
  }, [currentUserId, fetchGroups]);

  const refreshGroups = fetchGroups;

  const handleCreateGroup = async (
    name: string,
    members: string[],
    securityLevel: SecurityLevel,
    password?: string,
    avatar?: File
  ) => {
    try {
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert({
          name,
          creator_id: currentUserId,
          security_level: securityLevel,
          password: password || null
        })
        .select('id')
        .single();

      if (groupError) throw groupError;

      const groupId = groupData.id;

      let avatarUrl = null;
      if (avatar) {
        const fileExt = avatar.name.split('.').pop();
        const filePath = `${groupId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('group_avatars')
          .upload(filePath, avatar);

        if (uploadError) throw uploadError;

        avatarUrl = filePath;

        const { error: updateError } = await supabase
          .from('groups')
          .update({ avatar_url: avatarUrl })
          .eq('id', groupId);

        if (updateError) throw updateError;
      }

      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          user_id: currentUserId,
          group_id: groupId,
          role: 'admin'
        });

      if (memberError) throw memberError;

      if (members.length > 0) {
        const memberInserts = members.map(userId => ({
          user_id: userId,
          group_id: groupId,
          role: 'member'
        }));

        const { error: membersError } = await supabase
          .from('group_members')
          .insert(memberInserts);

        if (membersError) throw membersError;
      }

      const invites = members.map(userId => ({
        group_id: groupId,
        invited_by: currentUserId,
        invited_user_id: userId
      }));

      const { error: invitesError } = await supabase
        .from('group_invites')
        .insert(invites);

      if (invitesError) console.warn("Failed to create invites:", invitesError);

      const { data: completeGroup, error: completeError } = await supabase
        .from('groups')
        .select('id, name, created_at, creator_id, security_level, password, avatar_url')
        .eq('id', groupId)
        .single();

      if (completeError) throw completeError;

      const { data: groupMembers, error: groupMembersError } = await supabase
        .from('group_members')
        .select('id, user_id, role, joined_at, group_id')
        .eq('group_id', groupId);

      if (groupMembersError) throw groupMembersError;

      const typedMembers: GroupMember[] = (groupMembers || []).map(member => ({
        ...member,
        group_id: member.group_id ?? groupId,
        role: member.role as 'admin' | 'member'
      }));

      const newGroup: Group = {
        ...completeGroup,
        security_level: completeGroup.security_level as SecurityLevel,
        members: typedMembers
      };

      setGroups(prevGroups => [...prevGroups, newGroup]);
      setSelectedGroup(newGroup);

      toast({
        title: "Gruppe opprettet",
        description: `Gruppen "${name}" ble opprettet`,
      });
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Kunne ikke opprette gruppe",
        description: "En feil oppstod. Prøv igjen senere.",
        variant: "destructive",
      });
    }
  };

  const handleJoinGroup = async (groupId: string, password?: string) => {
    try {
      if (password) {
        const { data: group, error: groupError } = await supabase
          .from('groups')
          .select('password')
          .eq('id', groupId)
          .single();

        if (groupError) throw groupError;

        if (group.password !== password) {
          return false;
        }
      }

      const { error: joinError } = await supabase
        .from('group_members')
        .insert({
          user_id: currentUserId,
          group_id: groupId,
          role: 'member'
        });

      if (joinError) throw joinError;

      await refreshGroups();

      const joinedGroup = groups.find(g => g.id === groupId);
      if (joinedGroup) {
        setSelectedGroup(joinedGroup);
      }

      return true;
    } catch (error) {
      console.error("Error joining group:", error);
      toast({
        title: "Kunne ikke bli med i gruppen",
        description: "En feil oppstod. Prøv igjen senere.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    groups,
    setGroups,
    selectedGroup,
    setSelectedGroup,
    handleCreateGroup,
    handleJoinGroup,
    refreshGroups,
  };
}
