
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Group } from "@/types/group";
import { useToast } from "@/hooks/use-toast";

export function useGroupJoin(
  currentUserId: string, 
  groups: Group[], 
  setSelectedGroup: (g: Group | null) => void,
  refreshGroups: () => Promise<void>
) {
  const { toast } = useToast();
  
  const handleJoinGroup = useCallback(async (groupId: string, password?: string) => {
    try {
      if (password) {
        const { data: group, error: groupError } = await supabase
          .from('groups')
          .select('password')
          .eq('id', groupId)
          .single();

        if (groupError) throw groupError;

        if (group.password !== password) {
          toast({
            title: "Feil passord",
            description: "Passordet du oppga stemmer ikke med gruppens passord.",
            variant: "destructive",
          });
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
      
      toast({
        title: "Du er nå med i gruppen",
        description: "Du er nå med i gruppen og kan starte å chatte.",
      });

      return true;
    } catch (error: any) {
      console.error("Error joining group:", error);
      toast({
        title: "Kunne ikke bli med i gruppen",
        description: error?.message || "En feil oppstod. Prøv igjen senere.",
        variant: "destructive",
      });
      return false;
    }
  }, [currentUserId, groups, refreshGroups, setSelectedGroup, toast]);

  return { handleJoinGroup };
}
