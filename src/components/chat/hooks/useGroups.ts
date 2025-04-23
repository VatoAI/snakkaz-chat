
import { useState, useEffect } from "react";
import { Group } from "@/types/group";
import { SecurityLevel } from "@/types/security";
import { useGroupFetching } from "./useGroupFetching";
import { useGroupCreation } from "./useGroupCreation";
import { useGroupJoin } from "./useGroupJoin";

interface UseGroupsProps {
  currentUserId: string;
  userProfiles: Record<string, { username: string | null, avatar_url: string | null }>;
}

export function useGroups({ currentUserId }: UseGroupsProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // Fetching groups logic
  const { fetchGroups } = useGroupFetching(currentUserId);

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

  // Group creation logic
  const { handleCreateGroup } = useGroupCreation(currentUserId, setGroups, setSelectedGroup);

  // Group join logic
  const { handleJoinGroup } = useGroupJoin(currentUserId, groups, setSelectedGroup, refreshGroups);

  return {
    groups,
    setGroups,
    selectedGroup,
    setSelectedGroup,
    handleCreateGroup,
    handleJoinGroup,
    refreshGroups,
  };
}
