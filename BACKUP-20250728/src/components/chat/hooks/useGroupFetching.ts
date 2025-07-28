import { useCallback, useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Group, GroupMember } from "@/types/group";
import { SecurityLevel } from "@/types/security";
import { useToast } from "@/components/ui/use-toast";
import { PostgrestError } from "@supabase/supabase-js";

export function useGroupFetching(currentUserId: string) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const cachedGroups = useRef<{timestamp: number, groups: Group[]} | null>(null);
  const isFetchingRef = useRef(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Try to refetch when we come back online
      if (cachedGroups.current && (Date.now() - cachedGroups.current.timestamp > 60000)) {
        fetchGroups().catch(console.error);
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSupabaseError = useCallback((error: PostgrestError, operation: string): void => {
    console.error(`Supabase ${operation} error:`, {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    
    if (!isOnline) {
      toast({
        title: "Ingen nettverkstilkobling",
        description: "Du er ikke tilkoblet internett. Koble til og prøv igjen.",
        variant: "destructive"
      });
      return;
    }
    
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
    } else if (error.code === 'PGRST301' || error.message.includes('JWT')) {
      toast({
        title: "Autentiseringsfeil",
        description: "Din økt har utløpt. Vennligst logg inn på nytt.",
        variant: "destructive"
      });
    }
  }, [isOnline, toast]);

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

  const fetchGroups = useCallback(async (forceRefresh = false): Promise<Group[]> => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) {
      console.log("Already fetching groups, waiting for current fetch to complete");
      return cachedGroups.current?.groups || [];
    }
    
    // Return cached data if recent and not forcing refresh
    if (!forceRefresh && 
        cachedGroups.current && 
        (Date.now() - cachedGroups.current.timestamp < 30000)) {
      console.log("Returning cached groups data");
      return cachedGroups.current.groups;
    }
    
    if (!isOnline) {
      // If offline, return cached data (if any) without showing another toast
      if (cachedGroups.current) {
        return cachedGroups.current.groups;
      }
      
      toast({
        title: "Ingen nettverkstilkobling",
        description: "Du er ikke tilkoblet internett. Koble til og prøv igjen.",
        variant: "destructive"
      });
      return [];
    }
    
    setIsLoading(true);
    isFetchingRef.current = true;
    
    try {
      if (!currentUserId) {
        console.error("No user ID provided to fetchGroups");
        return cachedGroups.current?.groups || [];
      }

      const fetchMemberships = async () => {
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
          handleSupabaseError(error, "group_members query");
          throw error;
        }
        
        return data || [];
      };

      const memberData = await retryWithBackoff(fetchMemberships);

      if (!memberData?.length) {
        // Store empty array in cache
        cachedGroups.current = { timestamp: Date.now(), groups: [] };
        return [];
      }

      const groups = memberData
        .filter(membership => membership.groups)
        .map(membership => {
          const group = membership.groups as any;
          return {
            ...group,
            security_level: group.security_level as SecurityLevel,
            write_permissions: group.write_permissions || 'all',
            default_message_ttl: group.default_message_ttl || 86400
          };
        });

      const groupsWithMembers: Group[] = [];
      const failedGroups: string[] = [];
      
      // Fetch members for each group
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
          
          // Still add the group but with placeholder data
          const userMembership = memberData.find(m => m.group_id === group.id);
          
          if (userMembership) {
            groupsWithMembers.push({
              ...group,
              members: [{
                id: `temp-${Date.now()}`,
                user_id: currentUserId,
                group_id: group.id,
                role: (userMembership.role as 'admin' | 'member') || 'member',
                joined_at: new Date().toISOString(),
                can_write: userMembership.can_write !== false,
                profile: {
                  id: currentUserId,
                  username: 'You',
                  avatar_url: null,
                  full_name: null
                }
              }]
            });
          }
        }
      }

      // Show warning if some groups failed to load completely
      if (failedGroups.length > 0 && failedGroups.length < groups.length) {
        toast({
          title: "Delvis lastet grupper",
          description: `Kunne ikke laste komplett informasjon for ${failedGroups.length} grupper. Oppdater for å prøve igjen.`,
          variant: "default"
        });
      }

      // Reset retry count on success
      setRetryCount(0);
      
      // Update cache
      cachedGroups.current = {
        timestamp: Date.now(),
        groups: groupsWithMembers
      };
      
      return groupsWithMembers;
      
    } catch (error) {
      console.error("Fatal error fetching groups:", error);
      
      // Increment retry count
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      
      // Return cached results if available rather than empty array
      if (cachedGroups.current) {
        toast({
          title: "Bruker lagrede gruppedata",
          description: "Kunne ikke hente oppdaterte gruppedata. Viser lagrede data.",
          variant: "warning"
        });
        return cachedGroups.current.groups;
      }
      
      // Otherwise show error message
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
      isFetchingRef.current = false;
    }
  }, [currentUserId, toast, retryCount, isOnline, handleSupabaseError]);

  // Initial fetch on mount
  useEffect(() => {
    if (currentUserId && !cachedGroups.current) {
      fetchGroups().catch(console.error);
    }
  }, [currentUserId, fetchGroups]);

  return { fetchGroups, isLoading, isOnline };
}
