/**
 * Hook for å håndtere sikker meldingskryptering med Double Ratchet-algoritmen
 * Dette gir Perfect Forward Secrecy (PFS) tilsvarende Signal-protokollen
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { generateKeyPair } from '@/utils/encryption/key-management';
import { 
  initializeRatchet, 
  rotateSendingKeys, 
  rotateReceivingKeys,
  updateRatchetWithNewKey,
  MessageKeys 
} from '@/utils/encryption/ratchet/doubleRatchet';

interface UseSecureMessageKeysOptions {
  conversationId: string;
  recipientPublicKey?: JsonWebKey;
  onError?: (error: Error) => void;
}

/**
 * Hook for å håndtere sikker meldingskryptering med Double Ratchet
 */
export function useSecureMessageKeys({
  conversationId,
  recipientPublicKey,
  onError
}: UseSecureMessageKeysOptions) {
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [messageCounter, setMessageCounter] = useState(0);
  
  // Initialiser ratchet for denne samtalen
  const initializeSecureChannel = useCallback(async () => {
    if (!user || !conversationId) return;
    
    try {
      // Generer nye nøkler hvis nødvendig
      const { publicKey, privateKey } = await generateKeyPair();
      
      // Initier ratchet for denne samtalen
      await initializeRatchet(
        conversationId,
        publicKey,
        privateKey,
        recipientPublicKey
      );
      
      setIsInitialized(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ukjent feil ved initialisering av sikker kanal');
      setError(error);
      if (onError) {
        onError(error);
      }
    }
  }, [user, conversationId, recipientPublicKey, onError]);
  
  // Oppdater ratchet med en ny nøkkel fra mottaker
  const updateWithRecipientKey = useCallback(async (newPublicKey: JsonWebKey) => {
    if (!conversationId) return;
    
    try {
      await updateRatchetWithNewKey(conversationId, newPublicKey);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Kunne ikke oppdatere med ny mottakernøkkel');
      setError(error);
      if (onError) {
        onError(error);
      }
    }
  }, [conversationId, onError]);
  
  // Hent sikre nøkler for sending av melding
  const getEncryptionKeys = useCallback(async (): Promise<MessageKeys | null> => {
    if (!conversationId || !isInitialized) return null;
    
    try {
      const keys = await rotateSendingKeys(conversationId);
      setMessageCounter(prev => prev + 1);
      return keys;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Kunne ikke hente krypteringsnøkler');
      setError(error);
      if (onError) {
        onError(error);
      }
      return null;
    }
  }, [conversationId, isInitialized, onError]);
  
  // Hent sikre nøkler for mottak av melding
  const getDecryptionKeys = useCallback(async (incomingCounter: number): Promise<MessageKeys | null> => {
    if (!conversationId || !isInitialized) return null;
    
    try {
      return await rotateReceivingKeys(conversationId, incomingCounter);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Kunne ikke hente dekrypteringsnøkler');
      setError(error);
      if (onError) {
        onError(error);
      }
      return null;
    }
  }, [conversationId, isInitialized, onError]);
  
  // Initialiser ved første render
  useEffect(() => {
    if (conversationId && !isInitialized) {
      initializeSecureChannel();
    }
  }, [conversationId, isInitialized, initializeSecureChannel]);
  
  return {
    isInitialized,
    error,
    messageCounter,
    getEncryptionKeys,
    getDecryptionKeys,
    updateWithRecipientKey
  };
}