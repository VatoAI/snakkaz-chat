
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useFriendRequestHandler = (currentUserId: string) => {
  const { toast } = useToast();

  const handleSendFriendRequest = useCallback(async (friendId: string) => {
    try {
      const { data: existingFriendship, error: checkError } = await supabase
        .from('friendships')
        .select('id, status')
        .or(`and(user_id.eq.${currentUserId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${currentUserId})`)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingFriendship) {
        if (existingFriendship.status === 'accepted') {
          toast({
            title: "Dere er allerede venner",
            description: "Denne brukeren er allerede din venn",
          });
        } else {
          toast({
            title: "Forespørsel finnes allerede",
            description: "Det finnes allerede en venneforespørsel mellom dere",
          });
        }
        return;
      }

      const { error: insertError } = await supabase
        .from('friendships')
        .insert({
          user_id: currentUserId,
          friend_id: friendId,
          status: 'pending'
        });

      if (insertError) throw insertError;

      toast({
        title: "Venneforespørsel sendt",
        description: "Du vil få beskjed når brukeren svarer på forespørselen",
      });
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke sende venneforespørsel",
        variant: "destructive",
      });
    }
  }, [currentUserId, toast]);

  return { handleSendFriendRequest };
};
