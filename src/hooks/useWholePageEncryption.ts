/**
 * Hook for helside kryptering i SnakkaZ
 * Gjør det enkelt å kryptere hele sider og grupper
 */

import { useState, useCallback } from 'react';
import { encryptWholePage, decryptWholePage, generateGroupPageKey } from '../utils/encryption/whole-page-encryption';

interface UseWholePageEncryptionOptions {
  onError?: (error: Error) => void;
}

export function useWholePageEncryption(options?: UseWholePageEncryptionOptions) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Generere en ny nøkkel for gruppekryptering
  const generateNewGroupKey = useCallback(async () => {
    try {
      setIsProcessing(true);
      setError(null);
      const keyPair = await generateGroupPageKey();
      return keyPair;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ukjent feil ved generering av gruppenøkkel');
      setError(error);
      if (options?.onError) {
        options.onError(error);
      }
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [options]);

  // Kryptere hele sidens data
  const encryptPage = useCallback(async (pageData: any, encryptionKey: string) => {
    try {
      setIsProcessing(true);
      setError(null);
      const encryptedData = await encryptWholePage(pageData, encryptionKey);
      return encryptedData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Feil ved kryptering av siden');
      setError(error);
      if (options?.onError) {
        options.onError(error);
      }
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [options]);

  // Dekryptere hele sidens data
  const decryptPage = useCallback(async (encryptedData: string, encryptionKey: string) => {
    try {
      setIsProcessing(true);
      setError(null);
      const decryptedData = await decryptWholePage(encryptedData, encryptionKey);
      return decryptedData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Feil ved dekryptering av siden');
      setError(error);
      if (options?.onError) {
        options.onError(error);
      }
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [options]);

  return {
    isProcessing,
    error,
    generateNewGroupKey,
    encryptPage,
    decryptPage
  };
}