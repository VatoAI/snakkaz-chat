
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Group, GroupMember } from "@/types/group";
import { SecurityLevel } from "@/types/security";
import { useToast } from "@/components/ui/use-toast";

export function useGroupFetching(currentUserId: string) {
  const { toast } = useToast();

  const fetchGroups = useCallback(async (): Promise<Group[]> => {
    try {
      // First fetch groups where user is a member
      const { data: memberData, error: memberError } = await supabase
        .from('group_members')
        .select(`
          group_id,
          role,
          groups (
            id,
            name,
            created_at,
            creator_id,
            security_level,
            password,
            avatar_url
          )
        `)
        .eq('user_id', currentUserId);

      if (memberError) throw memberError;

      if (!memberData?.length) return [];

      // Format the groups data
      const groups = memberData.map(membership => {
        const group = membership.groups as any;
        return {
          ...group,
          security_level: group.security_level as SecurityLevel
        };
      });

      // Fetch all members for these groups
      const groupIds = groups.map(g => g.id);
      const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select(`
          id,
          user_id,
          role,
          joined_at,
          group_id,
          profiles:user_id (
            id,
            username,
            avatar_url,
            full_name
          )
        `)
        .in('group_id', groupIds);

      if (membersError) throw membersError;

      // Add members to their respective groups
      return groups.map(group => ({
        ...group,
        members: (membersData || [])
          .filter(member => member.group_id === group.id)
          .map(member => ({
            ...member,
            profile: member.profiles
          })) as GroupMember[]
      }));
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast({
        title: "Kunne ikke hente grupper",
        description: "En feil oppstod. Prøv igjen senere.",
        variant: "destructive"
      });
      return [];
    }
  }, [currentUserId, toast]);

  return { fetchGroups };
}
