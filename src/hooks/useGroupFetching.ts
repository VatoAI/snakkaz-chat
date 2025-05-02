
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Group } from "@/types/group";
import { SecurityLevel } from "@/types/security";
import { useToast } from "@/hooks/use-toast";

export function useGroupFetching(currentUserId: string) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const fetchGroups = useCallback(async (): Promise<Group[]> => {
    setIsLoading(true);
    
    try {
      if (!currentUserId) {
        return [];
      }

      const { data, error } = await supabase
        .from('group_members')
        .select(`
          group_id,
          role,
          can_write,
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

      if (error) {
        toast({
          title: "Kunne ikke hente grupper",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }
      
      if (!data?.length) {
        return [];
      }

      const groups = data
        .filter(membership => membership.groups)
        .map(membership => {
          const group = membership.groups as any;
          return {
            id: group.id,
            name: group.name,
            createdAt: group.created_at,
            created_at: group.created_at,
            createdBy: group.creator_id,
            creator_id: group.creator_id,
            avatarUrl: group.avatar_url,
            avatar_url: group.avatar_url,
            securityLevel: group.security_level as SecurityLevel,
            security_level: group.security_level as SecurityLevel,
            visibility: "private" as const, // Default value, should be updated from actual data
            is_premium: false, // Default value, should be updated from actual data
            password: group.password,
            write_permissions: group.write_permissions || 'all',
            default_message_ttl: group.default_message_ttl || 86400,
            members: [] // This will be populated with actual data later
          };
        });

      // For each group, we need to fetch members (in a real application this might be batched)
      for (const group of groups) {
        const { data: membersData } = await supabase
          .from('group_members')
          .select(`
            id,
            user_id,
            role,
            joined_at,
            can_write,
            profiles:user_id (
              id,
              username,
              avatar_url
            )
          `)
          .eq('group_id', group.id);
          
        if (membersData) {
          group.members = membersData.map(member => ({
            id: member.id,
            userId: member.user_id,
            user_id: member.user_id,
            groupId: group.id,
            group_id: group.id,
            role: member.role,
            joinedAt: member.joined_at,
            joined_at: member.joined_at,
            can_write: member.can_write !== false,
            permissions: { canWrite: member.can_write !== false } // Add permissions object for compatibility
          }));
        }
      }

      return groups;
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast({
        title: "Kunne ikke hente grupper",
        description: "En uventet feil oppstod. Prøv igjen senere.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, toast]);

  return { fetchGroups, isLoading };
}
