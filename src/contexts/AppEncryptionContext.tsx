// filepath: /workspaces/snakkaz-chat/src/contexts/AppEncryptionContext.tsx
/**
 * Kontekst for hele applikasjonens kryptering
 * Denne komponenten gir et helhetlig krypteringslag for Snakkaz
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWholePageEncryption } from '@/hooks/useWholePageEncryption';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Typer for konteksten
interface AppEncryptionContextType {
  // Status
  isEncryptionEnabled: boolean;
  isEncryptionReady: boolean;
  encryptionStatus: 'idle' | 'encrypting' | 'decrypting' | 'initializing' | 'error';
  
  // Metoder
  enableGlobalEncryption: () => Promise<boolean>;
  disableGlobalEncryption: () => Promise<boolean>;
  encryptData: <T>(data: T) => Promise<string | null>;
  decryptData: <T>(encryptedData: string) => Promise<T | null>;
  
  // Egenskaper
  error: Error | null;
}

// Opprett konteksten
const AppEncryptionContext = createContext<AppEncryptionContextType | null>(null);

// Provider-komponent
export const AppEncryptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { user, session } = useAuth();
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(false);
  const [isEncryptionReady, setIsEncryptionReady] = useState(false);
  const [encryptionStatus, setEncryptionStatus] = useState<'idle' | 'encrypting' | 'decrypting' | 'initializing' | 'error'>('idle');
  const [masterKey, setMasterKey] = useState<string | null>(null);
  
  // Bruk den eksisterende whole page encryption hook
  const { 
    encryptPage, 
    decryptPage, 
    generateNewGroupKey,
    error: encryptionError 
  } = useWholePageEncryption({
    onError: (err) => {
      toast({
        title: 'Krypteringsfeil',
        description: err.message || 'Det oppstod en feil med global kryptering',
        variant: 'destructive'
      });
      setEncryptionStatus('error');
    }
  });
  
  // Hent eller generer en masterkey basert på brukerens identitet
  const initializeMasterKey = useCallback(async () => {
    if (!user?.id) return null;
    
    try {
      setEncryptionStatus('initializing');
      
      // Sjekk om bruker allerede har en masterkey i databasen
      const { data, error } = await supabase
        .from('user_encryption_keys')
        .select('key_data')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw new Error(`Feil ved henting av krypteringsnøkkel: ${error.message}`);
      }
      
      let key: string;
      
      if (!data) {
        // Generer en ny nøkkel hvis bruker ikke har en
        const newKeyPair = await generateNewGroupKey();
        if (!newKeyPair) {
          throw new Error('Kunne ikke generere ny krypteringsnøkkel');
        }
        
        // Lagre den nye nøkkelen i databasen
        const { error: insertError } = await supabase
          .from('user_encryption_keys')
          .insert({
            user_id: user.id,
            key_data: newKeyPair.key,
            key_id: newKeyPair.keyId
          });
        
        if (insertError) {
          throw new Error(`Feil ved lagring av krypteringsnøkkel: ${insertError.message}`);
        }
        
        key = newKeyPair.key;
      } else {
        key = data.key_data;
      }
      
      setMasterKey(key);
      setIsEncryptionReady(true);
      setEncryptionStatus('idle');
      
      return key;
    } catch (err) {
      console.error('Error initializing master key:', err);
      toast({
        title: 'Krypteringsfeil',
        description: err instanceof Error ? err.message : 'Kunne ikke initialisere krypteringsnøkkel',
        variant: 'destructive'
      });
      setEncryptionStatus('error');
      return null;
    }
  }, [user, generateNewGroupKey, toast]);
  
  // Initialiserer kryptering når brukeren logger inn
  useEffect(() => {
    if (user && !masterKey) {
      initializeMasterKey();
    } else if (!user) {
      setMasterKey(null);
      setIsEncryptionEnabled(false);
      setIsEncryptionReady(false);
    }
  }, [user, masterKey, initializeMasterKey]);
  
  // Slå på global kryptering
  const enableGlobalEncryption = async (): Promise<boolean> => {
    try {
      if (!masterKey) {
        const key = await initializeMasterKey();
        if (!key) return false;
      }
      
      setIsEncryptionEnabled(true);
      
      toast({
        title: 'Kryptering aktivert',
        description: 'Global kryptering er nå aktivert for alle dine data',
      });
      
      // Lagre brukerens preferanse for kryptering
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          encryption_enabled: true,
          updated_at: new Date().toISOString()
        });
      
      return true;
    } catch (err) {
      console.error('Error enabling encryption:', err);
      toast({
        title: 'Aktivering feilet',
        description: 'Kunne ikke aktivere global kryptering',
        variant: 'destructive'
      });
      return false;
    }
  };
  
  // Slå av global kryptering
  const disableGlobalEncryption = async (): Promise<boolean> => {
    try {
      setIsEncryptionEnabled(false);
      
      toast({
        title: 'Kryptering deaktivert',
        description: 'Global kryptering er nå deaktivert',
      });
      
      // Lagre brukerens preferanse for kryptering
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          encryption_enabled: false,
          updated_at: new Date().toISOString()
        });
      
      return true;
    } catch (err) {
      console.error('Error disabling encryption:', err);
      toast({
        title: 'Deaktivering feilet',
        description: 'Kunne ikke deaktivere global kryptering',
        variant: 'destructive'
      });
      return false;
    }
  };
  
  // Krypter vilkårlig data
  const encryptData = async <T,>(data: T): Promise<string | null> => {
    if (!isEncryptionEnabled || !masterKey) {
      return JSON.stringify(data); // Ikke kryptert hvis kryptering er av
    }
    
    setEncryptionStatus('encrypting');
    try {
      const encrypted = await encryptPage(data, masterKey);
      setEncryptionStatus('idle');
      return encrypted;
    } catch (err) {
      setEncryptionStatus('error');
      console.error('Error encrypting data:', err);
      return null;
    }
  };
  
  // Dekrypter data
  const decryptData = async <T,>(encryptedData: string): Promise<T | null> => {
    // Sjekk om strengen faktisk er kryptert eller bare vanlig JSON
    try {
      const parsed = JSON.parse(encryptedData);
      // Hvis dette er et objekt med encryptedContent og iv, antar vi at det er kryptert
      if (!parsed.encryptedContent || !parsed.iv) {
        return parsed as T; // Data er ikke kryptert, returner som den er
      }
    } catch (e) {
      // Hvis vi ikke kan parse JSON, er det muligens ugyldig data
      console.error('Error parsing JSON in decryptData:', e);
      return null;
    }
    
    if (!masterKey) {
      toast({
        title: 'Krypteringsfeil',
        description: 'Krypteringsnøkkel mangler, kan ikke dekryptere data',
        variant: 'destructive'
      });
      return null;
    }
    
    setEncryptionStatus('decrypting');
    try {
      const decrypted = await decryptPage(encryptedData, masterKey);
      setEncryptionStatus('idle');
      return decrypted as T;
    } catch (err) {
      setEncryptionStatus('error');
      console.error('Error decrypting data:', err);
      return null;
    }
  };
  
  // Kontekstverdi som eksponeres til komponenter
  const contextValue: AppEncryptionContextType = {
    isEncryptionEnabled,
    isEncryptionReady,
    encryptionStatus,
    enableGlobalEncryption,
    disableGlobalEncryption,
    encryptData,
    decryptData,
    error: encryptionError
  };
  
  return (
    <AppEncryptionContext.Provider value={contextValue}>
      {children}
    </AppEncryptionContext.Provider>
  );
};

// Hook for enkel tilgang til krypteringskonteksten
export const useAppEncryption = (): AppEncryptionContextType => {
  const context = useContext(AppEncryptionContext);
  if (!context) {
    throw new Error('useAppEncryption må brukes innenfor en AppEncryptionProvider');
  }
  return context;
};