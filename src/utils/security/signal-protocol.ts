/**
 * Signal Protocol Engine
 * 
 * Implementerer SignalProtocol for ende-til-ende-kryptert meldingsutveksling.
 * Basert på Signal-protokollen for høy sikkerhet med Perfect Forward Secrecy.
 * 
 * Merk: Denne implementasjonen bruker libsignal API (via @privacyresearch/libsignal-protocol-typescript)
 */

import {
  KeyHelper,
  SignalProtocolAddress,
  SessionBuilder,
  SessionCipher,
  PreKeyBundle,
  ProtocolStore
} from '@privacyresearch/libsignal-protocol-typescript';
import { getRandomBytes } from './crypto-utils';

// Intern minnebasert lagring av nøkler
class InMemorySignalProtocolStore implements ProtocolStore {
  private identityKeys: Map<string, any> = new Map();
  private preKeys: Map<string, any> = new Map();
  private signedPreKeys: Map<string, any> = new Map();
  private sessions: Map<string, any> = new Map();
  private identityKeyPair: any = null;
  private registrationId: number = 0;

  // Identity Key
  getIdentityKeyPair(): Promise<any> {
    return Promise.resolve(this.identityKeyPair);
  }

  setIdentityKeyPair(keyPair: any): Promise<void> {
    this.identityKeyPair = keyPair;
    return Promise.resolve();
  }

  // Registration ID
  getLocalRegistrationId(): Promise<number> {
    return Promise.resolve(this.registrationId);
  }

  setLocalRegistrationId(id: number): Promise<void> {
    this.registrationId = id;
    return Promise.resolve();
  }

  // Signed PreKey
  loadSignedPreKey(keyId: number): Promise<any> {
    const key = this.signedPreKeys.get(keyId);
    if (key) {
      return Promise.resolve(key);
    } else {
      return Promise.reject(new Error(`Signed prekey ${keyId} not found`));
    }
  }

  storeSignedPreKey(keyId: number, key: any): Promise<void> {
    this.signedPreKeys.set(keyId, key);
    return Promise.resolve();
  }

  removeSignedPreKey(keyId: number): Promise<void> {
    this.signedPreKeys.delete(keyId);
    return Promise.resolve();
  }

  // PreKey
  loadPreKey(keyId: number): Promise<any> {
    const key = this.preKeys.get(keyId);
    if (key) {
      return Promise.resolve(key);
    } else {
      return Promise.reject(new Error(`Pre key ${keyId} not found`));
    }
  }

  storePreKey(keyId: number, key: any): Promise<void> {
    this.preKeys.set(keyId, key);
    return Promise.resolve();
  }

  removePreKey(keyId: number): Promise<void> {
    this.preKeys.delete(keyId);
    return Promise.resolve();
  }

  // Session
  loadSession(address: string): Promise<any> {
    const session = this.sessions.get(address);
    return Promise.resolve(session || null);
  }

  storeSession(address: string, session: any): Promise<void> {
    this.sessions.set(address, session);
    return Promise.resolve();
  }

  removeSession(address: string): Promise<void> {
    this.sessions.delete(address);
    return Promise.resolve();
  }

  removeAllSessions(): Promise<void> {
    this.sessions.clear();
    return Promise.resolve();
  }

  // Identity
  isTrustedIdentity(
    identifier: string,
    identityKey: ArrayBuffer,
    _direction: number
  ): Promise<boolean> {
    const trusted = this.identityKeys.get(identifier);
    if (!trusted) {
      return Promise.resolve(true);
    }
    return Promise.resolve(
      new Uint8Array(trusted).toString() === new Uint8Array(identityKey).toString()
    );
  }

  getIdentity(identifier: string): Promise<any> {
    return Promise.resolve(this.identityKeys.get(identifier));
  }

  saveIdentity(identifier: string, identityKey: ArrayBuffer): Promise<boolean> {
    const existing = this.identityKeys.get(identifier);
    const changed = existing && new Uint8Array(existing).toString() !== new Uint8Array(identityKey).toString();
    this.identityKeys.set(identifier, identityKey);
    return Promise.resolve(changed);
  }
}

/**
 * SignalProtocolEngine for ende-til-ende-krypterte meldinger
 */
export class SignalProtocolEngine {
  private store: InMemorySignalProtocolStore;
  private sessionCiphers: Map<string, SessionCipher> = new Map();
  private isInitialized: boolean = false;
  private currentSessionId: string | null = null;

  constructor() {
    this.store = new InMemorySignalProtocolStore();
  }

  /**
   * Initialiserer Signal Protocol for en spesifikk samtale
   * @param userId Brukerens ID
   * @param sessionId ID for samtalen
   */
  async initialize(userId: string, sessionId: string): Promise<boolean> {
    try {
      // Hvis vi allerede har initialisert denne samtalen
      if (this.isInitializedForSession(sessionId)) {
        return true;
      }
      
      this.currentSessionId = sessionId;
      
      // Generer identitetsnøkkelpar hvis det ikke eksisterer
      if (!this.isInitialized) {
        const identityKeyPair = await KeyHelper.generateIdentityKeyPair();
        await this.store.setIdentityKeyPair(identityKeyPair);
        
        // Generer registrerings-ID
        const registrationId = KeyHelper.generateRegistrationId();
        await this.store.setLocalRegistrationId(registrationId);
        
        // Generer prekeys
        const preKeyId = Math.floor(Math.random() * 1000000);
        const preKey = await KeyHelper.generatePreKey(preKeyId);
        await this.store.storePreKey(preKeyId, preKey.keyPair);
        
        // Generer signed prekey
        const signedPreKeyId = Math.floor(Math.random() * 1000000);
        const signedPreKey = await KeyHelper.generateSignedPreKey(
          identityKeyPair, 
          signedPreKeyId
        );
        await this.store.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair);
        
        this.isInitialized = true;
      }
      
      // For hver sesjon, må vi sette opp en unique adresse og sesjon
      const address = new SignalProtocolAddress(userId, 1);
      const sessionBuilder = new SessionBuilder(this.store, address);
      
      // For ekte implementasjon må vi utveksle nøkler med mottaker
      // Her simulerer vi dette for testing/demo
      const preKeyBundle = await this.createPreKeyBundle(userId, sessionId);
      await sessionBuilder.processPreKey(preKeyBundle);
      
      // Opprett og cache sessionCipher for denne samtalen
      const sessionCipher = new SessionCipher(this.store, address);
      this.sessionCiphers.set(sessionId, sessionCipher);
      
      return true;
    } catch (error) {
      console.error('Feil ved initialisering av Signal Protocol:', error);
      return false;
    }
  }
  
  /**
   * Sjekker om protokollen er initialisert for en bestemt samtale
   */
  isInitializedForSession(sessionId: string): boolean {
    return this.sessionCiphers.has(sessionId);
  }
  
  /**
   * Krypterer en melding for gjeldende samtale
   * @param message Meldingen som skal krypteres
   */
  async encryptMessage(message: string): Promise<any> {
    if (!this.currentSessionId) {
      throw new Error('Signal Protocol er ikke initialisert for noen samtale');
    }
    
    const sessionCipher = this.sessionCiphers.get(this.currentSessionId);
    if (!sessionCipher) {
      throw new Error(`Signal Protocol er ikke initialisert for samtale: ${this.currentSessionId}`);
    }
    
    try {
      // Krypter meldingen
      const messageBuffer = new TextEncoder().encode(message);
      const ciphertext = await sessionCipher.encrypt(messageBuffer.buffer);
      
      // Konverter til sendbart format
      return {
        type: ciphertext.type,
        body: arrayBufferToBase64(ciphertext.body),
      };
    } catch (error) {
      console.error('Feil ved kryptering av melding:', error);
      throw error;
    }
  }
  
  /**
   * Dekrypterer en melding fra gjeldende samtale
   * @param encryptedMessage Den krypterte meldingen
   */
  async decryptMessage(encryptedMessage: any): Promise<string> {
    if (!this.currentSessionId) {
      throw new Error('Signal Protocol er ikke initialisert for noen samtale');
    }
    
    const sessionCipher = this.sessionCiphers.get(this.currentSessionId);
    if (!sessionCipher) {
      throw new Error(`Signal Protocol er ikke initialisert for samtale: ${this.currentSessionId}`);
    }
    
    try {
      // Konverter fra transportformat
      const ciphertext = {
        type: encryptedMessage.type,
        body: base64ToArrayBuffer(encryptedMessage.body)
      };
      
      // Dekrypter basert på type
      let decrypted;
      if (ciphertext.type === 1) { // PreKeyWhisperMessage
        decrypted = await sessionCipher.decryptPreKeyWhisperMessage(ciphertext.body, 'binary');
      } else { // WhisperMessage
        decrypted = await sessionCipher.decryptWhisperMessage(ciphertext.body, 'binary');
      }
      
      // Konverter fra ArrayBuffer tilbake til tekst
      return new TextDecoder().decode(new Uint8Array(decrypted));
    } catch (error) {
      console.error('Feil ved dekryptering av melding:', error);
      throw error;
    }
  }
  
  /**
   * Roterer nøkler for økt sikkerhet
   * Dette sikrer Perfect Forward Secrecy ved å hyppig rotere nøkler
   * @param userId Brukerens ID
   * @param sessionId Samtalens ID
   */
  async rotateKeys(userId: string, sessionId: string): Promise<boolean> {
    try {
      // Lag nye pre-nøkkel
      const preKeyId = Math.floor(Math.random() * 1000000);
      const preKey = await KeyHelper.generatePreKey(preKeyId);
      await this.store.storePreKey(preKeyId, preKey.keyPair);
      
      // Lag ny signed pre-nøkkel
      const identityKeyPair = await this.store.getIdentityKeyPair();
      const signedPreKeyId = Math.floor(Math.random() * 1000000);
      const signedPreKey = await KeyHelper.generateSignedPreKey(
        identityKeyPair, 
        signedPreKeyId
      );
      await this.store.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair);
      
      // I en ekte implementasjon ville vi nå publisere disse nøklene
      // til serveren vår slik at andre kontakter kan bruke dem
      
      return true;
    } catch (error) {
      console.error('Feil ved rotering av nøkler:', error);
      return false;
    }
  }
  
  /**
   * Genererer et simulert PreKeyBundle for testing/demo
   * I en ekte implementasjon ville dette kommet fra en server
   */
  private async createPreKeyBundle(userId: string, _sessionId: string): Promise<PreKeyBundle> {
    // For demo/testing genererer vi lokalt
    // I en ekte implementasjon ville vi hente dette fra en sentral server
    
    const registrationId = await this.store.getLocalRegistrationId();
    const identityKey = await this.store.getIdentityKeyPair();
    
    const preKeyId = Math.floor(Math.random() * 1000000);
    const preKey = await KeyHelper.generatePreKey(preKeyId);
    await this.store.storePreKey(preKeyId, preKey.keyPair);
    
    const signedPreKeyId = Math.floor(Math.random() * 1000000);
    const signedPreKey = await KeyHelper.generateSignedPreKey(
      identityKey, 
      signedPreKeyId
    );
    await this.store.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair);
    
    // Simulert PreKeyBundle
    return {
      registrationId: registrationId,
      deviceId: 1,
      identityKey: identityKey.pubKey,
      preKey: {
        keyId: preKeyId,
        publicKey: preKey.keyPair.pubKey
      },
      signedPreKey: {
        keyId: signedPreKeyId,
        publicKey: signedPreKey.keyPair.pubKey,
        signature: signedPreKey.signature
      }
    };
  }
  
  /**
   * Fjerner all data for en bestemt samtale
   * @param sessionId ID for samtalen som skal ryddes opp
   */
  async clearSession(sessionId: string): Promise<void> {
    try {
      // Fjern session cipher
      this.sessionCiphers.delete(sessionId);
      
      // I en komplett implementasjon ville vi også fjernet
      // tilhørende sesjonsinformasjon fra lageret
      
    } catch (error) {
      console.error(`Feil ved opprydding av samtale ${sessionId}:`, error);
    }
  }
  
  /**
   * Fjerner all data for alle samtaler
   */
  async clearAllSessions(): Promise<void> {
    try {
      // Fjern alle session ciphers
      this.sessionCiphers.clear();
      
      // Fjern alle sesjoner fra lageret
      await this.store.removeAllSessions();
      
      // Nullstill tilstand
      this.currentSessionId = null;
      
    } catch (error) {
      console.error('Feil ved opprydding av alle samtaler:', error);
    }
  }
}

// Hjelpemal: Base64 konvertering
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Singleton-instans
let instance: SignalProtocolEngine | null = null;

/**
 * Henter en singleton-instans av SignalProtocolEngine
 */
export function getSignalProtocolEngine(): SignalProtocolEngine {
  if (!instance) {
    instance = new SignalProtocolEngine();
  }
  return instance;
}

export default SignalProtocolEngine;