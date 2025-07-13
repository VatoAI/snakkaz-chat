
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Friend } from "../types";
import { useToast } from "@/components/ui/use-toast";

export const useFriendManagement = (currentUserId: string) => {
  const { toast } = useToast();
  
  const handleAcceptFriendRequest = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', friendshipId);

      if (error) throw error;

      toast({
        title: "Venneforespørsel godkjent",
        description: "Dere er nå venner!",
      });
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke godkjenne venneforespørsel",
        variant: "destructive",
      });
    }
  };

  const handleRejectFriendRequest = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);

      if (error) throw error;

      toast({
        title: "Venneforespørsel avslått",
        description: "Forespørselen ble avslått",
      });
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke avslå venneforespørsel",
        variant: "destructive",
      });
    }
  };

  return {
    handleAcceptFriendRequest,
    handleRejectFriendRequest,
  };
};
