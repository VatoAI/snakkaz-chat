/**
 * Snakkaz Chat Encryption & Security Module Entry Point
 * 
 * Dette er hovedimport-punktet for Snakkaz Chat kryptering og sikkerhet.
 * Importerer og re-eksporterer alle nødvendige funksjoner for enkel inkludering
 * i applikasjonen.
 */

// Importer for lokal bruk i denne filen
import { initializeSnakkazChat, runDiagnostics } from './initialize';
import { runDiagnosticTest, testBrowserCompatibility } from './diagnosticTest';

// Hovedfunksjonalitet for oppsett (re-eksporterer for bruk i andre filer)
export { initializeSnakkazChat, runDiagnostics } from './initialize';

// Authentication components
export { LoginButton, AuthButton } from './LoginButton';

// CSP og sikkerhet
export { applyCspPolicy, buildCspPolicy, testContentSecurityPolicy } from './cspConfig';
export { unblockPingRequests, fixCloudflareCorsSecurity, checkContentSecurityPolicy, testSupabaseConnection } from './corsTest';

// Nettverksresurser og fallbacks
export { registerAssetFallbackHandlers, preloadLocalAssets } from './assetFallback';

// E2EE og kryptering
export { testGroupE2EE } from './e2eeTestUtility';

// Testing og diagnostikk
export { runDiagnosticTest, testBrowserCompatibility } from './diagnosticTest';

// Cloudflare integrasjon
export { CLOUDFLARE_CONFIG, isCloudflareConfigured } from './cloudflareConfig';
export { cfTools } from './cloudflareManagement';
export * as CloudflareApi from './cloudflareApi';

// Enhanced Cloudflare security
export {
  enhancedEncrypt,
  enhancedDecrypt,
  setupSessionTimeout,
  checkSessionTimeout,
  resetSessionTimeout,
  recordFailedAuthAttempt,
  resetAuthAttempts,
  isAuthLocked,
  getLockoutRemainingMinutes
} from './securityEnhancements';

// Nettleserfiks
export { applyBrowserCompatibilityFixes, fixModuleImportIssues } from './browserFixes';

// Nyttige funksjoner
export { testConnection } from './supabasePatch';

// Analytics
export { loadCloudflareAnalytics, initializeAnalytics } from './analyticsLoader';

// Meta Tag Fixes
export { fixDeprecatedMetaTags } from './metaTagFixes';

// System Health Checks
export { 
  runSystemHealthCheck, 
  checkHealth,
  verifyCspConfiguration,
  checkSriRemoval,
  testPingRequestBlocker
} from './systemHealthCheck';

/**
 * Initialiser Snakkaz Chat sikkerhet og kryptering
 * 
 * Dette er en praktisk funksjon som kan kalles tidlig i applikasjonsoppstarten.
 * Den aktiverer CSP, fallback-håndtering og blokkerer problematiske ping-forespørsler.
 */
export function setupSnakkazSecurity() {
  try {
    // Bruk initializeSnakkazChat fra den eksisterende importen
    initializeSnakkazChat();
    
    console.log('✅ Snakkaz sikkerhet og kryptering initialisert');
    return true;
  } catch (error) {
    console.error('❌ Feil ved initialisering av Snakkaz sikkerhet:', error);
    return false;
  }
}

/**
 * Kjør full diagnosetesting
 */
export function runFullDiagnostics() {
  return runDiagnosticTest();
}

// Eksporter standardfunksjon for enkel import og bruk
export default setupSnakkazSecurity;
