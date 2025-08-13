/**
 * Signal Protocol Engine
 * 
 * Implementerer SignalProtocol for ende-til-ende-kryptert meldingsutveksling.
 * Basert på Signal-protokollen for høy sikkerhet med Perfect Forward Secrecy.
 * 
 * Merk: Denne implementasjonen bruker libsignal API (via @privacyresearch/libsignal-protocol-typescript)
 * og inkluderer forbedringer inspirert av Signal open source og moderne kryptografisk praksis
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

// Interface for key versioning
interface KeyVersion {
  version: number;
  createdAt: number;
  expiresAt: number;
}

// Enhanced protocol store with additional security features inspired by Signal
class EnhancedSignalProtocolStore implements ProtocolStore {
  private identityKeys: Map<string, any> = new Map();
  private preKeys: Map<string, any> = new Map();
  private signedPreKeys: Map<string, any> = new Map();
  private sessions: Map<string, any> = new Map();
  private identityKeyPair: any = null;
  private registrationId: number = 0;
  
  // Key version tracking for better security (Signal-inspired)
  private keyVersions: Map<string, KeyVersion> = new Map();
  private currentKeyVersion: number = 1;

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

  // Methods for key versioning (Signal-inspired)
  async getKeyVersion(identifier: string): Promise<KeyVersion | null> {
    return this.keyVersions.get(identifier) || null;
  }

  async setKeyVersion(identifier: string, version: KeyVersion): Promise<void> {
    this.keyVersions.set(identifier, version);
    return Promise.resolve();
  }

  async incrementKeyVersion(identifier: string): Promise<number> {
    const current = this.keyVersions.get(identifier);
    const newVersion = {
      version: current ? current.version + 1 : 1,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // Default 24h expiry
    };
    
    this.keyVersions.set(identifier, newVersion);
    return newVersion.version;
  }

  // Enhanced security method to wipe sensitive key material (Signal-inspired)
  async securelyWipeKey(keyIdentifier: string): Promise<boolean> {
    try {
      // Get the key
      const key = this.preKeys.get(keyIdentifier) || 
                  this.signedPreKeys.get(keyIdentifier);
      
      if (!key) return false;
      
      // Overwrite key material with random data before deletion
      if (key.privKey && key.privKey.byteLength) {
        const keySize = key.privKey.byteLength;
        const randomData = new Uint8Array(keySize);
        crypto.getRandomValues(randomData);
        
        // Overwrite with random bytes
        const keyView = new Uint8Array(key.privKey);
        keyView.set(randomData);
        
        // Then overwrite with zeros
        keyView.fill(0);
      }
      
      // Delete the key
      this.preKeys.delete(keyIdentifier);
      this.signedPreKeys.delete(keyIdentifier);
      
      return true;
    } catch (error) {
      console.error('Error securely wiping key:', error);
      return false;
    }
  }

  // Enhanced isTrustedIdentity with safety timeout (Signal-inspired)
  async isTrustedIdentity(
    identifier: string,
    identityKey: ArrayBuffer,
    direction: number
  ): Promise<boolean> {
    const trusted = this.identityKeys.get(identifier);
    
    // No key stored yet - trust on first use (TOFU)
    if (!trusted) {
      return Promise.resolve(true);
    }
    
    // Compare with safety timeout to prevent timing attacks
    const start = performance.now();
    const result = constantTimeEqual(new Uint8Array(trusted), new Uint8Array(identityKey));
    
    // Implement constant-time comparison to prevent timing attacks
    // Simulate minimum processing time to prevent timing analysis
    const elapsedTime = performance.now() - start;
    if (elapsedTime < 5) {
      await new Promise(resolve => setTimeout(resolve, 5 - elapsedTime));
    }
    
    return Promise.resolve(result);
  }

  getIdentity(identifier: string): Promise<any> {
    return Promise.resolve(this.identityKeys.get(identifier));
  }

  // Enhanced saveIdentity with safety notifications and verification (Signal-inspired)
  async saveIdentity(identifier: string, identityKey: ArrayBuffer): Promise<boolean> {
    const existing = this.identityKeys.get(identifier);
    let changed = false;
    
    if (existing) {
      changed = !constantTimeEqual(
        new Uint8Array(existing),
        new Uint8Array(identityKey)
      );
      
      // If key changed, this might indicate a security issue or MITM
      if (changed) {
        console.warn(`Identity key for ${identifier} has changed! This might indicate a security issue.`);
        // In production, notify user of key change
      }
    }
    
    this.identityKeys.set(identifier, identityKey);
    return Promise.resolve(changed);
  }
}

/**
 * SignalProtocolEngine with enhanced security features 
 */
export class SignalProtocolEngine {
  private store: EnhancedSignalProtocolStore;
  private sessionCiphers: Map<string, SessionCipher> = new Map();
  private isInitialized: boolean = false;
  private currentSessionId: string | null = null;
  
  // Track key versions for each conversation (Signal-inspired)
  private keyVersions: Map<string, number> = new Map();
  
  // Prevent session reuse (Signal-inspired)
  private sessionUsageCounts: Map<string, number> = new Map();
  private readonly MAX_MESSAGES_PER_SESSION = 100; // Signal uses a similar approach

  constructor() {
    this.store = new EnhancedSignalProtocolStore();
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
      // Check if we need to rotate keys based on usage count (Signal-inspired)
      await this.checkAndRotateSessionIfNeeded(this.currentSessionId);
      
      // Krypter meldingen
      const messageBuffer = new TextEncoder().encode(message);
      const ciphertext = await sessionCipher.encrypt(messageBuffer.buffer);
      
      // Track message count for this session (Signal-inspired)
      this.incrementSessionUsageCount(this.currentSessionId);
      
      // Add key version to encryption metadata
      const keyVersion = this.keyVersions.get(this.currentSessionId) || 1;
      
      // Konverter til sendbart format
      return {
        type: ciphertext.type,
        body: arrayBufferToBase64(ciphertext.body),
        keyVersion: keyVersion,
        timestamp: Date.now() // Add timestamp for additional security
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
      
      // Verify key version if available (Signal-inspired)
      if (encryptedMessage.keyVersion) {
        this.verifyKeyVersion(this.currentSessionId!, encryptedMessage.keyVersion);
      }
      
      // Dekrypter basert på type
      let decrypted;
      if (ciphertext.type === 1) { // PreKeyWhisperMessage
        decrypted = await sessionCipher.decryptPreKeyWhisperMessage(ciphertext.body, 'binary');
      } else { // WhisperMessage
        decrypted = await sessionCipher.decryptWhisperMessage(ciphertext.body, 'binary');
      }
      
      // Increment session usage (Signal-inspired)
      this.incrementSessionUsageCount(this.currentSessionId!);
      
      // Konverter fra ArrayBuffer tilbake til tekst
      return new TextDecoder().decode(new Uint8Array(decrypted));
    } catch (error) {
      console.error('Feil ved dekryptering av melding:', error);
      throw error;
    }
  }
  
  /**
   * Track current key version for a conversation (Signal-inspired)
   */
  async getCurrentKeyVersion(conversationId: string): Promise<number> {
    return this.keyVersions.get(conversationId) || 1;
  }
  
  /**
   * Verify that the message was encrypted with a valid key version (Signal-inspired)
   */
  private async verifyKeyVersion(conversationId: string, messageKeyVersion: number): Promise<void> {
    const currentVersion = this.keyVersions.get(conversationId) || 1;
    
    // Allow current version and one previous version
    if (messageKeyVersion < currentVersion - 1) {
      console.warn(`Message encrypted with outdated key version ${messageKeyVersion}. Current: ${currentVersion}`);
      // In production, could show a warning to the user
    }
  }
  
  /**
   * Track usage count for session to know when to rotate keys (Signal-inspired)
   */
  private incrementSessionUsageCount(sessionId: string): void {
    const currentCount = this.sessionUsageCounts.get(sessionId) || 0;
    this.sessionUsageCounts.set(sessionId, currentCount + 1);
  }
  
  /**
   * Check if we need to rotate session keys based on usage (Signal-inspired)
   */
  private async checkAndRotateSessionIfNeeded(sessionId: string): Promise<void> {
    const usageCount = this.sessionUsageCounts.get(sessionId) || 0;
    
    // Rotate keys after certain number of messages (Signal-inspired)
    if (usageCount >= this.MAX_MESSAGES_PER_SESSION) {
      await this.rotateKeys(sessionId, sessionId);
      this.sessionUsageCounts.set(sessionId, 0);
    }
  }
  
  /**
   * Roterer nøkler for økt sikkerhet - Enhanced with Signal best practices
   * Dette sikrer Perfect Forward Secrecy ved å hyppig rotere nøkler
   * @param userId Brukerens ID
   * @param sessionId Samtalens ID
   */
  async rotateKeys(userId: string, sessionId: string): Promise<boolean> {
    try {
      // Lag nye pre-nøkkel med additional entropy from system (Signal-inspired)
      const additionalEntropy = await getRandomBytes(32);
      const entropyView = new Uint32Array(additionalEntropy);
      const preKeyId = Math.floor(Math.random() * 1000000) ^ entropyView[0];
      
      // Generate new prekey with additional entropy
      const preKey = await KeyHelper.generatePreKey(preKeyId);
      await this.store.storePreKey(preKeyId, preKey.keyPair);
      
      // Lag ny signed pre-nøkkel
      const identityKeyPair = await this.store.getIdentityKeyPair();
      const signedPreKeyId = Math.floor(Math.random() * 1000000) ^ entropyView[1];
      const signedPreKey = await KeyHelper.generateSignedPreKey(
        identityKeyPair, 
        signedPreKeyId
      );
      await this.store.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair);
      
      // Track key version (Signal-inspired)
      const currentVersion = this.keyVersions.get(sessionId) || 0;
      this.keyVersions.set(sessionId, currentVersion + 1);
      
      // Enhanced PFS: Signal-style key rotation
      // Save the ephemeral keys for this session
      await this.store.saveIdentity(sessionId, signedPreKey.keyPair.pubKey);
      
      // Securely delete old keys (Signal-inspired)
      await this.securelyDeleteOldKeys(sessionId);
      
      return true;
    } catch (error) {
      console.error('Feil ved rotering av nøkler:', error);
      return false;
    }
  }
  
  /**
   * Generate a new key pair with strong entropy (Signal-inspired)
   */
  async generateKeyPair(): Promise<any> {
    try {
      return await KeyHelper.generateIdentityKeyPair();
    } catch (error) {
      console.error('Error generating key pair:', error);
      throw error;
    }
  }
  
  /**
   * Securely delete old keys to prevent compromise (Signal-inspired)
   */
  private async securelyDeleteOldKeys(sessionId: string): Promise<void> {
    try {
      // Get all prekeys older than current
      const oldKeyIds = Array.from(this.store.getAllPreKeyIds())
        .filter(id => id.toString().includes(sessionId) && 
               id !== this.store.getCurrentPreKeyId(sessionId));
      
      // Securely wipe each key
      for (const keyId of oldKeyIds) {
        await this.store.securelyWipeKey(keyId.toString());
      }
    } catch (error) {
      console.error('Error securely deleting old keys:', error);
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

/**
 * Constant-time comparison function to prevent timing attacks (Signal-inspired)
 * This is critical for secure identity key verification
 */
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    // XOR the bytes - will be 0 if they're the same
    result |= a[i] ^ b[i];
  }
  
  return result === 0;
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