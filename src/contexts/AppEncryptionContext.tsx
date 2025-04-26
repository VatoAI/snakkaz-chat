/**
 * AppEncryptionContext
 * 
 * Dette er en context som håndterer kryptering på app-nivå for hele Snakkaz.
 * Den tilbyr end-to-end kryptering av all data som sendes og mottas i appen.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import {
  encryptWholePage,
  decryptWholePage,
  generateGroupPageKey,
  importEncryptionKey
} from '@/utils/encryption';

// Type for kryptert app-data
interface EncryptedAppData {
  encryptedContent: string;
  iv: string;
}

// Type for app-krypteringskontekst
interface AppEncryptionContextType {
  // Tilstander
  isEncryptionEnabled: boolean;
  encryptionStatus: 'idle' | 'encrypting' | 'decrypting' | 'error';
  encryptionKey: string | null;
  isEncryptionReady: boolean;
  
  // Metoder
  enableAppEncryption: () => Promise<boolean>;
  disableAppEncryption: () => Promise<boolean>;
  encryptData: <T>(data: T) => Promise<string | null>;
  decryptData: <T>(encryptedData: string) => Promise<T | null>;
  generateNewAppKey: () => Promise<{key: string, keyId: string} | null>;
}

// Oppretter konteksten
const AppEncryptionContext = createContext<AppEncryptionContextType | undefined>(undefined);

// Provider-komponent
export const AppEncryptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(false);
  const [encryptionStatus, setEncryptionStatus] = useState<'idle' | 'encrypting' | 'decrypting' | 'error'>('idle');
  const [isEncryptionReady, setIsEncryptionReady] = useState(false);

  // Hent brukerens krypteringsnøkkel fra databasen ved innlasting
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchUserEncryptionKey = async () => {
      try {
        const { data, error } = await supabase
          .from('user_encryption')
          .select('encryption_key')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error('Feil ved henting av krypteringsnøkkel:', error);
          return;
        }
        
        if (data?.encryption_key) {
          setEncryptionKey(data.encryption_key);
          setIsEncryptionEnabled(true);
        }
        
        setIsEncryptionReady(true);
      } catch (err) {
        console.error('Uventet feil ved henting av krypteringsnøkkel:', err);
        setEncryptionStatus('error');
      }
    };
    
    fetchUserEncryptionKey();
  }, [user?.id]);
  
  // Generer en ny krypteringsnøkkel
  const generateNewAppKey = useCallback(async () => {
    try {
      const keyPair = await generateGroupPageKey();
      return keyPair;
    } catch (err) {
      console.error('Kunne ikke generere app-krypteringsnøkkel:', err);
      setEncryptionStatus('error');
      return null;
    }
  }, []);
  
  // Aktiver app-kryptering
  const enableAppEncryption = useCallback(async () => {
    if (!user?.id) return false;
    
    try {
      setEncryptionStatus('encrypting');
      
      // Generer ny krypteringsnøkkel
      const keyPair = await generateNewAppKey();
      
      if (!keyPair) {
        throw new Error('Kunne ikke generere krypteringsnøkkel');
      }
      
      // Lagre nøkkelen i databasen
      const { error: saveError } = await supabase
        .from('user_encryption')
        .upsert({
          user_id: user.id,
          encryption_key: keyPair.key,
          created_at: new Date().toISOString()
        });
        
      if (saveError) {
        throw new Error('Kunne ikke lagre krypteringsnøkkel');
      }
      
      // Oppdater lokal status
      setEncryptionKey(keyPair.key);
      setIsEncryptionEnabled(true);
      
      toast({
        title: 'App-kryptering aktivert',
        description: 'End-to-end kryptering er nå aktivert for hele Snakkaz-appen'
      });
      
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Ukjent feil ved aktivering av kryptering';
      toast({
        title: 'Krypteringsfeil',
        description: errorMsg,
        variant: 'destructive'
      });
      setEncryptionStatus('error');
      return false;
    } finally {
      setEncryptionStatus('idle');
    }
  }, [user?.id, generateNewAppKey, toast]);
  
  // Deaktiver app-kryptering
  const disableAppEncryption = useCallback(async () => {
    if (!user?.id) return false;
    
    try {
      // Fjern krypteringsnøkkelen fra databasen
      const { error } = await supabase
        .from('user_encryption')
        .delete()
        .eq('user_id', user.id);
        
      if (error) {
        throw new Error('Kunne ikke fjerne krypteringsnøkkel');
      }
      
      // Oppdater lokal status
      setEncryptionKey(null);
      setIsEncryptionEnabled(false);
      
      toast({
        title: 'App-kryptering deaktivert',
        description: 'End-to-end kryptering er nå deaktivert for Snakkaz-appen'
      });
      
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Ukjent feil ved deaktivering av kryptering';
      toast({
        title: 'Krypteringsfeil',
        description: errorMsg,
        variant: 'destructive'
      });
      return false;
    }
  }, [user?.id, toast]);
  
  // Krypter vilkårlige data
  const encryptData = useCallback(async <T,>(data: T): Promise<string | null> => {
    try {
      if (!encryptionKey || !isEncryptionEnabled) {
        throw new Error('Kryptering er ikke aktivert');
      }
      
      setEncryptionStatus('encrypting');
      
      // Krypter dataen med importert krypteringsnøkkel
      const encryptedData = await encryptWholePage(data, encryptionKey);
      
      return encryptedData;
    } catch (err) {
      console.error('Feil ved kryptering:', err);
      setEncryptionStatus('error');
      return null;
    } finally {
      setEncryptionStatus('idle');
    }
  }, [encryptionKey, isEncryptionEnabled]);
  
  // Dekrypterer data
  const decryptData = useCallback(async <T,>(encryptedData: string): Promise<T | null> => {
    try {
      if (!encryptionKey || !isEncryptionEnabled) {
        throw new Error('Kryptering er ikke aktivert');
      }
      
      setEncryptionStatus('decrypting');
      
      // Dekrypter dataen med krypteringsnøkkelen
      const decryptedData = await decryptWholePage(encryptedData, encryptionKey);
      
      return decryptedData as T;
    } catch (err) {
      console.error('Feil ved dekryptering:', err);
      setEncryptionStatus('error');
      return null;
    } finally {
      setEncryptionStatus('idle');
    }
  }, [encryptionKey, isEncryptionEnabled]);
  
  const value: AppEncryptionContextType = {
    isEncryptionEnabled,
    encryptionStatus,
    encryptionKey,
    isEncryptionReady,
    enableAppEncryption,
    disableAppEncryption,
    encryptData,
    decryptData,
    generateNewAppKey
  };
  
  return (
    <AppEncryptionContext.Provider value={value}>
      {children}
    </AppEncryptionContext.Provider>
  );
};

// Hook for å bruke app-kryptering
export const useAppEncryption = (): AppEncryptionContextType => {
  const context = useContext(AppEncryptionContext);
  
  if (context === undefined) {
    throw new Error('useAppEncryption må brukes innenfor en AppEncryptionProvider');
  }
  
  return context;
};