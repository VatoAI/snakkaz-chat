/**
 * Offline meldinglager for Snakkaz Chat
 * 
 * Dette modulet lar applikasjonen lagre meldinger lokalt når brukeren er offline,
 * og sender dem automatisk når tilkoblingen gjenopprettes.
 * 
 * Implementert: 22. mai 2025
 */

import { nanoid } from 'nanoid';

export interface OfflineMessage {
  id: string;
  text: string;
  recipientId?: string;
  groupId?: string;
  mediaBlob?: Blob;
  mediaType?: string;
  mediaName?: string;
  ttl?: number;
  createdAt: number;
  status: 'pending' | 'sending' | 'failed' | 'sent';
  retryCount: number;
}

export interface OfflineMessageStore {
  messages: OfflineMessage[];
  lastSyncedAt: number | null;
}

// Filnavn i local storage
const OFFLINE_STORAGE_KEY = 'snakkaz_offline_messages';

// Maksimum antall meldinger som lagres offline
const MAX_OFFLINE_MESSAGES = 100;

/**
 * Hent alle bufrede meldinger fra local storage
 */
export function getOfflineMessages(): OfflineMessage[] {
  try {
    const storageData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (!storageData) return [];
    
    const store = JSON.parse(storageData) as OfflineMessageStore;
    return store.messages;
  } catch (error) {
    console.error('Failed to get offline messages:', error);
    return [];
  }
}

/**
 * Lagre en ny melding i offline buffer
 */
export function saveOfflineMessage(
  text: string, 
  options: {
    recipientId?: string;
    groupId?: string;
    mediaBlob?: Blob;
    mediaType?: string;
    mediaName?: string;
    ttl?: number;
  }
): OfflineMessage {
  try {
    const storageData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    const store: OfflineMessageStore = storageData 
      ? JSON.parse(storageData)
      : { messages: [], lastSyncedAt: null };
    
    // Begrense antall bufret meldinger
    if (store.messages.length >= MAX_OFFLINE_MESSAGES) {
      // Fjern de eldste meldingene hvis vi når maksgrensen
      store.messages = store.messages.slice(-MAX_OFFLINE_MESSAGES + 1);
    }
    
    // Opprett ny offlinemelding
    const newMessage: OfflineMessage = {
      id: nanoid(),
      text,
      recipientId: options.recipientId,
      groupId: options.groupId,
      mediaType: options.mediaType,
      mediaName: options.mediaName,
      ttl: options.ttl,
      createdAt: Date.now(),
      status: 'pending',
      retryCount: 0
    };
    
    // Håndter mediafil (hvis den finnes)
    if (options.mediaBlob) {
      // For enkelhets skyld lagrer vi ikke store mediafiler i localStorage
      // I en fullstendig implementasjon ville vi bruke IndexedDB for dette
      newMessage.mediaName = options.mediaName;
      newMessage.mediaType = options.mediaType;
    }
    
    // Legg til meldingen i lageret
    store.messages.push(newMessage);
    
    // Oppdater localStorage
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(store));
    
    return newMessage;
  } catch (error) {
    console.error('Failed to save offline message:', error);
    // Returner en melding selv om lagring feilet
    return {
      id: nanoid(),
      text,
      createdAt: Date.now(),
      status: 'failed',
      retryCount: 0
    };
  }
}

/**
 * Merk en offline-melding som sendt
 */
export function markOfflineMessageAsSent(messageId: string): boolean {
  try {
    const storageData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (!storageData) return false;
    
    const store: OfflineMessageStore = JSON.parse(storageData);
    
    // Finn meldingen og oppdater statusen
    const messageIndex = store.messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return false;
    
    store.messages[messageIndex].status = 'sent';
    store.lastSyncedAt = Date.now();
    
    // Lagre oppdatert status
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(store));
    
    return true;
  } catch (error) {
    console.error('Failed to mark message as sent:', error);
    return false;
  }
}

/**
 * Merk en offline-melding som mislykket
 */
export function markOfflineMessageAsFailed(messageId: string): boolean {
  try {
    const storageData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (!storageData) return false;
    
    const store: OfflineMessageStore = JSON.parse(storageData);
    
    // Finn meldingen og oppdater statusen
    const messageIndex = store.messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return false;
    
    store.messages[messageIndex].status = 'failed';
    store.messages[messageIndex].retryCount += 1;
    
    // Lagre oppdatert status
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(store));
    
    return true;
  } catch (error) {
    console.error('Failed to mark message as failed:', error);
    return false;
  }
}

/**
 * Fjern alle sendte meldinger fra offline lageret
 */
export function clearSentOfflineMessages(): number {
  try {
    const storageData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (!storageData) return 0;
    
    const store: OfflineMessageStore = JSON.parse(storageData);
    const originalCount = store.messages.length;
    
    // Behold bare meldinger som ikke er sendt
    store.messages = store.messages.filter(msg => msg.status !== 'sent');
    store.lastSyncedAt = Date.now();
    
    // Lagre oppdatert lager
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(store));
    
    // Returner antall fjernede meldinger
    return originalCount - store.messages.length;
  } catch (error) {
    console.error('Failed to clear sent messages:', error);
    return 0;
  }
}

/**
 * Fjern alle bufrede meldinger
 */
export function clearAllOfflineMessages(): boolean {
  try {
    localStorage.removeItem(OFFLINE_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear all offline messages:', error);
    return false;
  }
}

/**
 * Hent antall ventende meldinger
 */
export function getPendingMessageCount(): number {
  try {
    const messages = getOfflineMessages();
    return messages.filter(msg => msg.status === 'pending').length;
  } catch (error) {
    console.error('Failed to get pending message count:', error);
    return 0;
  }
}

/**
 * Håndterer automatisk sending av bufrede meldinger når tilkoblingen er gjenopprettet
 * 
 * @param sendFunction Funksjon for å sende en melding
 * @param options Konfigurasjonsalternativer
 */
export function setupOfflineSync(
  sendFunction: (message: OfflineMessage) => Promise<boolean>,
  options: {
    onSyncComplete?: (results: {sent: number, failed: number}) => void;
    maxConcurrent?: number;
    retryLimit?: number;
  } = {}
): () => void {
  const maxConcurrent = options.maxConcurrent || 3;
  const retryLimit = options.retryLimit || 3;
  
  // Funksjon for å starte synkroniseringsprosessen
  const startSync = async () => {
    const pendingMessages = getOfflineMessages().filter(
      msg => msg.status === 'pending' && msg.retryCount < retryLimit
    );
    
    if (pendingMessages.length === 0) {
      return;
    }
    
    console.log(`Starting sync of ${pendingMessages.length} offline messages`);
    
    // Send meldinger i grupper for å unngå å overbelaste serveren
    let sent = 0;
    let failed = 0;
    
    for (let i = 0; i < pendingMessages.length; i += maxConcurrent) {
      const batch = pendingMessages.slice(i, i + maxConcurrent);
      
      // Send meldinger parallelt, men begrens antallet
      const results = await Promise.allSettled(
        batch.map(async (message) => {
          try {
            const success = await sendFunction(message);
            if (success) {
              markOfflineMessageAsSent(message.id);
              return true;
            } else {
              markOfflineMessageAsFailed(message.id);
              return false;
            }
          } catch (error) {
            console.error(`Failed to send offline message ${message.id}:`, error);
            markOfflineMessageAsFailed(message.id);
            return false;
          }
        })
      );
      
      // Tell opp resultater
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value === true) {
          sent++;
        } else {
          failed++;
        }
      });
      
      // Kort pause mellom batcher for å unngå å overbelaste serveren
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Rapporter resultat
    if (options.onSyncComplete) {
      options.onSyncComplete({ sent, failed });
    }
    
    // Rydd opp
    clearSentOfflineMessages();
  };
  
  // Lytt til online-hendelser og start synkronisering når vi er online igjen
  const handleOnline = () => {
    startSync();
  };
  
  window.addEventListener('online', handleOnline);
  
  // Start synkronisering en gang umiddelbart hvis vi er online
  if (navigator.onLine) {
    setTimeout(startSync, 1000);
  }
  
  // Returner en funksjon for å fjerne lytteren
  return () => {
    window.removeEventListener('online', handleOnline);
  };
}
