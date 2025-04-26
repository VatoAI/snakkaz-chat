import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { encryptWholePage, decryptWholePage, generateGroupPageKey } from '../utils/encryption';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from '../hooks/useAuth';

// Definerer hvilke funksjoner og verdier som skal være tilgjengelige gjennom konteksten
interface AppEncryptionContextType {
  // Kryptering og dekryptering av data
  encryptData: <T>(data: T) => Promise<string>;
  decryptData: <T>(encryptedData: string) => Promise<T>;
  
  // Håndtering av krypteringsnøkler
  generateEncryptionKey: () => Promise<{ keyId: string }>;
  setEncryptionKey: (keyId: string, key: string) => void;
  getEncryptionKey: (keyId: string) => string | null;
  
  // Tilstand
  isEncryptionEnabled: boolean;
  setEncryptionEnabled: (enabled: boolean) => void;
  isEncryptionReady: boolean;
  
  // Lagring av krypteringspreferanser
  encryptionPreferences: {
    encryptWholeApp: boolean;
    encryptMessages: boolean;
    encryptAttachments: boolean;
    encryptProfiles: boolean;
  };
  updateEncryptionPreferences: (prefs: Partial<AppEncryptionContextType['encryptionPreferences']>) => void;
}

// Opprett konteksten med standard verdier
const AppEncryptionContext = createContext<AppEncryptionContextType>({
  encryptData: async () => '',
  decryptData: async () => ({} as any),
  generateEncryptionKey: async () => ({ keyId: '' }),
  setEncryptionKey: () => {},
  getEncryptionKey: () => null,
  isEncryptionEnabled: false,
  setEncryptionEnabled: () => {},
  isEncryptionReady: false,
  encryptionPreferences: {
    encryptWholeApp: false,
    encryptMessages: true,
    encryptAttachments: true,
    encryptProfiles: false,
  },
  updateEncryptionPreferences: () => {},
});

// Provider som håndterer krypteringslogikk
export const AppEncryptionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isEncryptionEnabled, setEncryptionEnabled] = useLocalStorage('snakkaz-encryption-enabled', false);
  const [isEncryptionReady, setEncryptionReady] = useState(false);
  const [encryptionKeys, setEncryptionKeys] = useLocalStorage<Record<string, string>>('snakkaz-encryption-keys', {});
  const [encryptionPreferences, setEncryptionPreferences] = useLocalStorage('snakkaz-encryption-preferences', {
    encryptWholeApp: false,
    encryptMessages: true,
    encryptAttachments: true,
    encryptProfiles: false,
  });

  // Sjekk om kryptering er klar når brukeren logger inn
  useEffect(() => {
    // Hvis brukeren er logget inn og kryptering er aktivert, må vi sjekke om nøklene er på plass
    if (user && isEncryptionEnabled) {
      // Sjekk om vi har minst én krypteringsnøkkel
      const hasEncryptionKeys = Object.keys(encryptionKeys).length > 0;
      setEncryptionReady(hasEncryptionKeys);
      
      // Hvis vi ikke har nøkler, må vi generere en ny
      if (!hasEncryptionKeys) {
        generateEncryptionKey().then(() => {
          setEncryptionReady(true);
        });
      }
    } else {
      setEncryptionReady(false);
    }
  }, [user, isEncryptionEnabled, encryptionKeys]);

  // Funksjon for å kryptere data
  const encryptData = async <T,>(data: T): Promise<string> => {
    if (!isEncryptionEnabled || !isEncryptionReady) {
      // Hvis kryptering ikke er aktivert, returnerer vi data som JSON-string
      return JSON.stringify(data);
    }
    
    // Bruk standard nøkkel (første nøkkel i objektet)
    const keyId = Object.keys(encryptionKeys)[0];
    const keyString = encryptionKeys[keyId];
    
    if (!keyString) {
      throw new Error('Ingen krypteringsnøkkel tilgjengelig');
    }
    
    // Krypter data med valgt nøkkel
    return encryptWholePage(data, keyString);
  };

  // Funksjon for å dekryptere data
  const decryptData = async <T,>(encryptedData: string): Promise<T> => {
    if (!isEncryptionEnabled || !isEncryptionReady) {
      // Hvis kryptering ikke er aktivert, parser vi JSON-string direkte
      return JSON.parse(encryptedData) as T;
    }
    
    try {
      // Prøv å parse først for å se om dataen faktisk er kryptert
      const parsed = JSON.parse(encryptedData);
      
      // Hvis det ikke har de forventede feltene for kryptert data, antar vi at det ikke er kryptert
      if (!parsed.encryptedContent || !parsed.iv) {
        return parsed as T;
      }
      
      // Bruk standard nøkkel
      const keyId = Object.keys(encryptionKeys)[0];
      const keyString = encryptionKeys[keyId];
      
      if (!keyString) {
        throw new Error('Ingen krypteringsnøkkel tilgjengelig for dekryptering');
      }
      
      // Dekrypter data med valgt nøkkel
      return await decryptWholePage<T>(encryptedData, keyString);
    } catch (error) {
      console.error('Feil ved dekryptering av data:', error);
      // Hvis vi ikke kan dekryptere, prøver vi å returnere den originale dataen som den er
      try {
        return JSON.parse(encryptedData) as T;
      } catch {
        throw new Error('Kunne ikke dekryptere data');
      }
    }
  };

  // Funksjon for å generere en ny krypteringsnøkkel
  const generateEncryptionKey = async (): Promise<{ keyId: string }> => {
    const result = await generateGroupPageKey();
    
    if (!result) {
      throw new Error('Kunne ikke generere krypteringsnøkkel');
    }
    
    const { key, keyId } = result;
    setEncryptionKeys(prevKeys => ({ ...prevKeys, [keyId]: key }));
    
    return { keyId };
  };

  // Funksjon for å sette en krypteringsnøkkel
  const setEncryptionKey = (keyId: string, key: string) => {
    setEncryptionKeys(prevKeys => ({ ...prevKeys, [keyId]: key }));
  };

  // Funksjon for å hente en krypteringsnøkkel
  const getEncryptionKey = (keyId: string) => {
    return encryptionKeys[keyId] || null;
  };

  // Funksjon for å oppdatere krypteringspreferanser
  const updateEncryptionPreferences = (prefs: Partial<AppEncryptionContextType['encryptionPreferences']>) => {
    setEncryptionPreferences(prev => ({ ...prev, ...prefs }));
  };

  // Provider-verdi
  const value: AppEncryptionContextType = {
    encryptData,
    decryptData,
    generateEncryptionKey,
    setEncryptionKey,
    getEncryptionKey,
    isEncryptionEnabled,
    setEncryptionEnabled,
    isEncryptionReady,
    encryptionPreferences,
    updateEncryptionPreferences,
  };

  return (
    <AppEncryptionContext.Provider value={value}>
      {children}
    </AppEncryptionContext.Provider>
  );
};

// Hook for å bruke AppEncryptionContext
export const useAppEncryption = () => {
  const context = useContext(AppEncryptionContext);
  
  if (context === undefined) {
    throw new Error('useAppEncryption må brukes innenfor en AppEncryptionProvider');
  }
  
  return context;
};