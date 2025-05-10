
import { useToast } from "@/components/ui/use-toast";
import { Group, GroupInvite } from "@/types/group";
import { useEffect, useState } from "react";

interface UsePrivateChatHandlersProps {
  currentUserId: string;
  userProfiles: Record<string, { username: string | null; avatar_url: string | null }>;
  groups: Group[];
  refreshGroups: () => Promise<void>;
  setSelectedGroup: (group: Group) => void;
}

export const usePrivateChatHandlers = ({
  currentUserId,
  userProfiles,
  groups,
  refreshGroups,
  setSelectedGroup
}: UsePrivateChatHandlersProps) => {
  const { toast } = useToast();

  const handleAcceptInvite = async (invite: GroupInvite) => {
    try {
      // Implement acceptance logic
      await refreshGroups();
      
      // Find and select the group
      const acceptedGroup = groups.find(g => g.id === (invite.groupId || invite.group_id));
      if (acceptedGroup) {
        setSelectedGroup(acceptedGroup);
      }
      
      toast({
        title: "Group Invitation Accepted",
        description: `You've joined ${invite.group_name || "the group"}`,
      });
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast({
        variant: "destructive",
        title: "Error Joining Group",
        description: "Could not accept the invitation. Please try again.",
      });
    }
  };

  const handleDeclineInvite = async (invite: GroupInvite) => {
    try {
      // Implement decline logic
      
      toast({
        title: "Group Invitation Declined",
        description: "You've declined the invitation to join this group",
      });
    } catch (error) {
      console.error("Error declining invitation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not decline the invitation. Please try again.",
      });
    }
  };

  return {
    handleAcceptInvite,
    handleDeclineInvite,
  };
};
