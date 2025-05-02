import { useState, useEffect } from "react";
import { Group, SecurityLevel } from "@/types/group";
import { useGroupFetching } from "./useGroupFetching";
import { useGroupCreation } from "./useGroupCreation";
import { useGroupJoin } from "./useGroupJoin";
import { useGroupInvites } from "@/features/groups/hooks/useGroupInvites";

interface UseGroupsProps {
  currentUserId: string;
  userProfiles?: Record<string, { username: string | null, avatar_url: string | null }>;
}

export function useGroups({ currentUserId, userProfiles = {} }: UseGroupsProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const { fetchGroups } = useGroupFetching(currentUserId);

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
  };
}
