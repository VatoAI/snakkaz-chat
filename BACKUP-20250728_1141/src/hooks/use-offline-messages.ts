/**
 * Hook for å håndtere offline meldinger i Snakkaz Chat
 * 
 * Implementert: 22. mai 2025
 */

import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { useNetworkStatus } from './use-network-status';
import { useToast } from './use-toast';
import {
  getOfflineMessages,
  saveOfflineMessage,
  markOfflineMessageAsSent,
  markOfflineMessageAsFailed,
  clearSentOfflineMessages,
  getPendingMessageCount,
  OfflineMessage,
  setupOfflineSync
} from '@/utils/offline/offlineMessageStore';

interface UseOfflineMessagesOptions {
  onSendMessage: (message: OfflineMessage) => Promise<boolean>;
  onSyncComplete?: (results: { sent: number, failed: number }) => void;
  enabled?: boolean;
}

/**
 * Hook for å håndtere offline meldingsfunksjonalitet
 */
export function useOfflineMessages(options: UseOfflineMessagesOptions) {
  const { onSendMessage, onSyncComplete, enabled = true } = options;
  const { online } = useNetworkStatus();
  const { toast } = useToast();
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Oppdater antall ventende meldinger
  useEffect(() => {
    if (enabled) {
      setPendingCount(getPendingMessageCount());
    }
  }, [enabled]);

  // Sett opp automatisk synkronisering av offline meldinger
  useEffect(() => {
    if (!enabled) return;

    // Konfigurer synkronisering når nettverksstatus endres
    const cleanup = setupOfflineSync(
      async (message) => {
        try {
          return await onSendMessage(message);
        } catch (error) {
          console.error('Failed to send message during sync:', error);
          return false;
        }
      },
      {
        onSyncComplete: (results) => {
          setPendingCount(prevCount => Math.max(0, prevCount - results.sent));
          
          if (results.sent > 0 || results.failed > 0) {
            let message = '';
            
            if (results.sent > 0) {
              message += `${results.sent} melding${results.sent !== 1 ? 'er' : ''} sendt. `;
            }
            
            if (results.failed > 0) {
              message += `${results.failed} melding${results.failed !== 1 ? 'er' : ''} feilet.`;
            }
            
            toast({
              title: 'Synkronisering fullført',
              description: message.trim(),
              variant: results.failed > 0 ? 'destructive' : 'default',
            });
          }
          
          if (onSyncComplete) {
            onSyncComplete(results);
          }
          
          setIsSyncing(false);
        }
      }
    );

    return cleanup;
  }, [enabled, onSendMessage, onSyncComplete, toast]);

  // Funksjon for å sende melding (enten direkte eller lagre offline)
  const sendMessage = useCallback(async (
    text: string,
    options: {
      recipientId?: string;
      groupId?: string;
      mediaBlob?: Blob;
      mediaType?: string;
      mediaName?: string;
      ttl?: number;
    } = {}
  ) => {
    if (!enabled) {
      throw new Error('Offline message functionality is disabled');
    }

    // Hvis vi er online, prøv å sende meldingen direkte
    if (online) {
      try {
        const tempId = nanoid();
        
        const message: OfflineMessage = {
          id: tempId,
          text,
          recipientId: options.recipientId,
          groupId: options.groupId,
          mediaType: options.mediaType,
          mediaName: options.mediaName,
          ttl: options.ttl,
          createdAt: Date.now(),
          status: 'sending',
          retryCount: 0
        };

        const success = await onSendMessage(message);
        
        if (success) {
          return { success: true, id: tempId, offline: false };
        } else {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        console.error('Failed to send message directly:', error);
        
        // Hvis sending feiler, lagre meldingen offline
        const offlineMessage = saveOfflineMessage(text, options);
        setPendingCount(prev => prev + 1);
        
        toast({
          title: 'Melding lagret offline',
          description: 'Kunne ikke sende meldingen nå. Den vil sendes automatisk når tilkoblingen er gjenopprettet.',
          variant: 'destructive',
        });
        
        return { success: false, id: offlineMessage.id, offline: true };
      }
    } else {
      // Hvis vi er offline, lagre meldingen for senere sending
      const offlineMessage = saveOfflineMessage(text, options);
      setPendingCount(prev => prev + 1);
      
      toast({
        title: 'Melding lagret offline',
        description: 'Meldingen vil sendes når du er tilkoblet igjen.',
        variant: 'default',
      });
      
      return { success: true, id: offlineMessage.id, offline: true };
    }
  }, [enabled, online, onSendMessage, toast]);

  // Funksjon for å manuelt synkronisere meldinger
  const syncOfflineMessages = useCallback(async () => {
    if (!enabled || !online || isSyncing) return;
    
    setIsSyncing(true);
    
    const messages = getOfflineMessages().filter(msg => msg.status === 'pending');
    
    if (messages.length === 0) {
      setIsSyncing(false);
      return;
    }
    
    toast({
      title: 'Synkroniserer meldinger',
      description: `Sender ${messages.length} ventende melding${messages.length !== 1 ? 'er' : ''}...`,
      variant: 'default',
    });
    
    // Faktisk synkronisering håndteres av setupOfflineSync
    // som kjører automatisk når vi er online
  }, [enabled, online, isSyncing, toast]);

  return {
    sendMessage,
    syncOfflineMessages,
    pendingCount,
    isSyncing,
  };
}

export default useOfflineMessages;
