
import { supabase } from "@/integrations/supabase/client";
import { SecurityLevel } from "@/types/security";
import { useToast } from "@/components/ui/use-toast";
import { Group } from "@/types/group";

export function useGroupJoin(
  currentUserId: string, 
  groups: Group[], 
  setSelectedGroup: (g: Group | null) => void, 
  refreshGroups: () => Promise<void>
) {
  const { toast } = useToast();
  
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

  return { handleJoinGroup };
}
