
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Group, GroupMember } from "@/types/group";
import { SecurityLevel } from "@/types/security";
import { useToast } from "@/components/ui/use-toast";

// Utility: fetch groups and their members for signed-in user
export function useGroupFetching(currentUserId: string) {
  const { toast } = useToast();

  const fetchGroups = useCallback(async (): Promise<Group[]> => {
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
        return groupsWithMembers;
      }
      return [];
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
