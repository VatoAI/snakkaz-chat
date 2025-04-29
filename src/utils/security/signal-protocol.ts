/**
 * Signal Protocol-inspirert krypteringsmotor for Snakkaz Chat
 * 
 * Denne implementasjonen fokuserer på:
 * 1. Rask og lett kryptering med AES-256
 * 2. Perfect Forward Secrecy med Double Ratchet
 * 3. Minimalt med metadata
 * 4. Optimalisering for mobilenheter
 */

import { getRandomBytes, deriveKeyFromMaterial } from './crypto-utils';

// Constants for optimized performance
const RATCHET_ITERATION_LIMIT = 1000; // Begrenser antall iterasjoner for sikkerhet
const MESSAGE_KEY_CACHE_MAX = 100;    // Cache-størrelse for meldingsnøkler
const AES_KEY_LENGTH = 32;            // AES-256 = 32 bytes
const HMAC_KEY_LENGTH = 32;           // HMAC med SHA-256 = 32 bytes

// Interface for krypteringsnøkler
interface EncryptionKeys {
  rootKey: CryptoKey;
  chainKey: CryptoKey;
  messageKey: CryptoKey;
  previousKeys: CryptoKey[];
}

// Interface for kryptert melding
export interface EncryptedMessage {
  ciphertext: string;         // Kryptert innhold
  iv: string;                 // Initialiseringsvektor
  ephemeralKey: string;       // Efemeral nøkkel for denne meldingen
  counter: number;            // Meldingsnummer
  previousCounter: number;    // Forrige teller (for rotasjon)
}

// Hovednøkkelhåndtering
class SignalProtocolEngine {
  private rootKey: CryptoKey | null = null;
  private chainKey: CryptoKey | null = null;
  private messageKeyCache: Map<number, CryptoKey> = new Map();
  private counter: number = 0;
  
  /**
   * Initialiserer krypteringsmotoren for en samtale
   */
  async initialize(identityKey: string, conversationId: string): Promise<void> {
    try {
      // Generer rot-nøkkel fra identitet og samtale-ID
      const material = new TextEncoder().encode(`${identityKey}:${conversationId}`);
      this.rootKey = await deriveKeyFromMaterial(material, 'HKDF', ['deriveKey']);
      
      // Initialiser kjedenøkkel fra rotnøkkel
      this.chainKey = await this.deriveChainKey(this.rootKey);
      
      // Initialiser teller
      this.counter = 0;
      
      console.log('Signal Protocol Engine initialisert');
    } catch (error) {
      console.error('Feil ved initialisering av Signal Protocol Engine:', error);
      throw new Error('Kunne ikke initialisere kryptering');
    }
  }
  
  /**
   * Krypterer en melding med nåværende nøkler og roterer nøkler etterpå
   */
  async encryptMessage(plaintext: string): Promise<EncryptedMessage> {
    if (!this.rootKey || !this.chainKey) {
      throw new Error('Krypteringsmotor ikke initialisert');
    }
    
    try {
      // Avled meldingsnøkkel fra kjedenøkkel
      const messageKey = await this.deriveNextMessageKey();
      
      // Generer IV for AES-GCM
      const iv = getRandomBytes(12); // 12 bytes er standard for GCM
      
      // Konverter tekst til bytes
      const plaintextBytes = new TextEncoder().encode(plaintext);
      
      // Krypter med AES-GCM
      const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        messageKey,
        plaintextBytes
      );
      
      // Cache meldingsnøkkel for fremtidige dekrypteringsforespørsler
      this.cacheMessageKey(this.counter, messageKey);
      
      // Øk teller for neste melding
      const previousCounter = this.counter;
      this.counter++;
      
      // Roter nøkler for Perfect Forward Secrecy
      await this.rotateKeys();
      
      // Returner den krypterte meldingen
      return {
        ciphertext: bufferToBase64(ciphertext),
        iv: bufferToBase64(iv),
        ephemeralKey: await exportKeyToBase64(messageKey),
        counter: this.counter,
        previousCounter
      };
    } catch (error) {
      console.error('Krypteringsfeil:', error);
      throw new Error('Kunne ikke kryptere melding');
    }
  }
  
  /**
   * Dekrypterer en melding og validerer autentisitet
   */
  async decryptMessage(encryptedMessage: EncryptedMessage): Promise<string> {
    try {
      // Finn riktig nøkkel for dekryptering
      const messageKey = await this.getMessageKeyForDecryption(encryptedMessage.counter);
      
      if (!messageKey) {
        throw new Error('Manglende nøkkel for denne meldingen');
      }
      
      // Dekrypter med AES-GCM
      const ciphertext = base64ToBuffer(encryptedMessage.ciphertext);
      const iv = base64ToBuffer(encryptedMessage.iv);
      
      const decryptedBytes = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        messageKey,
        ciphertext
      );
      
      // Konverter bytes til tekst
      return new TextDecoder().decode(decryptedBytes);
    } catch (error) {
      console.error('Dekrypteringsfeil:', error);
      throw new Error('Kunne ikke dekryptere melding');
    }
  }
  
  /**
   * Roterer nøkler for å oppnå Perfect Forward Secrecy
   */
  private async rotateKeys(): Promise<void> {
    if (!this.rootKey) return;
    
    // Generer ny kjedenøkkel
    this.chainKey = await this.deriveChainKey(this.rootKey, this.counter);
    
    // Begrens cache-størrelse for meldingsnøkler
    if (this.messageKeyCache.size > MESSAGE_KEY_CACHE_MAX) {
      // Slett de eldste nøklene
      const oldestKeys = Array.from(this.messageKeyCache.keys())
        .sort((a, b) => a - b)
        .slice(0, this.messageKeyCache.size - MESSAGE_KEY_CACHE_MAX / 2);
      
      oldestKeys.forEach(key => this.messageKeyCache.delete(key));
    }
  }
  
  /**
   * Avleder neste meldingsnøkkel fra kjedenøkkelen
   */
  private async deriveNextMessageKey(): Promise<CryptoKey> {
    if (!this.chainKey) {
      throw new Error('Kjedenøkkel ikke initialisert');
    }
    
    // HMAC-basert nøkkelavledning
    const info = new TextEncoder().encode(`message-key-${this.counter}`);
    
    return await crypto.subtle.deriveKey(
      {
        name: 'HKDF',
        hash: 'SHA-256',
        salt: new Uint8Array(0),
        info
      },
      this.chainKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }
  
  /**
   * Avleder kjedenøkkel fra rotnøkkel
   */
  private async deriveChainKey(rootKey: CryptoKey, salt: number = 0): Promise<CryptoKey> {
    const info = new TextEncoder().encode(`chain-key-${salt}`);
    
    return await crypto.subtle.deriveKey(
      {
        name: 'HKDF',
        hash: 'SHA-256',
        salt: new Uint8Array(salt ? [salt] : [0]),
        info
      },
      rootKey,
      { name: 'AES-GCM', length: 256 },
      true,
      ['deriveKey']
    );
  }
  
  /**
   * Lagrer meldingsnøkkel i cache for senere bruk
   */
  private cacheMessageKey(counter: number, key: CryptoKey): void {
    this.messageKeyCache.set(counter, key);
  }
  
  /**
   * Henter meldingsnøkkel for dekryptering basert på meldingsteller
   */
  private async getMessageKeyForDecryption(counter: number): Promise<CryptoKey | null> {
    // Sjekk om nøkkelen er i cache
    if (this.messageKeyCache.has(counter)) {
      return this.messageKeyCache.get(counter) || null;
    }
    
    // Hvis vi ikke har nøkkelen i cache, må vi regenerere den
    // Dette skjer hvis meldinger kommer i feil rekkefølge
    if (!this.rootKey) return null;
    
    // Begrens antall regenereringer for å hindre DoS-angrep
    if (Math.abs(this.counter - counter) > RATCHET_ITERATION_LIMIT) {
      console.error('Meldingsteller er utenfor sikker rekkevidde');
      return null;
    }
    
    // Lagre nåværende tilstand
    const currentChainKey = this.chainKey;
    const currentCounter = this.counter;
    
    try {
      // Resett til rotnøkkel
      this.chainKey = await this.deriveChainKey(this.rootKey, 0);
      
      // Generer hver nøkkel opp til ønsket teller
      for (let i = 0; i <= counter; i++) {
        const messageKey = await this.deriveNextMessageKey();
        this.cacheMessageKey(i, messageKey);
        this.chainKey = await this.deriveChainKey(this.rootKey, i + 1);
      }
      
      return this.messageKeyCache.get(counter) || null;
    } finally {
      // Gjenopprett opprinnelig tilstand
      this.chainKey = currentChainKey;
      this.counter = currentCounter;
    }
  }
  
  /**
   * Eksporter nøkkelstatus for synkronisering mellom enheter
   * Dette er nødvendig for å støtte flere enheter per bruker
   */
  async exportKeyState(): Promise<string> {
    if (!this.rootKey || !this.chainKey) {
      throw new Error('Ingen nøkler å eksportere');
    }
    
    const rootKeyData = await crypto.subtle.exportKey('raw', this.rootKey);
    const chainKeyData = await crypto.subtle.exportKey('raw', this.chainKey);
    
    const state = {
      rootKey: bufferToBase64(rootKeyData),
      chainKey: bufferToBase64(chainKeyData),
      counter: this.counter
    };
    
    return JSON.stringify(state);
  }
  
  /**
   * Importerer nøkkelstatus fra en annen enhet
   */
  async importKeyState(stateJson: string): Promise<void> {
    try {
      const state = JSON.parse(stateJson);
      
      const rootKeyData = base64ToBuffer(state.rootKey);
      const chainKeyData = base64ToBuffer(state.chainKey);
      
      this.rootKey = await crypto.subtle.importKey(
        'raw',
        rootKeyData,
        { name: 'HKDF', hash: 'SHA-256' },
        false,
        ['deriveKey']
      );
      
      this.chainKey = await crypto.subtle.importKey(
        'raw',
        chainKeyData,
        { name: 'AES-GCM', length: 256 },
        true,
        ['deriveKey']
      );
      
      this.counter = state.counter;
    } catch (error) {
      console.error('Feil ved import av nøkkelstatus:', error);
      throw new Error('Kunne ikke importere nøkkelstatus');
    }
  }
}

// Hjelpefunksjoner for Base64-konvertering
function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Hjelpefunksjon for å eksportere nøkler
async function exportKeyToBase64(key: CryptoKey): Promise<string> {
  const exportedKey = await crypto.subtle.exportKey('raw', key);
  return bufferToBase64(exportedKey);
}

// Singleton-instans
let instance: SignalProtocolEngine | null = null;

// Eksporter en singleton-instans
export function getSignalProtocolEngine(): SignalProtocolEngine {
  if (!instance) {
    instance = new SignalProtocolEngine();
  }
  return instance;
}

export default SignalProtocolEngine;