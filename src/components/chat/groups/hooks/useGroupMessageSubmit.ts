
import { useState, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";

export const useGroupMessageSubmit = (
  currentUserId: string,
  newMessage: string,
  setNewMessage: (text: string) => void,
  setIsLoading: (loading: boolean) => void,
  editingMessage: { id: string; content: string } | null,
  resetEditingMessage: (msg: null) => void,
  handleSendGroupMessage: (e: React.FormEvent, message: string) => Promise<boolean>,
  groupId: string
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    setIsLoading(true);
    
    try {
      if (editingMessage) {
        // TODO: Implement group message editing once backend supports it
        toast({
          title: "Ikke støttet",
          description: "Redigering av gruppemeldinger er ikke støttet ennå.",
          variant: "destructive",
        });
        resetEditingMessage(null);
      } else {
        // Send new message
        const success = await handleSendGroupMessage(e, newMessage);
        
        if (success) {
          setNewMessage('');
        }
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke sende melding. Prøv igjen senere.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  }, [
    newMessage, 
    isSubmitting, 
    editingMessage, 
    setIsLoading, 
    setNewMessage, 
    resetEditingMessage, 
    handleSendGroupMessage, 
    toast
  ]);

  const handleDeleteMessage = useCallback(async (messageId: string) => {
    // TODO: Implement group message deletion once backend supports it
    toast({
      title: "Ikke støttet",
      description: "Sletting av gruppemeldinger er ikke støttet ennå.",
      variant: "destructive",
    });
    return Promise.resolve();
  }, [toast]);

  return {
    handleSubmit,
    handleDeleteMessage
  };
};
