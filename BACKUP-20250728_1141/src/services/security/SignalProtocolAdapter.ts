/**
 * SnakkaZ Signal Protocol Adapter
 * 
 * Implementerer Signal Protocol for robust nøkkelhåndtering og kryptering.
 * Integrerer med eksisterende E2EE-system og MCP for avansert sikkerhet.
 */

import {
  SignalProtocolAddress,
  SessionBuilder,
  SessionCipher,
  PreKeyBundle,
  KeyHelper
} from '@privacyresearch/libsignal-protocol-typescript';
import { createClient } from '@supabase/supabase-js';
import { arrayBufferToBase64, base64ToArrayBuffer } from '../../utils/crypto/e2ee';

// Konstanter
const KEYS_DB_NAME = 'snakkaz_signal_keys';
const IDENTITY_KEY = 'identity_key';
const SIGNED_PRE_KEY = 'signed_pre_key';
const PRE_KEYS = 'pre_keys';
const SESSIONS = 'sessions';

// Typedefinitioner
interface SignalKeys {
  identityKey: {
    pubKey: ArrayBuffer;
    privKey: ArrayBuffer;
  };
  signedPreKey: {
    keyId: number;
    keyPair: {
      pubKey: ArrayBuffer;
      privKey: ArrayBuffer;
    };
    signature: ArrayBuffer;
  };
  preKeys: Array<{
    keyId: number;
    keyPair: {
      pubKey: ArrayBuffer;
      privKey: ArrayBuffer;
    };
  }>;
  registrationId: number;
}

// Supabase-klient
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_ANON_KEY || ''
);

/**
 * Signal Protocol Store implementasjon som bruker IndexedDB
 */
export class SignalProtocolStore {
  private db: IDBDatabase | null = null;
  private identityKeyPair: { pubKey: ArrayBuffer; privKey: ArrayBuffer } | null = null;
  private registrationId: number | null = null;

  /**
   * Initialiserer databasen for Signal Protocol Store
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(KEYS_DB_NAME, 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Opprett objektlagre
        if (!db.objectStoreNames.contains(IDENTITY_KEY)) {
          db.createObjectStore(IDENTITY_KEY);
        }
        if (!db.objectStoreNames.contains(SIGNED_PRE_KEY)) {
          db.createObjectStore(SIGNED_PRE_KEY);
        }
        if (!db.objectStoreNames.contains(PRE_KEYS)) {
          db.createObjectStore(PRE_KEYS);
        }
        if (!db.objectStoreNames.contains(SESSIONS)) {
          db.createObjectStore(SESSIONS);
        }
      };
      
      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };
      
      request.onerror = (event) => {
        reject(new Error(`Database error: ${(event.target as IDBOpenDBRequest).error}`));
      };
    });
  }

  /**
   * Lagrer identitetsnøkkelpar
   */
  async storeIdentityKeyPair(identityKeyPair: { pubKey: ArrayBuffer; privKey: ArrayBuffer }): Promise<void> {
    this.identityKeyPair = identityKeyPair;
    await this.put(IDENTITY_KEY, 'identityKey', identityKeyPair);
  }

  /**
   * Henter identitetsnøkkelpar
   */
  async getIdentityKeyPair(): Promise<{ pubKey: ArrayBuffer; privKey: ArrayBuffer } | null> {
    if (this.identityKeyPair) return this.identityKeyPair;
    
    const identityKeyPair = await this.get(IDENTITY_KEY, 'identityKey');
    if (identityKeyPair) this.identityKeyPair = identityKeyPair;
    return identityKeyPair;
  }

  /**
   * Lagrer registrerings-ID
   */
  async storeRegistrationId(registrationId: number): Promise<void> {
    this.registrationId = registrationId;
    await this.put(IDENTITY_KEY, 'registrationId', registrationId);
  }

  /**
   * Henter registrerings-ID
   */
  async getRegistrationId(): Promise<number | null> {
    if (this.registrationId) return this.registrationId;
    
    const registrationId = await this.get(IDENTITY_KEY, 'registrationId');
    if (registrationId) this.registrationId = registrationId;
    return registrationId;
  }

  /**
   * Lagrer en pre-key
   */
  async storePreKey(keyId: number, keyPair: { pubKey: ArrayBuffer; privKey: ArrayBuffer }): Promise<void> {
    await this.put(PRE_KEYS, keyId.toString(), keyPair);
  }

  /**
   * Henter en pre-key
   */
  async getPreKey(keyId: number): Promise<{ pubKey: ArrayBuffer; privKey: ArrayBuffer } | null> {
    return await this.get(PRE_KEYS, keyId.toString());
  }

  /**
   * Fjerner en pre-key
   */
  async removePreKey(keyId: number): Promise<void> {
    await this.delete(PRE_KEYS, keyId.toString());
  }

  /**
   * Lagrer en signert pre-key
   */
  async storeSignedPreKey(keyId: number, keyPair: { pubKey: ArrayBuffer; privKey: ArrayBuffer }): Promise<void> {
    await this.put(SIGNED_PRE_KEY, keyId.toString(), keyPair);
  }

  /**
   * Henter en signert pre-key
   */
  async getSignedPreKey(keyId: number): Promise<{ pubKey: ArrayBuffer; privKey: ArrayBuffer } | null> {
    return await this.get(SIGNED_PRE_KEY, keyId.toString());
  }

  /**
   * Fjerner en signert pre-key
   */
  async removeSignedPreKey(keyId: number): Promise<void> {
    await this.delete(SIGNED_PRE_KEY, keyId.toString());
  }

  /**
   * Lagrer en økt
   */
  async storeSession(address: string, record: ArrayBuffer): Promise<void> {
    await this.put(SESSIONS, address, record);
  }

  /**
   * Henter en økt
   */
  async getSession(address: string): Promise<ArrayBuffer | null> {
    return await this.get(SESSIONS, address);
  }

  /**
   * Fjerner en økt
   */
  async removeSession(address: string): Promise<void> {
    await this.delete(SESSIONS, address);
  }

  /**
   * Fjerner alle økter
   */
  async removeAllSessions(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction([SESSIONS], 'readwrite');
      const objectStore = transaction.objectStore(SESSIONS);
      const request = objectStore.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Hjelpemetode for å lagre data i databasen
   */
  private async put(store: string, key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.put(value, key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Hjelpemetode for å hente data fra databasen
   */
  private async get(store: string, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction([store], 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Hjelpemetode for å slette data fra databasen
   */
  private async delete(store: string, key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

/**
 * SignalProtocolAdapter klasse for å håndtere Signal Protocol
 */
export class SignalProtocolAdapter {
  private store: SignalProtocolStore;
  private userId: string;
  private userDeviceId: number;
  
  constructor(userId: string, userDeviceId: number = 1) {
    this.userId = userId;
    this.userDeviceId = userDeviceId;
    this.store = new SignalProtocolStore();
  }

  /**
   * Initialiserer Signal Protocol
   */
  async initialize(): Promise<void> {
    await this.store.init();
    
    // Sjekk om vi allerede har nøkler
    const identityKey = await this.store.getIdentityKeyPair();
    const registrationId = await this.store.getRegistrationId();
    
    if (!identityKey || !registrationId) {
      await this.generateAndStoreKeys();
    }
  }

  /**
   * Genererer og lagrer alle nødvendige nøkler for Signal Protocol
   */
  private async generateAndStoreKeys(): Promise<void> {
    // Generer identitetsnøkkel
    const identityKeyPair = await KeyHelper.generateIdentityKeyPair();
    await this.store.storeIdentityKeyPair(identityKeyPair);
    
    // Generer registrerings-ID
    const registrationId = KeyHelper.generateRegistrationId();
    await this.store.storeRegistrationId(registrationId);
    
    // Generer signert pre-key
    const signedPreKeyId = Math.floor(Math.random() * 10000);
    const signedPreKey = await KeyHelper.generateSignedPreKey(identityKeyPair, signedPreKeyId);
    await this.store.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair);
    
    // Generer pre-keys
    const preKeyCount = 50;
    const preKeys = await KeyHelper.generatePreKeys(Math.floor(Math.random() * 10000), preKeyCount);
    
    for (const preKey of preKeys) {
      await this.store.storePreKey(preKey.keyId, preKey.keyPair);
    }
    
    // Last opp nøklene til serveren
    await this.uploadKeys({
      identityKey: identityKeyPair,
      signedPreKey: {
        keyId: signedPreKeyId,
        keyPair: signedPreKey.keyPair,
        signature: signedPreKey.signature
      },
      preKeys: preKeys.map(preKey => ({
        keyId: preKey.keyId,
        keyPair: preKey.keyPair
      })),
      registrationId
    });
  }

  /**
   * Laster opp nøkler til serveren
   */
  private async uploadKeys(keys: SignalKeys): Promise<void> {
    // Forbered nøkler for opplasting
    const keysForUpload = {
      user_id: this.userId,
      device_id: this.userDeviceId,
      registration_id: keys.registrationId,
      identity_key: arrayBufferToBase64(keys.identityKey.pubKey),
      signed_pre_key: {
        key_id: keys.signedPreKey.keyId,
        public_key: arrayBufferToBase64(keys.signedPreKey.keyPair.pubKey),
        signature: arrayBufferToBase64(keys.signedPreKey.signature)
      },
      pre_keys: keys.preKeys.map(preKey => ({
        key_id: preKey.keyId,
        public_key: arrayBufferToBase64(preKey.keyPair.pubKey)
      }))
    };
    
    // Last opp nøkler til Supabase
    const { error } = await supabase
      .from('signal_keys')
      .upsert({
        ...keysForUpload,
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Failed to upload keys:', error);
      throw new Error('Failed to upload Signal Protocol keys');
    }
  }

  /**
   * Henter pre-keys for en bruker
   */
  async getPreKeysForUser(recipientId: string, deviceId: number = 1): Promise<PreKeyBundle> {
    const { data, error } = await supabase
      .from('signal_keys')
      .select('*')
      .eq('user_id', recipientId)
      .eq('device_id', deviceId)
      .single();
    
    if (error || !data) {
      throw new Error('Failed to fetch Signal Protocol keys for recipient');
    }
    
    // Velg en tilfeldig pre-key
    const preKeyIndex = Math.floor(Math.random() * data.pre_keys.length);
    const preKey = data.pre_keys[preKeyIndex];
    
    return {
      registrationId: data.registration_id,
      deviceId: data.device_id,
      identityKey: base64ToArrayBuffer(data.identity_key),
      signedPreKey: {
        keyId: data.signed_pre_key.key_id,
        publicKey: base64ToArrayBuffer(data.signed_pre_key.public_key),
        signature: base64ToArrayBuffer(data.signed_pre_key.signature)
      },
      preKey: {
        keyId: preKey.key_id,
        publicKey: base64ToArrayBuffer(preKey.public_key)
      }
    };
  }

  /**
   * Krypterer en melding for en mottaker
   */
  async encryptMessage(recipientId: string, message: string | ArrayBuffer): Promise<{ type: number; body: string; registrationId?: number }> {
    const deviceId = 1; // Antar at alle brukere har device_id 1
    const address = new SignalProtocolAddress(recipientId, deviceId);
    
    // Sjekk om vi har en økt med denne mottakeren
    let sessionCipher;
    
    try {
      sessionCipher = new SessionCipher(this.store, address);
    } catch (error) {
      // Ingen eksisterende økt, må opprette en ny
      const preKey = await this.getPreKeysForUser(recipientId, deviceId);
      const sessionBuilder = new SessionBuilder(this.store, address);
      await sessionBuilder.processPreKey(preKey);
      sessionCipher = new SessionCipher(this.store, address);
    }
    
    // Konverter melding til Uint8Array
    let messageBuffer: Uint8Array;
    
    if (typeof message === 'string') {
      const encoder = new TextEncoder();
      messageBuffer = encoder.encode(message);
    } else {
      messageBuffer = new Uint8Array(message);
    }
    
    // Krypter meldingen
    const ciphertext = await sessionCipher.encrypt(messageBuffer);
    return ciphertext;
  }

  /**
   * Dekrypterer en melding fra en avsender
   */
  async decryptMessage(
    senderId: string,
    message: { type: number; body: string; registrationId?: number }
  ): Promise<ArrayBuffer> {
    const deviceId = 1; // Antar at alle brukere har device_id 1
    const address = new SignalProtocolAddress(senderId, deviceId);
    const sessionCipher = new SessionCipher(this.store, address);
    
    let plaintext: ArrayBuffer;
    
    // Dekrypter basert på meldingstype
    if (message.type === 3) {
      // PreKeyWhisperMessage
      plaintext = await sessionCipher.decryptPreKeyWhisperMessage(
        base64ToArrayBuffer(message.body),
        'binary'
      );
    } else if (message.type === 1) {
      // WhisperMessage
      plaintext = await sessionCipher.decryptWhisperMessage(
        base64ToArrayBuffer(message.body),
        'binary'
      );
    } else {
      throw new Error('Unknown message type');
    }
    
    return plaintext;
  }

  /**
   * Initialiserer en gruppe med Signal Protocol
   */
  async initializeGroup(groupId: string, participantIds: string[]): Promise<{ groupKey: ArrayBuffer; distributedKeys: Record<string, string> }> {
    // Generer en gruppenøkkel
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
    
    // Eksporter nøkkelen
    const groupKey = await window.crypto.subtle.exportKey('raw', keyPair);
    
    // Krypter gruppenøkkelen for hver deltaker
    const distributedKeys: Record<string, string> = {};
    
    for (const participantId of participantIds) {
      if (participantId === this.userId) {
        // Lagre gruppenøkkelen lokalt for egen bruker
        distributedKeys[participantId] = arrayBufferToBase64(groupKey);
        continue;
      }
      
      try {
        // Krypter gruppenøkkelen med Signal Protocol
        const encryptedKey = await this.encryptMessage(participantId, groupKey);
        distributedKeys[participantId] = JSON.stringify(encryptedKey);
      } catch (error) {
        console.error(`Failed to encrypt group key for ${participantId}:`, error);
      }
    }
    
    // Lagre gruppeinformasjon i databasen
    await supabase
      .from('group_keys')
      .upsert({
        group_id: groupId,
        key_version: 1,
        distributed_keys: distributedKeys,
        created_by: this.userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    return { groupKey, distributedKeys };
  }

  /**
   * Henter en gruppenøkkel
   */
  async getGroupKey(groupId: string): Promise<ArrayBuffer | null> {
    const { data, error } = await supabase
      .from('group_keys')
      .select('*')
      .eq('group_id', groupId)
      .order('key_version', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      console.error('Failed to fetch group key:', error);
      return null;
    }
    
    // Hent den krypterte nøkkelen for denne brukeren
    const encryptedKey = data.distributed_keys[this.userId];
    if (!encryptedKey) {
      console.error('No group key found for this user');
      return null;
    }
    
    try {
      if (encryptedKey.startsWith('{')) {
        // Nøkkelen er kryptert med Signal Protocol
        const parsedKey = JSON.parse(encryptedKey);
        
        // Dekrypter med Signal Protocol
        return await this.decryptMessage(data.created_by, parsedKey);
      } else {
        // Nøkkelen er base64-kodet (for egen bruker)
        return base64ToArrayBuffer(encryptedKey);
      }
    } catch (error) {
      console.error('Failed to decrypt group key:', error);
      return null;
    }
  }

  /**
   * Roterer en gruppenøkkel (f.eks. når et medlem forlater gruppen)
   */
  async rotateGroupKey(groupId: string, participantIds: string[]): Promise<{ groupKey: ArrayBuffer; distributedKeys: Record<string, string> }> {
    // Hent nåværende nøkkelversjon
    const { data, error } = await supabase
      .from('group_keys')
      .select('key_version')
      .eq('group_id', groupId)
      .order('key_version', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('Failed to fetch current key version:', error);
      throw new Error('Failed to fetch current key version');
    }
    
    const currentVersion = data?.key_version || 0;
    const newVersion = currentVersion + 1;
    
    // Generer en ny gruppenøkkel
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
    
    // Eksporter nøkkelen
    const groupKey = await window.crypto.subtle.exportKey('raw', keyPair);
    
    // Krypter gruppenøkkelen for hver deltaker
    const distributedKeys: Record<string, string> = {};
    
    for (const participantId of participantIds) {
      if (participantId === this.userId) {
        // Lagre gruppenøkkelen lokalt for egen bruker
        distributedKeys[participantId] = arrayBufferToBase64(groupKey);
        continue;
      }
      
      try {
        // Krypter gruppenøkkelen med Signal Protocol
        const encryptedKey = await this.encryptMessage(participantId, groupKey);
        distributedKeys[participantId] = JSON.stringify(encryptedKey);
      } catch (error) {
        console.error(`Failed to encrypt group key for ${participantId}:`, error);
      }
    }
    
    // Lagre gruppeinformasjon i databasen
    await supabase
      .from('group_keys')
      .insert({
        group_id: groupId,
        key_version: newVersion,
        distributed_keys: distributedKeys,
        created_by: this.userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    return { groupKey, distributedKeys };
  }
}

/**
 * Eksporter en enkel versjon for integrering med eksisterende E2EE-system
 */
export const createSignalProtocolAdapter = async (userId: string): Promise<SignalProtocolAdapter> => {
  const adapter = new SignalProtocolAdapter(userId);
  await adapter.initialize();
  return adapter;
};
