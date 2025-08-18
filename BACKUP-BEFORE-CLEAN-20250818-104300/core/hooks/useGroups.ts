
import { useState, useEffect } from "react";
import { Group } from "@/types/group";
import { SecurityLevel } from "@/types/security";
import { useGroupFetching } from "./useGroupFetching";
import { useGroupCreation } from "./useGroupCreation";
import { useGroupJoin } from "./useGroupJoin";
import { useGroupInvites } from "@/features/groups/hooks/useGroupInvites";
import { useAuth } from "@/hooks/useAuth";

interface UseGroupsProps {
  currentUserId?: string;
  userProfiles?: Record<string, { username: string | null, avatar_url: string | null }>;
}

export function useGroups(props?: UseGroupsProps) {
  // Get currentUserId from props or from auth context
  const { user } = useAuth();
  const currentUserId = props?.currentUserId || user?.id || '';
  const userProfiles = props?.userProfiles || {};
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const { fetchGroups, isLoading } = useGroupFetching(currentUserId);

  const { inviteToGroup } = useGroupInvites(currentUserId);

  const refreshGroups = async () => {
    const result = await fetchGroups();
    setGroups(result);
  };

  useEffect(() => {
    if (currentUserId) {
      refreshGroups();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  const { handleCreateGroup } = useGroupCreation(currentUserId, setGroups, setSelectedGroup);

  const { handleJoinGroup } = useGroupJoin(currentUserId, groups, setSelectedGroup, refreshGroups);

  return {
    groups,
    setGroups,
    selectedGroup,
    setSelectedGroup,
    handleCreateGroup,
    handleJoinGroup,
    refreshGroups,
    inviteToGroup,
    loading: isLoading
  };
}
