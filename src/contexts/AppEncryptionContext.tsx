// filepath: /workspaces/snakkaz-chat/src/contexts/AppEncryptionContext.tsx
/**
 * Kontekst for hele applikasjonens kryptering
 * Denne komponenten gir et helhetlig krypteringslag for Snakkaz
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Krypteringsnøkkeltyper
type EncryptionKey = string;
type KeyId = string;

interface EncryptionKeys {
  [keyId: string]: EncryptionKey;
}

// Krypterings- og dekrypteringsfunksjoner
interface EncryptionUtils {
  encrypt: (data: any, keyId?: KeyId) => Promise<{ encryptedData: string; keyId: KeyId }>;
  decrypt: (encryptedData: string, keyId: KeyId) => Promise<any>;
  generateKey: () => Promise<{ key: EncryptionKey; keyId: KeyId }>;
}

interface AppEncryptionContextType {
  isEncryptionEnabled: boolean;
  toggleEncryption: () => void;
  encryptionUtils: EncryptionUtils;
  currentKeyId: KeyId | null;
  setCurrentKeyId: (keyId: KeyId | null) => void;
  isInitialized: boolean;
}

const AppEncryptionContext = createContext<AppEncryptionContextType | undefined>(undefined);

// Funksjoner for kryptering basert på Web Crypto API
const generateEncryptionKey = async (): Promise<CryptoKey> => {
  return window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // kan eksporteres
    ['encrypt', 'decrypt']
  );
};

const exportKey = async (key: CryptoKey): Promise<string> => {
  const exported = await window.crypto.subtle.exportKey('raw', key);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
};

const importKey = async (keyString: string): Promise<CryptoKey> => {
  const keyData = Uint8Array.from(atob(keyString), (c) => c.charCodeAt(0));
  return window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

const encryptData = async (data: any, key: CryptoKey): Promise<string> => {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const dataToEncrypt = encoder.encode(JSON.stringify(data));

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    dataToEncrypt
  );

  // Kombinere IV med kryptert data for lagring
  const encryptedArray = new Uint8Array(encryptedBuffer);
  const result = new Uint8Array(iv.length + encryptedArray.length);
  result.set(iv);
  result.set(encryptedArray, iv.length);

  return btoa(String.fromCharCode(...result));
};

const decryptData = async (encryptedString: string, key: CryptoKey): Promise<any> => {
  try {
    const encryptedData = Uint8Array.from(atob(encryptedString), (c) => c.charCodeAt(0));
    
    // De første 12 bytes er IV
    const iv = encryptedData.slice(0, 12);
    const data = encryptedData.slice(12);
    
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      data
    );

    const decoder = new TextDecoder();
    const decryptedString = decoder.decode(decryptedBuffer);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Dekryptering feilet:', error);
    throw new Error('Kunne ikke dekryptere data. Er nøkkelen riktig?');
  }
};

export const AppEncryptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useLocalStorage('encryption-enabled', false);
  const [encryptionKeys, setEncryptionKeys] = useLocalStorage<EncryptionKeys>('encryption-keys', {});
  const [currentKeyId, setCurrentKeyId] = useState<KeyId | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Ved første oppstart, hvis kryptering er aktivert men ingen nøkkel er satt
    const init = async () => {
      if (isEncryptionEnabled && Object.keys(encryptionKeys).length === 0) {
        const { keyId } = await generateAndStoreKey();
        setCurrentKeyId(keyId);
      } else if (isEncryptionEnabled && Object.keys(encryptionKeys).length > 0 && !currentKeyId) {
        // Bruk den siste nøkkelen som default
        const keyIds = Object.keys(encryptionKeys);
        setCurrentKeyId(keyIds[keyIds.length - 1]);
      }
      setIsInitialized(true);
    };
    
    init();
  }, [isEncryptionEnabled, encryptionKeys]);

  const toggleEncryption = () => {
    if (!isEncryptionEnabled && Object.keys(encryptionKeys).length === 0) {
      // Hvis kryptering nettopp ble aktivert, generer en ny nøkkel
      generateAndStoreKey().then(({ keyId }) => {
        setCurrentKeyId(keyId);
        setIsEncryptionEnabled(true);
      });
    } else {
      setIsEncryptionEnabled(!isEncryptionEnabled);
    }
  };

  const generateAndStoreKey = async (): Promise<{ key: EncryptionKey; keyId: KeyId }> => {
    const cryptoKey = await generateEncryptionKey();
    const key = await exportKey(cryptoKey);
    const keyId = Date.now().toString(); // Bruk timestamp som unik ID
    
    setEncryptionKeys((prevKeys) => ({
      ...prevKeys,
      [keyId]: key,
    }));
    
    return { key, keyId };
  };

  const encryptionUtils: EncryptionUtils = {
    encrypt: async (data: any, keyId?: KeyId) => {
      if (!isEncryptionEnabled) {
        throw new Error('Kryptering er ikke aktivert');
      }
      
      const targetKeyId = keyId || currentKeyId;
      if (!targetKeyId || !encryptionKeys[targetKeyId]) {
        throw new Error('Ingen gyldig krypteringsnøkkel tilgjengelig');
      }
      
      const keyString = encryptionKeys[targetKeyId];
      const key = await importKey(keyString);
      const encryptedData = await encryptData(data, key);
      
      return { encryptedData, keyId: targetKeyId };
    },
    
    decrypt: async (encryptedData: string, keyId: KeyId) => {
      if (!encryptionKeys[keyId]) {
        throw new Error(`Nøkkel med ID ${keyId} ikke funnet`);
      }
      
      const keyString = encryptionKeys[keyId];
      const key = await importKey(keyString);
      return decryptData(encryptedData, key);
    },
    
    generateKey: async () => {
      return generateAndStoreKey();
    }
  };

  const value: AppEncryptionContextType = {
    isEncryptionEnabled,
    toggleEncryption,
    encryptionUtils,
    currentKeyId,
    setCurrentKeyId,
    isInitialized
  };

  return (
    <AppEncryptionContext.Provider value={value}>
      {children}
    </AppEncryptionContext.Provider>
  );
};

export const useAppEncryption = (): AppEncryptionContextType => {
  const context = useContext(AppEncryptionContext);
  if (!context) {
    throw new Error('useAppEncryption må brukes innenfor en AppEncryptionProvider');
  }
  return context;
};