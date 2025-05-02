
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GroupInvite } from "@/types/group";

export const useGroupInvites = (userId: string) => {
  const [invites, setInvites] = useState<GroupInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const fetchInvites = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("group_invites")
        .select(`
          id, 
          group_id,
          invited_by,
          invited_user_id,
          status,
          created_at,
          expires_at,
          groups:group_id(name)
        `)
        .eq("invited_user_id", userId)
        .eq("status", "pending");

      if (error) {
        throw error;
      }

      // Transform the data to match GroupInvite interface
      const formattedInvites = (data || []).map((invite) => ({
        id: invite.id,
        groupId: invite.group_id,
        group_id: invite.group_id,
        invitedById: invite.invited_by,
        invited_by: invite.invited_by,
        invitedUserId: invite.invited_user_id,
        invited_user_id: invite.invited_user_id,
        status: invite.status,
        createdAt: invite.created_at,
        created_at: invite.created_at,
        expiresAt: invite.expires_at,
        expires_at: invite.expires_at,
        group_name: invite.groups?.name || "Unknown Group"
      }));

      setInvites(formattedInvites);
    } catch (error) {
      console.error("Error fetching invites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchInvites();
    }
  }, [userId]);

  const acceptInvite = async (invite: GroupInvite) => {
    try {
      // Update invite status
      const { error } = await supabase
        .from("group_invites")
        .update({ status: "accepted" })
        .eq("id", invite.id);

      if (error) throw error;

      // Add user to group members
      const { error: memberError } = await supabase.from("group_members").insert({
        userId: userId,
        groupId: invite.groupId || invite.group_id,
        role: "member"
      });

      if (memberError) throw memberError;

      // Update local state
      setInvites((prev) => prev.filter((i) => i.id !== invite.id));

      return true;
    } catch (error) {
      console.error("Error accepting invite:", error);
      throw error;
    }
  };

  const declineInvite = async (invite: GroupInvite) => {
    try {
      const { error } = await supabase
        .from("group_invites")
        .update({ status: "rejected" })
        .eq("id", invite.id);

      if (error) throw error;

      // Update local state
      setInvites((prev) => prev.filter((i) => i.id !== invite.id));

      return true;
    } catch (error) {
      console.error("Error declining invite:", error);
      throw error;
    }
  };

  return {
    invites,
    loading,
    showInviteDialog,
    setShowInviteDialog,
    fetchInvites,
    acceptInvite,
    declineInvite,
  };
};
