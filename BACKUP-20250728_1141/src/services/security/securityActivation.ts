/**
 * Security activation for Snakkaz Chat
 * 
 * This module activates the security features for the Snakkaz Chat application
 * including CSP, IndexedDB for secure storage, and security headers
 */

import { applyCspPolicy } from '@/services/security/cspConfig';
import indexedDBStorage, { IndexedDBStorage } from '@/utils/storage/indexedDB';
import { migrateFromLocalStorage } from '@/utils/offline/enhancedOfflineMessageStore';

/**
 * Initialize all security features
 * Call this at application startup
 */
export async function initializeSecurity(): Promise<void> {
  console.log('Initializing security features...');
  
  // Apply CSP policy
  applyCspPolicy();
  
  // Initialize IndexedDB storage
  if (IndexedDBStorage.isSupported()) {
    try {
      await indexedDBStorage.init();
      console.log('IndexedDB storage initialized successfully');
      
      // Migrate data from localStorage to IndexedDB
      await migrateFromLocalStorage();
    } catch (error) {
      console.error('Failed to initialize IndexedDB storage:', error);
    }
  } else {
    console.warn('IndexedDB is not supported in this browser. Using localStorage fallback.');
  }
  
  // Set secure security headers if running in a proper environment
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    // These headers are normally set on the server side, but we check them client-side
    // Most need to be set on the server, but we can add meta tags for some
    addSecurityMetaTags();
  }
}

/**
 * Add security-related meta tags to the document head
 */
function addSecurityMetaTags(): void {
  if (typeof document === 'undefined') return;
  
  // List of security meta tags to add
  const metaTags = [
    { name: 'referrer', content: 'strict-origin-when-cross-origin' },
    { name: 'X-Frame-Options', content: 'SAMEORIGIN' },
    { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
  ];
  
  // Add each meta tag
  metaTags.forEach(metaData => {
    const metaTag = document.createElement('meta');
    
    if (metaData.name) {
      metaTag.name = metaData.name;
    }
    
    if (metaData.httpEquiv) {
      metaTag.httpEquiv = metaData.httpEquiv;
    }
    
    metaTag.content = metaData.content;
    
    document.head.appendChild(metaTag);
  });
}

/**
 * Run security self-test to identify potential issues
 * This function should be called in development or testing environments
 */
export async function runSecuritySelfTest(): Promise<{
  issues: string[];
  warnings: string[];
  results: Record<string, any>;
}> {
  const issues: string[] = [];
  const warnings: string[] = [];
  const results: Record<string, any> = {};

  // Check CSP
  try {
    const cspMetaTag = document.querySelector('meta[http-equiv="Content-Security-Policy"], meta[http-equiv="Content-Security-Policy-Report-Only"]');
    if (!cspMetaTag) {
      issues.push('CSP policy not found in document');
    } else {
      results.csp = {
        mode: cspMetaTag.getAttribute('http-equiv'),
        content: cspMetaTag.getAttribute('content')
      };
      
      if (cspMetaTag.getAttribute('http-equiv') === 'Content-Security-Policy-Report-Only') {
        warnings.push('CSP is in report-only mode and not enforcing security restrictions');
      }
    }
  } catch (error) {
    issues.push(`Failed to check CSP: ${error.message}`);
  }
  
  // Check IndexedDB
  try {
    results.indexedDB = {
      supported: IndexedDBStorage.isSupported()
    };
    
    if (!IndexedDBStorage.isSupported()) {
      warnings.push('IndexedDB is not supported. App will use less secure localStorage fallback');
    } else {
      try {
        await indexedDBStorage.init();
        results.indexedDB.initialized = true;
      } catch (error) {
        issues.push(`IndexedDB initialization failed: ${error.message}`);
        results.indexedDB.initialized = false;
      }
    }
  } catch (error) {
    issues.push(`Failed to check IndexedDB: ${error.message}`);
  }
  
  // Check secure connection
  if (typeof window !== 'undefined') {
    results.connection = {
      protocol: window.location.protocol,
      secure: window.location.protocol === 'https:'
    };
    
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      issues.push('Application is not running on HTTPS, data transmissions are not secure');
    }
  }
  
  return { issues, warnings, results };
}
