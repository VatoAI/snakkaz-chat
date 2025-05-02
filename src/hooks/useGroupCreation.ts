
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Group } from "@/types/group";
import { SecurityLevel } from "@/types/security";
import { useToast } from "@/hooks/use-toast";

type GroupWritePermission = "all" | "admin" | "selected";
type MessageTTLOption = 300 | 1800 | 3600 | 86400 | 604800 | null;

export function useGroupCreation(
  currentUserId: string, 
  setGroups: (updater: (prev: Group[]) => Group[]) => void,
  setSelectedGroup: (group: Group | null) => void
) {
  const { toast } = useToast();
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const handleCreateGroup = async (
    name: string,
    description?: string,
    visibility: "private" | "public" | "hidden" = "private",
    securityLevel: SecurityLevel = "standard",
    isPremium: boolean = false
  ) => {
    try {
      setIsCreatingGroup(true);
      
      if (!name.trim()) {
        toast({
          title: "Mangler gruppenavn",
          description: "Vennligst skriv inn et gruppenavn",
          variant: "destructive"
        });
        return null;
      }
      
      // Create the group
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: name.trim(),
          description: description?.trim(),
          creator_id: currentUserId,
          security_level: securityLevel,
          is_premium: isPremium
        })
        .select()
        .single();
        
      if (groupError) {
        throw groupError;
      }
      
      // Add creator as admin
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          user_id: currentUserId,
          group_id: groupData.id,
          role: 'admin',
          can_write: true
        });
        
      if (memberError) {
        throw memberError;
      }
      
      // Create group object with proper structure
      const newGroup: Group = {
        id: groupData.id,
        name: groupData.name,
        createdAt: groupData.created_at,
        created_at: groupData.created_at,
        createdBy: currentUserId,
        creator_id: currentUserId,
        avatarUrl: groupData.avatar_url,
        avatar_url: groupData.avatar_url,
        securityLevel: groupData.security_level as SecurityLevel,
        security_level: groupData.security_level as SecurityLevel,
        visibility: visibility,
        is_premium: groupData.is_premium || false,
        isPremium: groupData.is_premium || false,
        description: groupData.description,
        password: groupData.password,
        members: [{
          id: `temp-${Date.now()}`,
          userId: currentUserId,
          user_id: currentUserId,
          groupId: groupData.id,
          group_id: groupData.id,
          role: 'admin',
          joinedAt: new Date().toISOString(),
          joined_at: new Date().toISOString(),
          can_write: true,
          permissions: { canWrite: true }
        }]
      };
      
      // Update groups state
      setGroups(prev => [...prev, newGroup]);
      setSelectedGroup(newGroup);
      
      toast({
        title: "Gruppe opprettet",
        description: `Gruppen "${name}" ble opprettet.`,
      });
      
      return newGroup;
      
    } catch (error: any) {
      console.error("Error creating group:", error);
      toast({
        title: "Kunne ikke opprette gruppe",
        description: error?.message || "En uventet feil oppstod",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsCreatingGroup(false);
    }
  };

  return { handleCreateGroup, isCreatingGroup };
}
