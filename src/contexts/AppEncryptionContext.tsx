import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAppEncryption } from '../utils/security/app-encryption';
import { getSignalProtocolEngine } from '../utils/security/signal-protocol';
import { getAnonymityManager } from '../utils/security/anonymity-manager';
import { getRandomBytes } from '../utils/security/crypto-utils';
import { supabase } from '../integrations/supabase/client';

// App-krypteringstilstand
interface AppEncryptionState {
  isInitialized: boolean;
  isReady: boolean;
  error: string | null;
}

// Kontekst-interface
interface AppEncryptionContextType {
  state: AppEncryptionState;
  enabled: boolean; // Added missing property
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
  setMessageExpiration: (messageId: string, ttlSeconds: number) => Promise<void>;
  secureDeleteMessage: (messageId: string) => Promise<boolean>;
  rotateKeysForConversation: (conversationId: string) => Promise<boolean>;
  secureMemoryHandling: {
    clearSensitiveData: (data: Uint8Array | null) => void;
    lockMemory: () => Promise<boolean>;
  };
  verifyIdentity: (userId: string, publicKey: string) => Promise<boolean>;
  screenCaptureProtection: {
    enable: () => void;
    disable: () => void;
    isEnabled: () => boolean;
  };
}

// Standard kontekstverdi
const defaultContext: AppEncryptionContextType = {
  state: {
    isInitialized: false,
    isReady: false,
    error: null
  },
  enabled: false,
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
  clearAllSecurityData: async () => {},
  setMessageExpiration: async () => {},
  secureDeleteMessage: async () => false,
  rotateKeysForConversation: async () => false,
  secureMemoryHandling: {
    clearSensitiveData: () => {},
    lockMemory: async () => false
  },
  verifyIdentity: async () => false,
  screenCaptureProtection: {
    enable: () => {},
    disable: () => {},
    isEnabled: () => false
  }
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
  
  // Tilstand for skjermkopibeskyttelse
  const [screenCaptureProtectionEnabled, setScreenCaptureProtectionEnabled] = useState<boolean>(false);
  
  // Singleton-instanser av sikkerhetstjenestene
  const appEncryption = getAppEncryption();
  const signalProtocol = getSignalProtocolEngine();
  const anonymityManager = getAnonymityManager();
  
  // Cache for samtale-initialiseringer
  const conversationInitCache = new Map<string, boolean>();
  
  // Cache for brukerverifisering
  const verifiedUsers = new Map<string, boolean>();
  
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
      
      // 3. Aktiver beskyttelse mot minnelekasjer (Wickr-inspirert)
      await secureMemoryHandling.lockMemory();
      
      // 4. Last utløpte meldinger for sletting (Wickr-inspirert ephemerality)
      await loadExpiredMessagesForDeletion();
      
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
      
      // Wickr-inspirert: Rotér nøkler for hver melding (Perfect Forward Secrecy)
      await rotateKeysForConversation(conversationId);
      
      // Krypter meldingen med Signal Protocol
      const encryptedMsg = await signalProtocol.encryptMessage(content);
      
      // Legg til ephemeral metadata (Wickr-inspirert)
      const ephemeralMetadata = {
        ...metadata,
        // Tidsstempel for når meldingen ble kryptert
        encryptedAt: Date.now(),
        // Bruk av nøkkelversjon for sporing av nøkkelrotasjon
        keyVersion: await signalProtocol.getCurrentKeyVersion(conversationId)
      };
      
      // Kombiner kryptert melding med metadata
      return {
        ...encryptedMsg,
        metadata: ephemeralMetadata
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
      
      // Hvis meldingen er markert som sensitiv, hindre skjermdumping
      if (encryptedMessage.metadata?.sensitive) {
        screenCaptureProtection.enable();
      }
      
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
  
  // Wickr-inspirert: Last utløpte meldinger for sletting (gir ephemerality på tvers av sesjoner)
  const loadExpiredMessagesForDeletion = async (): Promise<void> => {
    try {
      // Hent meldinger som har utløpt
      const now = new Date().toISOString();
      const { data: expiredMessages, error } = await supabase
        .from('message_expiration')
        .select('message_id')
        .lt('expire_at', now);
      
      if (error) {
        console.error('Feil ved henting av utløpte meldinger:', error);
        return;
      }
      
      // Slett utløpte meldinger
      if (expiredMessages && expiredMessages.length > 0) {
        console.log(`Fant ${expiredMessages.length} utløpte meldinger for sikker sletting`);
        for (const msg of expiredMessages) {
          await secureDeleteMessage(msg.message_id);
        }
      }
    } catch (error) {
      console.error('Feil ved behandling av utløpte meldinger:', error);
    }
  };
  
  // Wickr-inspirert: Sett utløpstid for meldinger (ephemerality)
  const setMessageExpiration = async (messageId: string, ttlSeconds: number): Promise<void> => {
    if (!ttlSeconds || ttlSeconds <= 0) return;
    
    console.log(`Setting message expiration for ${messageId}: ${ttlSeconds} seconds`);
    
    // Planlegg sikker sletting av meldingen
    setTimeout(async () => {
      await secureDeleteMessage(messageId);
    }, ttlSeconds * 1000);
    
    // Lagre utløpsinformasjon i databasen for persistens mellom sesjoner
    try {
      const { error } = await supabase
        .from('message_expiration')
        .upsert([
          { 
            message_id: messageId, 
            expire_at: new Date(Date.now() + ttlSeconds * 1000).toISOString() 
          }
        ]);
      
      if (error) {
        console.error('Feil ved lagring av utløpsinformasjon:', error);
      }
    } catch (error) {
      console.error('Feil ved lagring av utløpsinformasjon:', error);
    }
  };
  
  // Wickr-inspirert: Sikker sletting av meldinger med anti-forensiske tiltak
  const secureDeleteMessage = async (messageId: string): Promise<boolean> => {
    try {
      console.log(`Securely deleting message ${messageId}`);
      
      // 1. Hent meldingen som skal slettes
      const { data: message, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('id', messageId)
        .single();
      
      if (fetchError || !message) {
        console.error('Feil ved henting av melding for sikker sletting:', fetchError);
        return false;
      }
      
      // 2. Overskriv databaseinnhold med tilfeldig data (anti-forensisk tiltak)
      // Gjør flere overskrivinger for å hindre datagjennoppretting (Wickr-inspirert)
      for (let i = 0; i < 3; i++) {
        // Generer kryptografisk sterke tilfeldige data
        const randomBytes = await getRandomBytes(512);
        const randomContent = Array.from(new Uint8Array(randomBytes))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        
        // Overskriv meldingsinnhold med tilfeldig data
        const { error: overwriteError } = await supabase
          .from('messages')
          .update({
            encrypted_content: randomContent,
            encryption_key: randomContent.substring(0, 32),
            iv: randomContent.substring(32, 48),
            is_deleted: true
          })
          .eq('id', messageId);
        
        if (overwriteError) {
          console.error(`Feil ved overskriving #${i+1}:`, overwriteError);
        }
        
        // Kort ventetid mellom overskrivinger for å sikre at de blir lagret
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // 3. Slett meldingen fra databasen
      const { error: deleteError } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);
      
      if (deleteError) {
        console.error('Feil ved endelig sletting av melding:', deleteError);
        return false;
      }
      
      // 4. Slett tilhørende mediafiler hvis de finnes
      if (message.media_url) {
        const { error: storageError } = await supabase.storage
          .from('chat-media')
          .remove([message.media_url]);
        
        if (storageError) {
          console.error('Feil ved sletting av mediafil:', storageError);
        }
      }
      
      // 5. Fjern fra message_expiration-tabellen
      await supabase
        .from('message_expiration')
        .delete()
        .eq('message_id', messageId);
      
      console.log(`Message ${messageId} securely deleted`);
      return true;
    } catch (error) {
      console.error('Feil ved sikker sletting av melding:', error);
      return false;
    }
  };
  
  // Wickr-inspirert: Roterer nøkler for en bestemt samtale (Enhanced Perfect Forward Secrecy)
  const rotateKeysForConversation = async (conversationId: string): Promise<boolean> => {
    try {
      return await signalProtocol.rotateKeys(anonymityManager.getPublicId(), conversationId);
    } catch (error) {
      console.error('Feil ved rotering av nøkler:', error);
      return false;
    }
  };
  
  // Wickr-inspirert: Verifiser brukerens identitet
  const verifyIdentity = async (userId: string, publicKey: string): Promise<boolean> => {
    try {
      // Sjekk om brukeren allerede er verifisert
      if (verifiedUsers.has(userId)) {
        return verifiedUsers.get(userId) || false;
      }
      
      // Hent brukerens lagrede nøkkel
      const { data, error } = await supabase
        .from('user_keys')
        .select('public_key')
        .eq('user_id', userId)
        .single();
      
      if (error || !data) {
        console.error('Kunne ikke hente brukerens nøkkel:', error);
        return false;
      }
      
      // Sammenlign nøklene
      const isVerified = data.public_key === publicKey;
      
      // Lagre resultatet i cache
      verifiedUsers.set(userId, isVerified);
      
      return isVerified;
    } catch (error) {
      console.error('Feil ved verifisering av bruker:', error);
      return false;
    }
  };
  
  // Wickr-inspirert: Sikker håndtering av minne
  const secureMemoryHandling = {
    // Overskriv sensitiv data i minnet når den ikke lenger er nødvendig
    clearSensitiveData: (data: Uint8Array | null): void => {
      if (data) {
        // Overskriv med tilfeldige data
        crypto.getRandomValues(data);
        // Deretter nullstill
        data.fill(0);
      }
    },
    
    // Forsøk å låse minnet (plattformspesifikk)
    lockMemory: async (): Promise<boolean> => {
      try {
        // Dette er en simulering - faktisk implementasjon krever plattformspesifikk kode
        // For web-apper er dette begrenset av nettleseren
        console.log('Attempting to lock memory against swapping');
        
        // I en faktisk implementasjon ville vi brukt native kode eller WASM
        // for å prøve å låse minnet mot swapping
        
        return true;
      } catch (error) {
        console.warn('Memory locking not supported in this environment');
        return false;
      }
    }
  };
  
  // Wickr-inspirert: Beskyttelse mot skjermdumping
  const screenCaptureProtection = {
    enable: (): void => {
      setScreenCaptureProtectionEnabled(true);
      // I en faktisk implementasjon ville vi brukt flere teknikker:
      // 1. CSS-basert beskyttelse (f.eks. pointer-events: none på sensitive elementer)
      // 2. Dynamisk sløring av data når ikke fokusert
      // 3. Native API-er når tilgjengelige
      
      // Merk at dette har begrensninger i nettlesere
      console.log('Screen capture protection enabled');
    },
    
    disable: (): void => {
      setScreenCaptureProtectionEnabled(false);
      console.log('Screen capture protection disabled');
    },
    
    isEnabled: (): boolean => {
      return screenCaptureProtectionEnabled;
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
      
      // Tøm verifiserte brukere
      verifiedUsers.clear();
      
      // Oppdater tilstand
      setState({
        isInitialized: false,
        isReady: false,
        error: null
      });
      
      // Sikker sletting av minne
      const sensitiveData = new Uint8Array(32);
      secureMemoryHandling.clearSensitiveData(sensitiveData);
    } catch (error: any) {
      console.error('Feil ved sletting av sikkerhetsdata:', error);
      throw new Error('Kunne ikke slette sikkerhetsdata: ' + (error.message || 'Ukjent feil'));
    }
  };
  
  // Kontekstverdi med alle nye funksjoner
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
    clearAllSecurityData,
    setMessageExpiration,
    secureDeleteMessage,
    rotateKeysForConversation,
    secureMemoryHandling,
    verifyIdentity,
    screenCaptureProtection,
    enabled: true
  };
  
  return (
    <AppEncryptionContext.Provider value={contextValue}>
      {children}
    </AppEncryptionContext.Provider>
  );
};

export default AppEncryptionContext;