import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Group, GroupMember } from "@/types/group";
import { SecurityLevel } from "@/types/security";
import { useToast } from "@/components/ui/use-toast";
import { PostgrestError } from "@supabase/supabase-js";

export function useGroupFetching(currentUserId: string) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleSupabaseError = (error: PostgrestError, operation: string): void => {
    console.error(`Supabase ${operation} error:`, {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    
    if (error.code === 'POSTGRES_ERROR') {
      if (error.message.includes('timeout')) {
        toast({
          title: "Tidsavbrudd",
          description: "Forespørselen tok for lang tid. Sjekk nettverkstilkoblingen din og prøv igjen.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Databasefeil",
          description: "En feil oppstod i databasen. Vennligst prøv igjen senere.",
          variant: "destructive"
        });
      }
    }
  };

  const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3): Promise<any> => {
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        return await fn();
      } catch (error) {
        retries++;
        if (retries >= maxRetries) throw error;
        
        const delay = Math.pow(2, retries) * 1000;
        console.log(`Retry attempt ${retries}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  const fetchGroups = useCallback(async (): Promise<Group[]> => {
    setIsLoading(true);
    
    try {
      if (!currentUserId) {
        console.error("No user ID provided to fetchGroups");
        return [];
      }

      const fetchMemberships = async () => {
        const { data, error } = await supabase
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

        if (error) {
          handleSupabaseError(error, "group_members query");
          throw error;
        }
        
        return data || [];
      };

      const memberData = await retryWithBackoff(fetchMemberships);

      if (!memberData?.length) return [];

      const groups = memberData
        .filter(membership => membership.groups)
        .map(membership => {
          const group = membership.groups as any;
          return {
            ...group,
            security_level: group.security_level as SecurityLevel,
            write_permissions: group.write_permissions || 'all',
            default_message_ttl: group.default_message_ttl || null
          };
        });

      const groupsWithMembers: Group[] = [];
      const failedGroups: string[] = [];
      
      for (const group of groups) {
        try {
          const fetchMembers = async () => {
            const { data, error } = await supabase
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

            if (error) {
              handleSupabaseError(error, `members query for group ${group.id}`);
              throw error;
            }
            
            return data || [];
          };
          
          const membersData = await retryWithBackoff(fetchMembers);
          
          const membersWithProfiles: GroupMember[] = membersData.map(member => {
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
              can_write: member.can_write !== false, 
              profile: profile
            };
          });
          
          groupsWithMembers.push({
            ...group,
            members: membersWithProfiles
          });
        } catch (error) {
          console.error("Error processing group data for group", group.id, ":", error);
          failedGroups.push(group.name || `Gruppe ${group.id}`);
        }
      }

      if (failedGroups.length > 0 && failedGroups.length < groups.length) {
        toast({
          title: "Delvis lastet grupper",
          description: `Kunne ikke laste komplett informasjon for ${failedGroups.length} grupper. Oppdater for å prøve igjen.`,
          variant: "warning"
        });
      }

      setRetryCount(0);
      return groupsWithMembers;
      
    } catch (error) {
      console.error("Fatal error fetching groups:", error);
      
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      
      let errorMessage = "En feil oppstod ved henting av grupper. ";
      
      if (newRetryCount <= 3) {
        errorMessage += "Sjekk nettverkstilkoblingen din og prøv igjen.";
      } else {
        errorMessage += "Dette problemet vedvarer. Prøv å logge ut og inn igjen, eller kontakt support.";
      }
      
      toast({
        title: "Kunne ikke hente grupper",
        description: errorMessage,
        variant: "destructive"
      });
      
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, toast, retryCount]);

  return { fetchGroups, isLoading };
}
