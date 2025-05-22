/**
 * Security Integration for Snakkaz Chat
 * 
 * This module bootstraps and integrates all security features of the application,
 * including CSP, IndexedDB, and encryption components.
 */

import { applyCspPolicy, enableCspEnforcement } from '@/services/security/cspConfig';
import { initializeSecurity } from '@/services/security/securityActivation';

/**
 * Initialize all security features for the application
 */
export async function bootstrapSecurityFeatures(): Promise<void> {
  try {
    console.log('Initializing Snakkaz security features...');
    
    // Apply CSP in report-only mode first to avoid breaking changes
    applyCspPolicy();
    
    // Initialize the complete security suite
    await initializeSecurity();
    
    console.log('Security features initialized successfully');
  } catch (error) {
    console.error('Failed to initialize security features:', error);
  }
}

/**
 * Convert to enforcement after sufficient testing period
 * Call this function after a week of monitoring CSP reports
 */
export function enableSecurityEnforcement(): void {
  try {
    // Switch CSP from report-only to enforcement mode
    enableCspEnforcement();
    console.log('Security enforcement enabled');
  } catch (error) {
    console.error('Failed to enable security enforcement:', error);
  }
}

/**
 * Format showing the security status of the application
 */
export function getSecurityStatus(): {
  csp: 'enforced' | 'report-only' | 'disabled';
  indexedDB: 'enabled' | 'disabled';
  encryption: 'enabled' | 'disabled';
} {
  const cspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  const cspReportTag = document.querySelector('meta[http-equiv="Content-Security-Policy-Report-Only"]');
  
  return {
    csp: cspTag ? 'enforced' : (cspReportTag ? 'report-only' : 'disabled'),
    indexedDB: typeof window !== 'undefined' && window.indexedDB ? 'enabled' : 'disabled',
    encryption: typeof window !== 'undefined' && window.crypto && window.crypto.subtle ? 'enabled' : 'disabled'
  };
}
