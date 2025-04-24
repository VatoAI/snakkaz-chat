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
        // Implementerer gruppemeldingsredigering
        console.log("Redigerer gruppemelding:", editingMessage.id, newMessage);
        
        // Krypterer den nye meldingsteksten
        const { encryptedContent, key, iv } = await encryptMessage(newMessage.trim());
        
        // Oppdaterer meldingen i databasen
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
          .eq('sender_id', currentUserId); // Sørger for at kun avsender kan redigere
        
        if (error) {
          console.error("Feil ved redigering av gruppemelding:", error);
          toast({
            title: "Feil",
            description: "Kunne ikke redigere meldingen: " + error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Melding redigert",
            description: "Gruppemeldingen ble oppdatert",
          });
          setNewMessage('');
          resetEditingMessage(null);
        }
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
    toast,
    currentUserId
  ]);

  const handleDeleteMessage = useCallback(async (messageId: string) => {
    // Implementere sletting av gruppemeldinger
    setIsLoading(true);
    
    try {
      // Markerer meldingen som slettet istedenfor å fjerne den helt
      const { error } = await supabase
        .from('messages')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('sender_id', currentUserId); // Sikrer at bare avsender kan slette
      
      if (error) {
        console.error("Feil ved sletting av gruppemelding:", error);
        toast({
          title: "Feil",
          description: "Kunne ikke slette meldingen: " + error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Melding slettet",
          description: "Meldingen ble slettet",
        });
      }
    } catch (error) {
      console.error("Error deleting group message:", error);
      toast({
        title: "Feil",
        description: "Kunne ikke slette meldingen",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    
    return Promise.resolve();
  }, [currentUserId, setIsLoading, toast]);

  return {
    handleSubmit,
    handleDeleteMessage
  };
};
