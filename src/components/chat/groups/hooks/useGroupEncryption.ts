/**
 * Hook for helside kryptering av gruppechat
 */

import { useCallback, useState, useEffect } from 'react';
import { useWholePageEncryption } from '@/hooks/useWholePageEncryption';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Group } from '@/types/group';
import { DecryptedMessage } from '@/types/message';

export interface GroupPageData {
  messages: DecryptedMessage[];
  metadata: {
    group_id: string;
    encryptionTimestamp: number;
    messageCount: number;
  };
  settings: {
    encryptionEnabled: boolean;
  };
}

export function useGroupEncryption(
  group: Group,
  currentUserId: string,
  groupMessages: DecryptedMessage[] = []
) {
  const { toast } = useToast();
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  const [encryptionStatus, setEncryptionStatus] = useState<'idle' | 'encrypting' | 'decrypting' | 'error'>('idle');
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(false);
  
  const { 
    encryptPage, 
    decryptPage, 
    generateNewGroupKey,
    isProcessing,
    error
  } = useWholePageEncryption({
    onError: (err) => {
      toast({
        title: 'Krypteringsfeil',
        description: err.message || 'Det oppstod en feil med krypteringen',
        variant: 'destructive'
      });
    }
  });

  // Hent gruppens krypteringsnøkkel fra databasen
  const fetchGroupEncryptionKey = useCallback(async () => {
    try {
      if (!group?.id) return;

      // Use group_encryption table instead of group_encryption_keys
      const { data, error } = await supabase
        .from('group_encryption')
        .select('encryption_key')
        .eq('group_id', group.id)
        .single();

      if (error) {
        console.error('Feil ved henting av krypteringsnøkkel:', error);
        return;
      }

      if (data?.encryption_key) {
        setEncryptionKey(data.encryption_key);
        setIsEncryptionEnabled(true);
      }
    } catch (err) {
      console.error('Uventet feil ved henting av krypteringsnøkkel:', err);
    }
  }, [group?.id]);

  // Last nøkkel ved oppstart
  useEffect(() => {
    fetchGroupEncryptionKey();
  }, [fetchGroupEncryptionKey]);

  // Aktiver helside-kryptering for gruppen
  const enableEncryption = useCallback(async () => {
    try {
      if (!group?.id || !currentUserId) return;
      
      // Sjekk om brukeren har rettigheter til å aktivere kryptering
      const isAdmin = group.creator_id === currentUserId || 
                       group.members.some(member => member.user_id === currentUserId && member.role === 'admin');
      
      if (!isAdmin) {
        toast({
          title: 'Manglende tillatelse',
          description: 'Bare administratorer kan aktivere helside-kryptering',
          variant: 'destructive'
        });
        return;
      }

      setEncryptionStatus('encrypting');
      
      // Generer ny krypteringsnøkkel
      const keyPair = await generateNewGroupKey();
      
      if (!keyPair) {
        throw new Error('Kunne ikke generere krypteringsnøkkel');
      }
      
      // Lagre nøkkelen i databasen - using group_encryption table
      const { error: saveError } = await supabase
        .from('group_encryption')
        .upsert({
          group_id: group.id,
          encryption_key: keyPair.key,
          created_by: currentUserId,
          created_at: new Date().toISOString()
        });
        
      if (saveError) {
        throw new Error('Kunne ikke lagre krypteringsnøkkel');
      }
      
      // Oppdater lokal status
      setEncryptionKey(keyPair.key);
      setIsEncryptionEnabled(true);
      
      toast({
        title: 'Kryptering aktivert',
        description: 'Helside-kryptering er nå aktivert for denne gruppen'
      });
      
      return keyPair.key;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Ukjent feil ved aktivering av kryptering';
      toast({
        title: 'Krypteringsfeil',
        description: errorMsg,
        variant: 'destructive'
      });
      return null;
    } finally {
      setEncryptionStatus('idle');
    }
  }, [group?.id, currentUserId, generateNewGroupKey, toast]);

  // Krypter gruppemeldinger
  const encryptGroupMessages = useCallback(async () => {
    try {
      if (!encryptionKey || !group?.id) {
        toast({
          title: 'Kan ikke kryptere',
          description: 'Ingen krypteringsnøkkel funnet for denne gruppen',
          variant: 'destructive'
        });
        return null;
      }
      
      setEncryptionStatus('encrypting');
      
      // Forbered data for kryptering
      const pageData: GroupPageData = {
        messages: groupMessages,
        metadata: {
          group_id: group.id,
          encryptionTimestamp: Date.now(),
          messageCount: groupMessages.length
        },
        settings: {
          encryptionEnabled: true
        }
      };
      
      // Krypter dataene
      const encryptedData = await encryptPage(pageData, encryptionKey);
      
      if (!encryptedData) {
        throw new Error('Kryptering feilet');
      }
      
      // Use the existing messages table to store encrypted data
      const { error: updateError } = await supabase
        .from('messages')
        .insert({
          group_id: group.id,
          content: encryptedData, // Store encrypted data in content field
          sender_id: currentUserId,
          type: 'encrypted_group_data',
          created_at: new Date().toISOString()
        });
        
      if (updateError) {
        throw new Error('Kunne ikke lagre kryptert data');
      }
      
      toast({
        title: 'Kryptering fullført',
        description: `${groupMessages.length} meldinger er nå kryptert`
      });
      
      return encryptedData;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Ukjent feil ved kryptering';
      toast({
        title: 'Krypteringsfeil',
        description: errorMsg,
        variant: 'destructive'
      });
      return null;
    } finally {
      setEncryptionStatus('idle');
    }
  }, [encryptionKey, group?.id, groupMessages, encryptPage, currentUserId, toast]);

  // Dekrypter gruppemeldinger
  const decryptGroupMessages = useCallback(async () => {
    try {
      if (!encryptionKey || !group?.id) {
        return null;
      }
      
      setEncryptionStatus('decrypting');
      
      // Hent kryptert data fra messages tabellen
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('content')
        .eq('group_id', group.id)
        .eq('type', 'encrypted_group_data')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (fetchError || !data?.content) {
        throw new Error('Kunne ikke hente kryptert data');
      }
      
      // Dekryptere dataen
      const decryptedData = await decryptPage(data.content, encryptionKey);
      
      if (!decryptedData) {
        throw new Error('Dekryptering feilet');
      }
      
      toast({
        title: 'Dekryptering fullført',
        description: `${(decryptedData as GroupPageData).messages.length} meldinger er dekryptert`
      });
      
      return decryptedData as GroupPageData;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Ukjent feil ved dekryptering';
      toast({
        title: 'Dekrypteringsfeil',
        description: errorMsg,
        variant: 'destructive'
      });
      return null;
    } finally {
      setEncryptionStatus('idle');
    }
  }, [encryptionKey, group?.id, decryptPage, toast]);

  return {
    encryptionKey,
    isEncryptionEnabled,
    encryptionStatus,
    isProcessing,
    error,
    enableEncryption,
    encryptGroupMessages,
    decryptGroupMessages
  };
}