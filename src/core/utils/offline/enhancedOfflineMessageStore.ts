/**
 * Enhanced offline message manager for Snakkaz Chat
 * 
 * This module provides offline message storage capabilities with IndexedDB
 * for better performance and support for larger media attachments.
 * 
 * Updated: Based on previous implementation from May 22, 2025
 */

import { nanoid } from 'nanoid';
import indexedDBStorage, { IndexedDBStorage } from '@/utils/storage/indexedDB';

export interface OfflineMessage {
  id: string;
  text: string;
  recipientId?: string;
  groupId?: string;
  mediaId?: string;
  mediaType?: string;
  mediaName?: string;
  ttl?: number;
  createdAt: number;
  status: 'pending' | 'sending' | 'failed' | 'sent';
  retryCount: number;
}

// Maximum number of offline messages stored
const MAX_OFFLINE_MESSAGES = 100;

// Legacy localStorage key (for migration support)
const OFFLINE_STORAGE_KEY = 'snakkaz_offline_messages';

/**
 * Get all buffered messages from storage
 */
export async function getOfflineMessages(): Promise<OfflineMessage[]> {
  try {
    // Try to get messages from IndexedDB first
    if (IndexedDBStorage.isSupported()) {
      const messages = await indexedDBStorage.getAll('messages');
      return messages;
    } else {
      // Fallback to localStorage
      const storageData = localStorage.getItem(OFFLINE_STORAGE_KEY);
      if (!storageData) return [];
      
      const store = JSON.parse(storageData);
      return store.messages || [];
    }
  } catch (error) {
    console.error('[OfflineMessageStore] Failed to get offline messages:', error);
    return [];
  }
}

/**
 * Store a new message in the offline buffer
 */
export async function saveOfflineMessage(
  text: string, 
  options: {
    recipientId?: string;
    groupId?: string;
    mediaBlob?: Blob;
    mediaType?: string;
    mediaName?: string;
    ttl?: number;
  }
): Promise<OfflineMessage> {
  try {
    // Create new offline message
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
    
    // Handle media file if present
    if (options.mediaBlob && IndexedDBStorage.isSupported()) {
      try {
        // Store media in IndexedDB
        const mediaId = nanoid();
        await indexedDBStorage.add('media', {
          id: mediaId,
          blob: options.mediaBlob,
          type: options.mediaType || 'application/octet-stream',
          name: options.mediaName || 'attachment',
          size: options.mediaBlob.size,
          createdAt: Date.now()
        });
        
        // Reference the media ID in the message
        newMessage.mediaId = mediaId;
      } catch (mediaError) {
        console.error('[OfflineMessageStore] Failed to store media:', mediaError);
      }
    }
    
    // Determine where to store the message
    if (IndexedDBStorage.isSupported()) {
      try {
        // Get existing messages to check count
        const existingMessages = await indexedDBStorage.getAll('messages');
        
        // Remove oldest messages if we exceed the limit
        if (existingMessages.length >= MAX_OFFLINE_MESSAGES) {
          // Sort by creation time
          const sortedMessages = [...existingMessages].sort((a, b) => a.createdAt - b.createdAt);
          
          // Delete oldest messages
          for (let i = 0; i < existingMessages.length - MAX_OFFLINE_MESSAGES + 1; i++) {
            const oldMessage = sortedMessages[i];
            await indexedDBStorage.delete('messages', oldMessage.id);
            
            // Also delete associated media if exists
            if (oldMessage.mediaId) {
              await indexedDBStorage.delete('media', oldMessage.mediaId);
            }
          }
        }
        
        // Store the new message
        await indexedDBStorage.add('messages', newMessage);
      } catch (dbError) {
        console.error('[OfflineMessageStore] IndexedDB error:', dbError);
        fallbackToLocalStorage(newMessage);
      }
    } else {
      // Fallback to localStorage
      fallbackToLocalStorage(newMessage);
    }
    
    return newMessage;
  } catch (error) {
    console.error('[OfflineMessageStore] Failed to save offline message:', error);
    throw error;
  }
}

/**
 * Update the status of an offline message
 */
export async function updateOfflineMessageStatus(
  messageId: string, 
  status: 'pending' | 'sending' | 'failed' | 'sent',
  retryCount?: number
): Promise<void> {
  try {
    if (IndexedDBStorage.isSupported()) {
      // Get the message from IndexedDB
      const message = await indexedDBStorage.get('messages', messageId);
      if (message) {
        message.status = status;
        if (retryCount !== undefined) {
          message.retryCount = retryCount;
        }
        await indexedDBStorage.put('messages', message);
      }
    } else {
      // Fallback to localStorage
      const storageData = localStorage.getItem(OFFLINE_STORAGE_KEY);
      if (!storageData) return;
      
      const store = JSON.parse(storageData);
      const messageIndex = store.messages.findIndex((msg: OfflineMessage) => msg.id === messageId);
      
      if (messageIndex !== -1) {
        store.messages[messageIndex].status = status;
        if (retryCount !== undefined) {
          store.messages[messageIndex].retryCount = retryCount;
        }
        localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(store));
      }
    }
  } catch (error) {
    console.error('[OfflineMessageStore] Failed to update message status:', error);
  }
}

/**
 * Delete an offline message after it's successfully sent
 */
export async function removeOfflineMessage(messageId: string): Promise<void> {
  try {
    if (IndexedDBStorage.isSupported()) {
      // Get the message to check for media
      const message = await indexedDBStorage.get('messages', messageId);
      
      if (message) {
        // Delete associated media if it exists
        if (message.mediaId) {
          await indexedDBStorage.delete('media', message.mediaId);
        }
        
        // Delete the message
        await indexedDBStorage.delete('messages', messageId);
      }
    } else {
      // Fallback to localStorage
      const storageData = localStorage.getItem(OFFLINE_STORAGE_KEY);
      if (!storageData) return;
      
      const store = JSON.parse(storageData);
      const messageIndex = store.messages.findIndex((msg: OfflineMessage) => msg.id === messageId);
      
      if (messageIndex !== -1) {
        store.messages.splice(messageIndex, 1);
        localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(store));
      }
    }
  } catch (error) {
    console.error('[OfflineMessageStore] Failed to remove message:', error);
  }
}

/**
 * Get media attachment for a message
 */
export async function getOfflineMessageMedia(mediaId: string): Promise<Blob | null> {
  try {
    if (!IndexedDBStorage.isSupported()) {
      return null;
    }
    
    const media = await indexedDBStorage.get('media', mediaId);
    return media ? media.blob : null;
  } catch (error) {
    console.error('[OfflineMessageStore] Failed to get message media:', error);
    return null;
  }
}

/**
 * Helper method to fall back to localStorage if IndexedDB fails
 */
function fallbackToLocalStorage(message: OfflineMessage): void {
  try {
    // Note: Media blob cannot be stored in localStorage, so we'll lose that data
    const storageData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    const store = storageData 
      ? JSON.parse(storageData)
      : { messages: [], lastSyncedAt: null };
    
    // Limit number of stored messages
    if (store.messages.length >= MAX_OFFLINE_MESSAGES) {
      // Remove oldest messages
      store.messages = store.messages.slice(-MAX_OFFLINE_MESSAGES + 1);
    }
    
    // Add new message (without media data)
    const localMessage = { ...message };
    delete localMessage.mediaId; // Can't store blob references
    
    store.messages.push(localMessage);
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.error('[OfflineMessageStore] Failed to use localStorage fallback:', error);
  }
}

/**
 * Migrate existing messages from localStorage to IndexedDB
 */
export async function migrateFromLocalStorage(): Promise<void> {
  try {
    if (!IndexedDBStorage.isSupported()) {
      return;
    }
    
    const storageData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (!storageData) return;
    
    const store = JSON.parse(storageData);
    if (!store.messages || !Array.isArray(store.messages)) return;
    
    // Transfer messages to IndexedDB
    for (const message of store.messages) {
      await indexedDBStorage.add('messages', message);
    }
    
    // Clear localStorage after successful migration
    localStorage.removeItem(OFFLINE_STORAGE_KEY);
    console.log('[OfflineMessageStore] Successfully migrated from localStorage to IndexedDB');
  } catch (error) {
    console.error('[OfflineMessageStore] Failed to migrate from localStorage:', error);
  }
}

// Attempt migration when this module is imported
if (typeof window !== 'undefined') {
  migrateFromLocalStorage();
}
