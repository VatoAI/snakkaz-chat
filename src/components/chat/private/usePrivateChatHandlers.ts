
import { useCallback } from "react";
import { Group, GroupInvite } from "@/types/group";
import { useToast } from "@/components/ui/use-toast";

interface UsePrivateChatHandlersProps {
  currentUserId: string;
  userProfiles: Record<string, { username: string | null; avatar_url: string | null }>;
  groups: Group[];
  setGroupInvites: React.Dispatch<React.SetStateAction<GroupInvite[]>>;
  refreshGroups: () => Promise<void>;
  setSelectedGroup: (g: Group | null) => void;
}

export function usePrivateChatHandlers({
  currentUserId,
  userProfiles,
  groups,
  setGroupInvites,
  refreshGroups,
  setSelectedGroup,
}: UsePrivateChatHandlersProps) {
  const { toast } = useToast();

  const handleAcceptInvite = useCallback(async (invite: GroupInvite) => {
    try {
      const supabase = (await import("@/integrations/supabase/client")).supabase;

      const { error: joinError } = await supabase
        .from("group_members")
        .insert({
          user_id: currentUserId,
          group_id: invite.groupId || invite.group_id,
          role: "member",
        });

      if (joinError) throw joinError;

      const { error: deleteError } = await supabase
        .from("group_invites")
        .delete()
        .eq("id", invite.id);

      if (deleteError) throw deleteError;

      await refreshGroups();
      setGroupInvites((invites) => invites.filter((inv) => inv.id !== invite.id));

      const joinedGroup = groups.find((g) => g.id === (invite.groupId || invite.group_id));
      if (joinedGroup) {
        setSelectedGroup(joinedGroup);
      }

      toast({
        title: "Bli med i gruppe",
        description: "Du har blitt med i gruppen.",
      });
    } catch (error) {
      console.error("Error accepting invite:", error);
      toast({
        title: "Feil",
        description: "Kunne ikke akseptere invitasjon.",
        variant: "destructive",
      });
    }
  }, [currentUserId, groups, refreshGroups, setGroupInvites, setSelectedGroup, toast]);

  const handleDeclineInvite = useCallback(async (invite: GroupInvite) => {
    try {
      const supabase = (await import("@/integrations/supabase/client")).supabase;

      const { error } = await supabase
        .from("group_invites")
        .delete()
        .eq("id", invite.id);

      if (error) throw error;

      setGroupInvites((invites) => invites.filter((inv) => inv.id !== invite.id));
      toast({
        title: "Avslått invitasjon",
        description: "Du har avslått invitasjonen.",
      });
    } catch (error) {
      console.error("Error declining invite:", error);
      toast({
        title: "Feil",
        description: "Kunne ikke avslå invitasjon.",
        variant: "destructive",
      });
    }
  }, [setGroupInvites, toast]);

  return { handleAcceptInvite, handleDeclineInvite };
}
