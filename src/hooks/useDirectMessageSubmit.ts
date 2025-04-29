import { FormEvent, useCallback } from 'react';
import { WebRTCManager } from "@/utils/webrtc";
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for handling message form submission in direct messages
 */
export const useDirectMessageSubmit = (
  webRTCManager: WebRTCManager | null,
  friendId: string | undefined,
  newMessage: string,
  setNewMessage: (message: string) => void,
  usingServerFallback: boolean,
  handleSendMessage: (message: string) => Promise<boolean>,
  isLoading: boolean,
  setIsLoading: (loading: boolean) => void,
) => {
  const { toast } = useToast();

  const submitMessageForm = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    if (!newMessage.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      // Try sending with WebRTC if available and not using server fallback
      let success = false;
      
      if (webRTCManager && friendId && !usingServerFallback) {
        try {
          await webRTCManager.sendDirectMessage(friendId, newMessage);
          success = true;
          console.log('Message sent via P2P successfully');
        } catch (p2pError) {
          console.error('P2P message failed, falling back to server:', p2pError);
        }
      }
      
      // If WebRTC failed or we're using server fallback, use server
      if (!success) {
        success = await handleSendMessage(newMessage);
      }
      
      if (success) {
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Sendingsfeil",
        description: "Kunne ikke sende meldingen. Prøv igjen senere.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [webRTCManager, friendId, newMessage, setNewMessage, usingServerFallback, handleSendMessage, isLoading, setIsLoading, toast]);

  return {
    submitMessageForm
  };
};