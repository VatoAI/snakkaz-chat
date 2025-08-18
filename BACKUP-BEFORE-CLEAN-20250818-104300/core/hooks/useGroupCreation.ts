import { useState } from "react";
import { Group } from "@/types/group";
import { SecurityLevel } from "@/types/security";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { GroupVisibility } from "@/features/groups/types/group";

export const useGroupCreation = (
  currentUserId?: string,
  setGroups?: React.Dispatch<React.SetStateAction<Group[]>>,
  setSelectedGroup?: React.Dispatch<React.SetStateAction<Group | null>>
) => {
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const userId = currentUserId || user?.id || '';

  const handleCreateGroup = async (
    name: string,
    description: string = "",
    visibility: GroupVisibility = "private",
    securityLevel: SecurityLevel = "standard"
  ): Promise<Group | null> => {
    if (!userId) return null;
    
    setIsCreating(true);
    try {
      // This is a mock implementation
      // In a real app, you'd create the group in the database
      const newGroup: Group = {
        id: `group-${Date.now()}`,
        name,
        description,
        createdAt: new Date().toISOString(),
        createdBy: userId,
        memberCount: 1,
        visibility: visibility,
        securityLevel: securityLevel,
        is_premium: false,
        avatarUrl: '',
        members: [{
          id: `member-${Date.now()}`,
          userId: userId,
          groupId: `group-${Date.now()}`,
          role: 'admin',
          joinedAt: new Date().toISOString(),
          canWrite: true
        }]
      };
      
      // Update local state if setGroups was provided
      if (setGroups) {
        setGroups(prev => [...prev, newGroup]);
      }
      
      // Set as selected group if setSelectedGroup was provided
      if (setSelectedGroup) {
        setSelectedGroup(newGroup);
      }
      
      return newGroup;
    } catch (error) {
      console.error("Error creating group:", error);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    handleCreateGroup,
    isCreating
  };
};
