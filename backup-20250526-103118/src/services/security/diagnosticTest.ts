/**
 * Diagnostic Test Utilities
 * 
 * Runs diagnostic tests to verify that the application
 * is properly configured and working as expected.
 * Updated version without Cloudflare dependencies.
 */

// Test result interface
interface DiagnosticResult {
  supabaseConnectivity: boolean;
  corsPolicy: boolean;
  cspConfig: boolean;
  localStorage: boolean;
  indexedDB: boolean;
  serviceWorker: boolean;
}

/**
 * Run a diagnostic test to verify configuration and connectivity
 */
export async function runDiagnosticTest(): Promise<DiagnosticResult> {
  // Default results - assume failure
  const results: DiagnosticResult = {
    supabaseConnectivity: false,
    corsPolicy: false,
    cspConfig: true, // Assume CSP is configured correctly initially
    localStorage: false,
    indexedDB: false,
    serviceWorker: false
  };
  
  // Skip if not in browser context
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return results;
  }
  
  try {
    // Test localStorage
    try {
      localStorage.setItem('diagnosticTest', 'test');
      results.localStorage = localStorage.getItem('diagnosticTest') === 'test';
      localStorage.removeItem('diagnosticTest');
    } catch (e) {
      console.error('localStorage test failed:', e);
      results.localStorage = false;
    }
    
    // Test IndexedDB
    try {
      const request = indexedDB.open('diagnosticTest', 1);
      request.onerror = () => {
        results.indexedDB = false;
      };
      request.onsuccess = () => {
        results.indexedDB = true;
        request.result.close();
        indexedDB.deleteDatabase('diagnosticTest');
      };
    } catch (e) {
      console.error('IndexedDB test failed:', e);
      results.indexedDB = false;
    }
    
    // Test CSP configuration
    try {
      const metaTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
      if (metaTags.length === 0) {
        results.cspConfig = false;
        console.warn('No CSP meta tag found');
      } else {
        let cspContent = '';
        for (const tag of metaTags) {
          cspContent = tag.getAttribute('content') || '';
        }
        
        // Check if CSP has critical directives
        results.cspConfig = 
          cspContent.includes('script-src') && 
          cspContent.includes('connect-src') && 
          cspContent.includes('supabase');
          
        if (!results.cspConfig) {
          console.warn('CSP is missing critical directives');
        }
      }
    } catch (e) {
      console.error('CSP test failed:', e);
      results.cspConfig = false;
    }
    
    // Test Service Worker support
    results.serviceWorker = 'serviceWorker' in navigator;
    
    // Test CORS policy
    try {
      const corsTestUrl = 'https://api.snakkaz.com/cors-test';
      const corsResponse = await fetch(corsTestUrl, {
        method: 'GET',
        mode: 'cors'
      });
      results.corsPolicy = corsResponse.ok;
    } catch (e) {
      console.error('CORS test failed:', e);
      results.corsPolicy = false;
    }
    
    // Test Supabase connectivity
    try {
      // Import Supabase client
      const { supabase } = await import('../../integrations/supabase/client');
      
      // Simple ping to check connectivity
      const { error } = await supabase.from('health_check').select('*').limit(1);
      
      results.supabaseConnectivity = !error;
      
      if (error) {
        console.error('Supabase connectivity test failed:', error);
      }
    } catch (e) {
      console.error('Supabase import or test failed:', e);
      results.supabaseConnectivity = false;
    }
  } catch (error) {
    console.error('Diagnostic test failed with critical error:', error);
  }
  
  return results;
}
