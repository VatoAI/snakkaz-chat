import { useState, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { encryptMessage } from "@/utils/encryption";

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
        // Implementasjon av gruppemeldingsredigering
        const { encryptedContent, key, iv } = await encryptMessage(newMessage.trim());
        
        const { error } = await supabase
          .from('messages')
          .update({
            encrypted_content: encryptedContent,
            encryption_key: key,
            iv: iv,
            is_edited: true,
            edited_at: new Date().toISOString()
          })
          .eq('id', editingMessage.id)
          .eq('sender_id', currentUserId); // Sikre at kun avsender kan redigere
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Melding redigert",
          description: "Gruppemeldingen ble oppdatert",
        });
        
        resetEditingMessage(null);
        setNewMessage('');
      } else {
        // Send ny melding
        const success = await handleSendGroupMessage(e, newMessage);
        
        if (success) {
          setNewMessage('');
        }
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke sende eller redigere melding. Prøv igjen senere.",
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
    toast,
    currentUserId
  ]);

  const handleDeleteMessage = useCallback(async (messageId: string) => {
    try {
      // Implementasjon av gruppemeldingssletting
      const { error } = await supabase
        .from('messages')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('sender_id', currentUserId); // Sikre at kun avsender kan slette
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Melding slettet",
        description: "Gruppemeldingen ble slettet",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke slette meldingen",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  }, [toast, currentUserId]);

  return {
    handleSubmit,
    handleDeleteMessage
  };
};
