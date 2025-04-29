import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAppEncryption } from '../utils/security/app-encryption';
import { getSignalProtocolEngine } from '../utils/security/signal-protocol';
import { getAnonymityManager } from '../utils/security/anonymity-manager';
import { getRandomBytes } from '../utils/security/crypto-utils';

// App-krypteringstilstand
interface AppEncryptionState {
  isInitialized: boolean;
  isReady: boolean;
  error: string | null;
}

// Kontekst-interface
interface AppEncryptionContextType {
  state: AppEncryptionState;
  initializeEncryption: (userSecret: string) => Promise<boolean>;
  encryptMessage: (message: string, conversationId: string) => Promise<any>;
  decryptMessage: (encryptedMessage: any, conversationId: string) => Promise<string>;
  encryptData: (data: string | ArrayBuffer, context?: string) => Promise<any>;
  decryptData: (encryptedData: any, context?: string) => Promise<string>;
  getAnonymousId: () => string;
  setDisplayName: (name: string) => void;
  getDisplayName: () => string;
  getPrivacySettings: () => any;
  updatePrivacySettings: (settings: any) => void;
  clearAllSecurityData: () => Promise<void>;
}

// Standard kontekstverdi
const defaultContext: AppEncryptionContextType = {
  state: {
    isInitialized: false,
    isReady: false,
    error: null
  },
  initializeEncryption: async () => false,
  encryptMessage: async () => ({}),
  decryptMessage: async () => '',
  encryptData: async () => ({}),
  decryptData: async () => '',
  getAnonymousId: () => '',
  setDisplayName: () => {},
  getDisplayName: () => 'Anonym',
  getPrivacySettings: () => ({}),
  updatePrivacySettings: () => {},
  clearAllSecurityData: async () => {}
};

// Opprett kontekst
export const AppEncryptionContext = createContext<AppEncryptionContextType>(defaultContext);

// Hook for enkel tilgang til konteksten
export const useAppEncryption = () => useContext(AppEncryptionContext);

// Unikt applikasjonssalt - i produksjon bør dette være en miljøvariabel eller konfigurasjonsverdi
const APP_ENCRYPTION_SALT = 'snakkaz-chat-secure-salt-2025-04';

// Provider-komponent
export const AppEncryptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppEncryptionState>({
    isInitialized: false,
    isReady: false,
    error: null
  });
  
  // Singleton-instanser av sikkerhetstjenestene
  const appEncryption = getAppEncryption();
  const signalProtocol = getSignalProtocolEngine();
  const anonymityManager = getAnonymityManager();
  
  // Cache for samtale-initialiseringer
  const conversationInitCache = new Map<string, boolean>();
  
  // Initialiser kryptering med brukerens hemmelighet (f.eks. PIN, passord)
  const initializeEncryption = async (userSecret: string): Promise<boolean> => {
    try {
      // 1. Initialiser app-kryptering
      const appEncryptionInitialized = await appEncryption.initialize(
        userSecret,
        APP_ENCRYPTION_SALT
      );
      
      if (!appEncryptionInitialized) {
        throw new Error('Kunne ikke initialisere app-kryptering');
      }
      
      // 2. Last inn lagrede personverninnstillinger (hvis de finnes)
      const storedSettings = localStorage.getItem('snakkaz-privacy-settings');
      await anonymityManager.initialize(storedSettings);
      
      // Oppdater tilstand
      setState({
        isInitialized: true,
        isReady: true,
        error: null
      });
      
      return true;
    } catch (error: any) {
      console.error('Feil ved initialisering av kryptering:', error);
      
      setState(prev => ({
        ...prev,
        error: error.message || 'Ukjent feil ved initialisering av kryptering'
      }));
      
      return false;
    }
  };
  
  // Krypter en melding med Signal Protocol
  const encryptMessage = async (message: string, conversationId: string): Promise<any> => {
    try {
      // Initialiser for samtalen hvis nødvendig
      await ensureConversationInitialized(conversationId);
      
      // Forbered meldingsinnhold basert på personverninnstillinger
      const { content, metadata } = anonymityManager.prepareOutgoingMessage(message);
      
      // Krypter meldingen med Signal Protocol
      const encryptedMsg = await signalProtocol.encryptMessage(content);
      
      // Kombiner kryptert melding med metadata
      return {
        ...encryptedMsg,
        metadata
      };
    } catch (error: any) {
      console.error('Feil ved kryptering av melding:', error);
      throw new Error('Kunne ikke kryptere melding: ' + (error.message || 'Ukjent feil'));
    }
  };
  
  // Dekrypter en melding med Signal Protocol
  const decryptMessage = async (encryptedMessage: any, conversationId: string): Promise<string> => {
    try {
      // Initialiser for samtalen hvis nødvendig
      await ensureConversationInitialized(conversationId);
      
      // Dekrypter meldingen
      const decrypted = await signalProtocol.decryptMessage(encryptedMessage);
      return decrypted;
    } catch (error: any) {
      console.error('Feil ved dekryptering av melding:', error);
      throw new Error('Kunne ikke dekryptere melding: ' + (error.message || 'Ukjent feil'));
    }
  };
  
  // Krypter generelle data
  const encryptData = async (data: string | ArrayBuffer, context: string = 'default'): Promise<any> => {
    try {
      return await appEncryption.encrypt(data, context);
    } catch (error: any) {
      console.error('Feil ved kryptering av data:', error);
      throw new Error('Kunne ikke kryptere data: ' + (error.message || 'Ukjent feil'));
    }
  };
  
  // Dekrypter generelle data
  const decryptData = async (encryptedData: any, context: string = 'default'): Promise<string> => {
    try {
      const result = await appEncryption.decrypt(encryptedData, context, true) as string;
      return result;
    } catch (error: any) {
      console.error('Feil ved dekryptering av data:', error);
      throw new Error('Kunne ikke dekryptere data: ' + (error.message || 'Ukjent feil'));
    }
  };
  
  // Hjelpermetode for å sikre at en samtale er initialisert for Signal Protocol
  const ensureConversationInitialized = async (conversationId: string): Promise<void> => {
    // Sjekk om samtalen allerede er initialisert i cache
    if (conversationInitCache.has(conversationId)) {
      return;
    }
    
    try {
      // Hent brukerens anonyme ID som identitetsnøkkel
      const identityKey = anonymityManager.getPublicId();
      
      // Initialiser Signal Protocol for denne samtalen
      await signalProtocol.initialize(identityKey, conversationId);
      
      // Legg til i cache
      conversationInitCache.set(conversationId, true);
    } catch (error) {
      console.error('Feil ved initialisering av samtale:', error);
      throw error;
    }
  };
  
  // Hent anonymt ID
  const getAnonymousId = (): string => {
    return anonymityManager.getPublicId();
  };
  
  // Sett visningsnavn
  const setDisplayName = (name: string): void => {
    anonymityManager.setDisplayName(name);
  };
  
  // Hent visningsnavn
  const getDisplayName = (): string => {
    return anonymityManager.getDisplayName();
  };
  
  // Hent personverninnstillinger
  const getPrivacySettings = (): any => {
    return anonymityManager.getPrivacySettings();
  };
  
  // Oppdater personverninnstillinger
  const updatePrivacySettings = (settings: any): void => {
    anonymityManager.updatePrivacySettings(settings);
  };
  
  // Slett alle sikkerhetsdata
  const clearAllSecurityData = async (): Promise<void> => {
    try {
      // Tøm samtale-cache
      conversationInitCache.clear();
      
      // Nullstill personvern og anonymitet
      await anonymityManager.clearAllData();
      
      // Oppdater tilstand
      setState({
        isInitialized: false,
        isReady: false,
        error: null
      });
    } catch (error: any) {
      console.error('Feil ved sletting av sikkerhetsdata:', error);
      throw new Error('Kunne ikke slette sikkerhetsdata: ' + (error.message || 'Ukjent feil'));
    }
  };
  
  // Kontekstverdi
  const contextValue: AppEncryptionContextType = {
    state,
    initializeEncryption,
    encryptMessage,
    decryptMessage,
    encryptData,
    decryptData,
    getAnonymousId,
    setDisplayName,
    getDisplayName,
    getPrivacySettings,
    updatePrivacySettings,
    clearAllSecurityData
  };
  
  return (
    <AppEncryptionContext.Provider value={contextValue}>
      {children}
    </AppEncryptionContext.Provider>
  );
};

export default AppEncryptionContext;