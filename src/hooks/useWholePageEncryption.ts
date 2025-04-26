import { useState, useCallback } from 'react';
import { 
  encryptWholePage, 
  decryptWholePage,
  WholePageData 
} from '@/utils/encryption/whole-page-encryption';
import { generateEncryptionKey } from '@/utils/encryption/group-keys';

interface UseWholePageEncryptionOptions {
  onError?: (error: Error) => void;
}

/**
 * Hook for å håndtere kryptering av en hel side eller større datastrukturer
 */
export function useWholePageEncryption(options?: UseWholePageEncryptionOptions) {
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Genererer en ny krypteringsnøkkel for en gruppe eller side
   */
  const generateNewGroupKey = useCallback(async () => {
    try {
      const keyPair = await generateEncryptionKey();
      return {
        key: keyPair.keyString,
        keyId: keyPair.keyId
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Kunne ikke generere krypteringsnøkkel');
      setError(error);
      options?.onError?.(error);
      return null;
    }
  }, [options]);
  
  /**
   * Krypterer sidedata med den oppgitte nøkkelen
   */
  const encryptPage = useCallback(async <T,>(pageData: T, keyString: string): Promise<string> => {
    try {
      const encrypted = await encryptWholePage(pageData as unknown as WholePageData, keyString);
      return encrypted;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Kunne ikke kryptere data');
      setError(error);
      options?.onError?.(error);
      throw error;
    }
  }, [options]);
  
  /**
   * Dekrypterer sidedata med den oppgitte nøkkelen
   */
  const decryptPage = useCallback(async <T,>(encryptedData: string, keyString: string): Promise<T> => {
    try {
      const decrypted = await decryptWholePage(encryptedData, keyString);
      return decrypted as unknown as T;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Kunne ikke dekryptere data');
      setError(error);
      options?.onError?.(error);
      throw error;
    }
  }, [options]);
  
  return {
    encryptPage,
    decryptPage,
    generateNewGroupKey,
    error
  };
}