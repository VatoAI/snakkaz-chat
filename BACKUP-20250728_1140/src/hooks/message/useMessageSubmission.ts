
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { encryptMessage } from "@/utils/encryption";

export const useMessageSubmission = (userId: string | null) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (content: string, ttl: number | null = null) => {
    if (!userId || !content.trim()) return;

    setIsSubmitting(true);
    try {
      // Encrypt the message
      const { encryptedContent, key, iv } = await encryptMessage(content.trim());

      const { error } = await supabase
        .from('messages')
        .insert({
          encrypted_content: encryptedContent,
          encryption_key: key,
          iv: iv,
          sender_id: userId,
          ephemeral_ttl: ttl
        });

      if (error) throw error;

    } catch (error) {
      console.error('Error submitting message:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke sende melding",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
};
