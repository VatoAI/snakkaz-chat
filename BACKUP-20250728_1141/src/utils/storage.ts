/**
 * Storage utility functions
 * 
 * These utilities provide a consistent interface for working with
 * localStorage, sessionStorage, and IndexedDB
 */

/**
 * Get a value from localStorage
 */
export const getLocalStorage = (key: string): any => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting localStorage item ${key}:`, error);
    return null;
  }
};

/**
 * Set a value in localStorage
 */
export const setLocalStorage = (key: string, value: any): boolean => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage item ${key}:`, error);
    return false;
  }
};

/**
 * Remove a value from localStorage
 */
export const removeLocalStorage = (key: string): boolean => {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage item ${key}:`, error);
    return false;
  }
};

/**
 * Check if localStorage is available
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__test_storage__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Get a value from sessionStorage
 */
export const getSessionStorage = (key: string): any => {
  try {
    const item = window.sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting sessionStorage item ${key}:`, error);
    return null;
  }
};

/**
 * Set a value in sessionStorage
 */
export const setSessionStorage = (key: string, value: any): boolean => {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting sessionStorage item ${key}:`, error);
    return false;
  }
};

/**
 * Clear all values from a storage
 */
export const clearStorage = (storage: 'local' | 'session' = 'local'): boolean => {
  try {
    if (storage === 'local') {
      window.localStorage.clear();
    } else {
      window.sessionStorage.clear();
    }
    return true;
  } catch (error) {
    console.error(`Error clearing ${storage} storage:`, error);
    return false;
  }
};
