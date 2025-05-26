/**
 * IndexedDB Storage Utility for Snakkaz Chat
 * 
 * Provides a robust implementation of IndexedDB for offline storage needs
 * Handles larger media attachments and improves offline capabilities
 */

export interface DatabaseSchema {
  messages: {
    key: string;
    indexes: {
      status: string;
      recipientId: string;
      groupId: string;
      createdAt: number;
    };
    value: {
      id: string;
      text: string;
      recipientId?: string;
      groupId?: string;
      createdAt: number;
      status: 'pending' | 'sending' | 'failed' | 'sent';
      retryCount: number;
      ttl?: number;
      mediaId?: string; // Reference to media store
    };
  };
  media: {
    key: string;
    value: {
      id: string;
      blob: Blob;
      type: string;
      name: string;
      size: number;
      createdAt: number;
    };
  };
  settings: {
    key: string;
    value: {
      key: string;
      value: unknown;
      lastUpdated: number;
    };
  };
}

export type ObjectStoreNames = keyof DatabaseSchema;
export type ObjectStoreSchema<T extends ObjectStoreNames> = DatabaseSchema[T];
export type ObjectStoreValue<T extends ObjectStoreNames> = DatabaseSchema[T]['value'];

// Database configuration
const DB_NAME = 'snakkaz-storage';
const DB_VERSION = 1;

/**
 * Main IndexedDB utility class for Snakkaz Chat
 */
export class IndexedDBStorage {
  private static instance: IndexedDBStorage;
  private database: IDBDatabase | null = null;
  private isInitializing = false;
  private initPromise: Promise<IDBDatabase> | null = null;
  
  private constructor() {}
  
  /**
   * Get singleton instance of storage manager
   */
  public static getInstance(): IndexedDBStorage {
    if (!IndexedDBStorage.instance) {
      IndexedDBStorage.instance = new IndexedDBStorage();
    }
    return IndexedDBStorage.instance;
  }
  
  /**
   * Initialize the database connection
   */
  public async init(): Promise<IDBDatabase> {
    if (this.database) {
      return this.database;
    }
    
    if (this.initPromise) {
      return this.initPromise;
    }
    
    this.initPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error('IndexedDB is not supported in this browser'));
        return;
      }
      
      console.log('[IndexedDB] Opening database...');
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onupgradeneeded = (event) => {
        console.log(`[IndexedDB] Upgrading database to version ${DB_VERSION}`);
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('messages')) {
          const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
          messageStore.createIndex('status', 'status', { unique: false });
          messageStore.createIndex('recipientId', 'recipientId', { unique: false });
          messageStore.createIndex('groupId', 'groupId', { unique: false });
          messageStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('media')) {
          const mediaStore = db.createObjectStore('media', { keyPath: 'id' });
          mediaStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
      
      request.onsuccess = (event) => {
        this.database = (event.target as IDBOpenDBRequest).result;
        console.log(`[IndexedDB] Database opened successfully, version ${this.database.version}`);
        
        this.database.onerror = (event) => {
          // Use the event directly which has the error info
          console.error('[IndexedDB] Database error:', event);
        };
        
        resolve(this.database);
      };
      
      request.onerror = (event) => {
        console.error('[IndexedDB] Error opening database:', (event.target as IDBOpenDBRequest).error);
        this.initPromise = null;
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
    
    return this.initPromise;
  }
  
  /**
   * Add an item to a specific object store
   */
  public async add<T extends ObjectStoreNames>(
    storeName: T, 
    item: ObjectStoreValue<T>
  ): Promise<string> {
    const db = await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(item);
      
      request.onsuccess = () => {
        resolve(request.result as string);
      };
      
      request.onerror = () => {
        console.error(`[IndexedDB] Error adding item to ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }
  
  /**
   * Get an item from a specific object store by ID
   */
  public async get<T extends ObjectStoreNames>(
    storeName: T, 
    id: string
  ): Promise<ObjectStoreValue<T> | null> {
    const db = await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      
      request.onerror = () => {
        console.error(`[IndexedDB] Error getting item from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }
  
  /**
   * Get all items from a specific object store
   */
  public async getAll<T extends ObjectStoreNames>(
    storeName: T
  ): Promise<ObjectStoreValue<T>[]> {
    const db = await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        console.error(`[IndexedDB] Error getting all items from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }
  
  /**
   * Update an item in a specific object store
   */
  public async put<T extends ObjectStoreNames>(
    storeName: T, 
    item: ObjectStoreValue<T>
  ): Promise<void> {
    const db = await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        console.error(`[IndexedDB] Error updating item in ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }
  
  /**
   * Delete an item from a specific object store
   */
  public async delete<T extends ObjectStoreNames>(
    storeName: T, 
    id: string
  ): Promise<void> {
    const db = await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        console.error(`[IndexedDB] Error deleting item from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }
  
  /**
   * Get items by index
   */
  public async getByIndex<T extends ObjectStoreNames>(
    storeName: T, 
    indexName: string, 
    value: any
  ): Promise<ObjectStoreValue<T>[]> {
    const db = await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        console.error(`[IndexedDB] Error getting items by index ${indexName} from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }
  
  /**
   * Clear all items from a specific object store
   */
  public async clear<T extends ObjectStoreNames>(storeName: T): Promise<void> {
    const db = await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        console.error(`[IndexedDB] Error clearing ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }
  
  /**
   * Check if the database is supported in this browser
   */
  public static isSupported(): boolean {
    return !!window.indexedDB;
  }
}

// Export singleton instance
const indexedDBStorage = IndexedDBStorage.getInstance();
export default indexedDBStorage;
