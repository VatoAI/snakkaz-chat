
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
      
      const groupsWithMembers: Group[] = [];
      
      // Process each group to get its members with profiles
      for (const group of groups) {
        const { data: membersData, error: membersError } = await supabase
          .from('group_members')
          .select(`
            id,
            user_id,
            role,
            joined_at,
            group_id
          `)
          .eq('group_id', group.id);

        if (membersError) throw membersError;
        
        if (!membersData) continue;
        
        // For each member, fetch their profile information
        const membersWithProfiles: GroupMember[] = [];
        
        for (const member of membersData) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, full_name')
            .eq('id', member.user_id)
            .single();
            
          if (!profileError && profileData) {
            membersWithProfiles.push({
              ...member,
              profile: profileData
            } as GroupMember);
          } else {
            console.error(`Error fetching profile for group member ${member.user_id}:`, profileError);
            // Add member even without profile for data integrity
            membersWithProfiles.push({
              ...member,
              profile: {
                id: member.user_id,
                username: 'Unknown User',
                avatar_url: null,
                full_name: null
              }
            } as GroupMember);
          }
        }
        
        groupsWithMembers.push({
          ...group,
          members: membersWithProfiles
        });
      }

      return groupsWithMembers;
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
