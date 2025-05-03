
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GroupInvite } from "@/features/groups/types";
import { useToast } from "@/hooks/use-toast";

export function useGroupInvites(userId: string) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const inviteToGroup = async (groupId: string, email: string) => {
    setLoading(true);
    try {
      // Generate a random invitation code
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Create the invitation in the database
      const { data, error } = await supabase
        .from('group_invites')
        .insert({
          group_id: groupId,
          invited_by: userId,
          email,
          code,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating invitation:", error);
        toast({
          title: "Error sending invitation",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }
      
      toast({
        title: "Invitation sent!",
        description: `An invitation has been created for ${email}`,
      });
      
      return {
        ...data,
        code
      };
    } catch (error) {
      console.error("Error in inviteToGroup:", error);
      toast({
        title: "Something went wrong",
        description: "Could not send invitation. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { inviteToGroup, loading };
}
