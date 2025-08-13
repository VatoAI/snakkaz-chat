/**
 * Hook for å håndtere offline meldinger i Snakkaz Chat med IndexedDB støtte
 * 
 * Oppdatert: IndexedDB implementasjon for større mediavedlegg
 */

import { useState, useEffect, useCallback } from 'react';
import { useNetworkStatus } from './use-network-status';
import { useToast } from './use-toast';
import {
  getOfflineMessages,
  saveOfflineMessage,
  updateOfflineMessageStatus,
  removeOfflineMessage,
  getOfflineMessageMedia,
  OfflineMessage
} from '@/utils/offline/enhancedOfflineMessageStore';

interface UseOfflineMessagesOptions {
  onSendMessage: (message: OfflineMessage, mediaBlob?: Blob) => Promise<boolean>;
  onSyncComplete?: (results: { sent: number, failed: number }) => void;
  enabled?: boolean;
}

/**
 * Hook for å håndtere offline meldingsfunksjonalitet med IndexedDB
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
      const updatePendingCount = async () => {
        const messages = await getOfflineMessages();
        const pending = messages.filter(msg => msg.status === 'pending' || msg.status === 'failed').length;
        setPendingCount(pending);
      };
      
      updatePendingCount();
    }
  }, [enabled]);

  // Sett opp automatisk synkronisering av offline meldinger
  useEffect(() => {
    if (!enabled) return;

    // Sjekk og synkroniser meldinger når nettverkstilkoblingen endres
    const syncMessages = async () => {
      if (!online || isSyncing) return;
      
      try {
        setIsSyncing(true);
        const messages = await getOfflineMessages();
        const pendingMessages = messages.filter(msg => 
          msg.status === 'pending' || msg.status === 'failed'
        );
        
        if (pendingMessages.length === 0) {
          setIsSyncing(false);
          return;
        }
        
        console.log(`[OfflineSync] Starting sync of ${pendingMessages.length} messages`);
        
        let sent = 0;
        let failed = 0;
        
        for (const message of pendingMessages) {
          try {
            // Update status to sending
            await updateOfflineMessageStatus(message.id, 'sending');
            
            // Get media if exists
            let mediaBlob: Blob | null = null;
            if (message.mediaId) {
              mediaBlob = await getOfflineMessageMedia(message.mediaId);
            }
            
            // Try to send message
            const success = await onSendMessage(message, mediaBlob || undefined);
            
            if (success) {
              // Remove from storage if successfully sent
              await removeOfflineMessage(message.id);
              sent++;
            } else {
              // Mark as failed and increment retry count
              await updateOfflineMessageStatus(
                message.id, 
                'failed', 
                message.retryCount + 1
              );
              failed++;
            }
          } catch (error) {
            console.error(`[OfflineSync] Failed to sync message ${message.id}:`, error);
            await updateOfflineMessageStatus(
              message.id, 
              'failed', 
              message.retryCount + 1
            );
            failed++;
          }
        }
        
        // Update pending count
        setPendingCount(prev => Math.max(0, prev - sent));
        
        if (sent > 0 || failed > 0) {
          let message = '';
          
          if (sent > 0) {
            message += `${sent} melding${sent !== 1 ? 'er' : ''} sendt. `;
          }
          
          if (failed > 0) {
            message += `${failed} melding${failed !== 1 ? 'er' : ''} feilet.`;
          }
          
          toast({
            title: 'Synkronisering fullført',
            description: message.trim(),
            variant: failed > 0 ? 'destructive' : 'default',
          });
        }
        
        if (onSyncComplete) {
          onSyncComplete({ sent, failed });
        }
      } finally {
        setIsSyncing(false);
      }
    };

    // Initial sync when coming online
    if (online) {
      syncMessages();
    }

    // Set up listeners for network status changes
    const handleOnline = () => {
      syncMessages();
    };

    window.addEventListener('online', handleOnline);
    
    // Clean up
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [enabled, online, onSendMessage, onSyncComplete, toast, isSyncing]);

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
    }
  ): Promise<{ id: string; queued: boolean }> => {
    if (!enabled) {
      throw new Error('Offline message handling is disabled');
    }
    
    if (!text.trim() && !options.mediaBlob) {
      throw new Error('Message cannot be empty');
    }
    
    // If online, try to send directly
    if (online && !isSyncing) {
      try {
        // Save as pending first in case sending fails
        const offlineMessage = await saveOfflineMessage(text, options);
        
        const success = await onSendMessage(
          offlineMessage,
          options.mediaBlob
        );
        
        if (success) {
          // Remove from storage if successfully sent
          await removeOfflineMessage(offlineMessage.id);
          return { id: offlineMessage.id, queued: false };
        }
        
        // Update status to failed if sending failed
        await updateOfflineMessageStatus(offlineMessage.id, 'failed');
        setPendingCount(prev => prev + 1);
        
        toast({
          title: 'Sending feilet',
          description: 'Meldingen vil bli sendt automatisk når tilkoblingen er gjenopprettet.',
          variant: 'destructive',
        });
        
        return { id: offlineMessage.id, queued: true };
      } catch (error) {
        console.error('Failed to send message:', error);
        
        // Save offline if direct sending failed
        const offlineMessage = await saveOfflineMessage(text, options);
        setPendingCount(prev => prev + 1);
        
        toast({
          title: 'Sending feilet',
          description: 'Meldingen vil bli sendt automatisk når tilkoblingen er gjenopprettet.',
          variant: 'destructive',
        });
        
        return { id: offlineMessage.id, queued: true };
      }
    } else {
      // Save offline directly if offline
      const offlineMessage = await saveOfflineMessage(text, options);
      setPendingCount(prev => prev + 1);
      
      if (!online) {
        toast({
          title: 'Lagret offline',
          description: 'Meldingen vil bli sendt automatisk når tilkoblingen er gjenopprettet.',
        });
      }
      
      return { id: offlineMessage.id, queued: true };
    }
  }, [enabled, online, isSyncing, onSendMessage, toast]);

  // Manuelt synkroniser meldinger
  const syncMessages = useCallback(async (): Promise<void> => {
    if (!enabled || !online || isSyncing) return;
    
    setIsSyncing(true);
    
    try {
      const messages = await getOfflineMessages();
      const pendingMessages = messages.filter(msg => 
        msg.status === 'pending' || msg.status === 'failed'
      );
      
      if (pendingMessages.length === 0) {
        toast({
          title: 'Ingen meldinger å synkronisere',
          description: 'Alle meldinger er allerede sendt.',
        });
        return;
      }
      
      toast({
        title: 'Synkroniserer meldinger...',
        description: `Sender ${pendingMessages.length} ventende meldinger.`,
      });
      
      let sent = 0;
      let failed = 0;
      
      for (const message of pendingMessages) {
        try {
          // Update status to sending
          await updateOfflineMessageStatus(message.id, 'sending');
          
          // Get media if exists
          let mediaBlob: Blob | null = null;
          if (message.mediaId) {
            mediaBlob = await getOfflineMessageMedia(message.mediaId);
          }
          
          // Try to send message
          const success = await onSendMessage(message, mediaBlob || undefined);
          
          if (success) {
            // Remove from storage if successfully sent
            await removeOfflineMessage(message.id);
            sent++;
          } else {
            // Mark as failed and increment retry count
            await updateOfflineMessageStatus(
              message.id, 
              'failed', 
              message.retryCount + 1
            );
            failed++;
          }
        } catch (error) {
          console.error(`Failed to sync message ${message.id}:`, error);
          await updateOfflineMessageStatus(
            message.id, 
            'failed', 
            message.retryCount + 1
          );
          failed++;
        }
      }
      
      // Update pending count
      setPendingCount(prev => Math.max(0, prev - sent));
      
      let resultMessage = '';
      if (sent > 0) {
        resultMessage += `${sent} melding${sent !== 1 ? 'er' : ''} sendt. `;
      }
      
      if (failed > 0) {
        resultMessage += `${failed} melding${failed !== 1 ? 'er' : ''} feilet.`;
      }
      
      toast({
        title: 'Synkronisering fullført',
        description: resultMessage.trim(),
        variant: failed > 0 ? 'destructive' : 'default',
      });
      
      if (onSyncComplete) {
        onSyncComplete({ sent, failed });
      }
    } finally {
      setIsSyncing(false);
    }
  }, [enabled, online, isSyncing, onSendMessage, onSyncComplete, toast]);

  return {
    sendMessage,
    syncMessages,
    pendingCount,
    isSyncing
  };
}

// Provide an alias for newer code that refers to the enhanced version
export const useEnhancedOfflineMessages = useOfflineMessages;
