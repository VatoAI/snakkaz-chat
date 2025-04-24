import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Group, GroupMember } from "@/types/group";
import { SecurityLevel } from "@/types/security";
import { useToast } from "@/components/ui/use-toast";

export function useGroupFetching(currentUserId: string) {
  const { toast } = useToast();

  const fetchGroups = useCallback(async (): Promise<Group[]> => {
    try {
      if (!currentUserId) {
        console.error("No user ID provided to fetchGroups");
        return [];
      }

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
            avatar_url,
            write_permissions,
            default_message_ttl
          )
        `)
        .eq('user_id', currentUserId);

      if (memberError) {
        console.error("Error fetching group memberships:", memberError);
        throw memberError;
      }

      if (!memberData?.length) return [];

      // Format the groups data
      const groups = memberData
        .filter(membership => membership.groups) // Filter out any null groups
        .map(membership => {
          const group = membership.groups as any;
          return {
            ...group,
            security_level: group.security_level as SecurityLevel,
            // Hvis disse feltene ikke eksisterer, bruk standardverdier
            write_permissions: group.write_permissions || 'all', // 'all', 'admin', 'selected'
            default_message_ttl: group.default_message_ttl || null
          };
        });

      // Process each group to get its members with profiles
      const groupsWithMembers: Group[] = [];
      
      for (const group of groups) {
        try {
          const { data: membersData, error: membersError } = await supabase
            .from('group_members')
            .select(`
              id,
              user_id,
              role,
              joined_at,
              can_write,
              group_id,
              profiles:user_id (
                id,
                username,
                avatar_url,
                full_name
              )
            `)
            .eq('group_id', group.id);

          if (membersError) {
            console.error("Error fetching group members for group", group.id, ":", membersError);
            continue; // Skip this group but don't fail the whole request
          }
          
          if (!membersData) continue;
          
          // Create properly typed GroupMember objects with improved error handling
          const membersWithProfiles: GroupMember[] = membersData.map(member => {
            // Håndter profil-data på en sikker måte
            const profile = {
              id: member.user_id,
              username: member.profiles?.username || null,
              avatar_url: member.profiles?.avatar_url || null,
              full_name: member.profiles?.full_name || null
            };
              
            return {
              id: member.id,
              user_id: member.user_id,
              group_id: member.group_id,
              role: (member.role || 'member') as 'admin' | 'member',
              joined_at: member.joined_at,
              // Ny felt for å kontrollere skriverettigheter
              can_write: member.can_write !== false, // Standard er true hvis ikke spesifisert
              profile: profile
            };
          });
          
          groupsWithMembers.push({
            ...group,
            members: membersWithProfiles
          });
        } catch (error) {
          console.error("Error processing group data for group", group.id, ":", error);
          // Fortsett med neste gruppe istedenfor å avbryte hele prosessen
        }
      }

      return groupsWithMembers;
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast({
        title: "Kunne ikke hente grupper",
        description: "En feil oppstod ved henting av grupper. Sjekk nettverkstilkoblingen din og prøv igjen senere.",
        variant: "destructive"
      });
      return [];
    }
  }, [currentUserId, toast]);

  return { fetchGroups };
}
