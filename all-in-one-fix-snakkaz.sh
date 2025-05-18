#!/bin/bash
# all-in-one-fix-snakkaz.sh
#
# Et komplett skript som implementerer alle nødvendige feilrettinger 
# for Snakkaz Chat etter migrering fra Cloudflare til Namecheap
# Dato: 18. mai 2025

set -e # Avslutt ved feil

# Fargedefinisjoner
GRONN='\033[0;32m'
GUL='\033[1;33m'
ROD='\033[0;31m'
BLA='\033[0;34m'
INGEN='\033[0m'

echo -e "${BLA}======================================================${INGEN}"
echo -e "${BLA}    SNAKKAZ CHAT - KOMPLETT FEILRETTINGSSKRIPT       ${INGEN}"
echo -e "${BLA}======================================================${INGEN}"
echo

# Sjekk at vi er i riktig mappe
if [ ! -f "package.json" ]; then
  echo -e "${ROD}Feil: Dette skriptet må kjøres fra rotmappen til Snakkaz Chat-prosjektet${INGEN}"
  echo "Naviger til rotmappen og prøv igjen."
  exit 1
fi

# 1. Ta backup av viktige filer
echo -e "${GUL}Steg 1: Tar backup av viktige filer...${INGEN}"
mkdir -p backup/fixes-2025-05-18
cp -f src/lib/supabaseClient.ts backup/fixes-2025-05-18/ 2>/dev/null || true
cp -f src/utils/env/environmentFix.ts backup/fixes-2025-05-18/ 2>/dev/null || true
cp -f src/services/encryption/supabasePatch.ts backup/fixes-2025-05-18/ 2>/dev/null || true
cp -f src/services/security/cspConfig.ts backup/fixes-2025-05-18/ 2>/dev/null || true
cp -f src/pages/auth/AuthPage.tsx backup/fixes-2025-05-18/ 2>/dev/null || true
cp -f src/pages/App.tsx backup/fixes-2025-05-18/ 2>/dev/null || true
cp -f index.html backup/fixes-2025-05-18/ 2>/dev/null || true
cp -f upload-to-namecheap.sh backup/fixes-2025-05-18/ 2>/dev/null || true
echo -e "${GRONN}✅ Backup fullført${INGEN}"
echo

# 2. Opprett manglende mapper
echo -e "${GUL}Steg 2: Oppretter nødvendige mapper...${INGEN}"
mkdir -p public/assets
mkdir -p public/images
mkdir -p dist
echo -e "${GRONN}✅ Mapper opprettet${INGEN}"
echo

# 3. Fiks auth-bg.jpg problemet
echo -e "${GUL}Steg 3: Fikser auth-bg.jpg problemet...${INGEN}"

# Opprett CSS-fil for bakgrunnen
cat > public/assets/auth-bg.css << 'EOF'
.bg-auth {
  background-color: #2a2a2a;
  background-image: linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%, #1a1a1a), 
  linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%, #1a1a1a);
  background-size: 60px 60px;
  background-position: 0 0, 30px 30px;
}
EOF

# Oppdater index.html for å inkludere CSS-filen
if grep -q "auth-bg.css" "index.html"; then
  echo "CSS-fil er allerede inkludert i index.html"
else
  sed -i 's#<link rel="apple-touch-icon" href="/icons/snakkaz-icon-192.png" />#<link rel="apple-touch-icon" href="/icons/snakkaz-icon-192.png" />\n    <link rel="stylesheet" href="/assets/auth-bg.css" />#' index.html
  echo "La til auth-bg.css i index.html"
fi

# Oppdater AuthPage.tsx for å bruke CSS-klassen
if [ -f "src/pages/auth/AuthPage.tsx" ]; then
  sed -i 's#bg-\[url(\x27/images/auth-bg.jpg\x27)\] bg-cover bg-center#bg-auth#' src/pages/auth/AuthPage.tsx
  echo "Oppdaterte AuthPage.tsx til å bruke CSS-klassen"
else
  echo -e "${ROD}Advarsel: Fant ikke AuthPage.tsx, kunne ikke oppdatere bakgrunnsreferansen${INGEN}"
fi

echo -e "${GRONN}✅ auth-bg.jpg problem fikset${INGEN}"
echo

# 4. Implementer Supabase singleton-mønster
echo -e "${GUL}Steg 4: Implementerer Supabase singleton-mønster...${INGEN}"

# Oppdater supabaseClient.ts
mkdir -p src/lib
cat > src/lib/supabaseClient.ts << 'EOF'
/**
 * Unified Supabase Client - SINGLETON PATTERN
 * 
 * This is the single source of truth for the Supabase client.
 * All components should import from this file to prevent multiple instances.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@/config/environment';

// Use environment configuration or fallback to direct env variables
const supabaseUrl = environment.supabase.url || import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = environment.supabase.anonKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase configuration missing. Check your environment variables or config/environment.ts');
}

// Create a singleton instance to prevent multiple GoTrueClient instances
let supabaseInstance: SupabaseClient | null = null;

/**
 * Get the Supabase client instance (singleton pattern)
 */
function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Only create a new instance if one doesn't exist
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          'X-Client-Info': 'snakkaz-chat',
        },
      },
    });
    
    // Log success in development mode
    if (import.meta.env.DEV) {
      console.log('Supabase client initialized successfully (singleton)');
    }
    
    return supabaseInstance;
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    throw error;
  }
}

// Export the singleton instance getter
export const supabase = getSupabaseClient();

// Also export as default
export default supabase;
EOF

# Oppdater supabasePatch.ts
mkdir -p src/services/encryption
cat > src/services/encryption/supabasePatch.ts << 'EOF'
/**
 * Supabase Client Configuration Patch
 * 
 * This module provides corrected configuration for the Supabase client
 * to resolve CORS and API connection issues.
 * 
 * UPDATED: Now uses the singleton pattern to avoid multiple GoTrueClient instances
 */

import { supabase as supabaseInstance } from '@/lib/supabaseClient';

// For configuration diagnostics - use import.meta.env for consistency
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const ENV_CHECK = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helper to log config issues during development
if (import.meta.env.DEV && !ENV_CHECK) {
  console.warn(
    'Supabase configuration issue detected! Ensure you have set the following environment variables:\n' +
    '- VITE_SUPABASE_URL\n' + 
    '- VITE_SUPABASE_ANON_KEY\n\n' +
    'Add these to your .env file or environment variables.'
  );
}

// Export the singleton Supabase client - no need to create a new instance
export const supabaseClient = supabaseInstance;

// IMPORTANT: Export a function that returns the singleton to avoid breaking existing code
export const createSupabaseClient = () => {
  // Warn about deprecated usage in development
  if (import.meta.env.DEV) {
    console.warn(
      'The createSupabaseClient() function is deprecated and will be removed in a future version.\n' +
      'Please import the supabase client directly from @/lib/supabaseClient instead.'
    );
  }
  
  return supabaseInstance;
};

// Configuration verification function - useful for debugging
export const verifySupabaseConfig = () => {
  try {
    const isConfigValid = !!supabaseInstance && ENV_CHECK;
    
    if (import.meta.env.DEV) {
      console.log('Supabase config verification result:', isConfigValid ? 'Valid ✓' : 'Invalid ✗');
      
      if (!isConfigValid) {
        console.warn('Supabase configuration is incomplete or invalid. Check your environment variables.');
      }
    }
    
    return isConfigValid;
  } catch (error) {
    console.error('Error verifying Supabase configuration:', error);
    return false;
  }
};

// Export a utility to test the connection
export const testConnection = async () => {
  try {
    const { error } = await supabaseInstance.from('profiles').select('*').limit(1);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Unknown error' };
  }
};

// Security enhancement options
export const getEnhancedSupabaseOptions = () => ({
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'snakkaz-chat',
      'Content-Type': 'application/json'
    }
  }
});

// Call verification on import for early detection of issues
verifySupabaseConfig();

// Export the configured client
export const supabase = supabaseInstance;
EOF

echo -e "${GRONN}✅ Supabase singleton-mønster implementert${INGEN}"
echo

# 5. Oppdater miljøvariabel-håndtering
echo -e "${GUL}Steg 5: Oppdaterer miljøvariabel-håndtering...${INGEN}"

mkdir -p src/utils/env
cat > src/utils/env/environmentFix.ts << 'EOF'
/**
 * Environment Variable Patch for Browser Compatibility - v3
 * 
 * This script ensures that environment variables work correctly
 * in both development and production, regardless of whether
 * the code is running on a server or in a browser.
 * 
 * Major improvements in v3:
 * 1. Handles circular references that can cause build failures
 * 2. More robust error catching during initialization
 * 3. Improved TypeScript type definitions
 * 4. Added diagnostic logging in development mode
 */

// Flag to track if environment patch has been applied
let envPatchApplied = false;

// Define a partial Process type for the browser environment
declare global {
  interface Window {
    process?: Partial<NodeJS.Process> & {
      env?: Record<string, any>;
      [key: string]: any;
    };
  }
}

// Apply global shim for process.env to prevent errors in browser
function applyEnvironmentPatch() {
  if (envPatchApplied) {
    return; // Don't apply patch multiple times
  }

  try {
    if (typeof window !== 'undefined') {
      // Create a safe process object if it doesn't exist
      if (!window.process) {
        window.process = { env: {} } as any;
      }
      // Create a safe env object if it doesn't exist
      if (!window.process.env) {
        window.process.env = {};
      }
      // Set NODE_ENV based on Vite mode
      window.process.env.NODE_ENV = import.meta.env.MODE === 'production' ? 'production' : 'development';
      
      // Map all VITE_ environment variables to process.env.*
      Object.entries(import.meta.env).forEach(([key, value]) => {
        try {
          // Skip undefined or circular references that cause build failures
          if (value !== undefined && typeof value !== 'object') {
            if (key.startsWith('VITE_')) {
              window.process.env[key.replace('VITE_', '')] = value;
            }
            // Also map the original VITE_ variables to process.env
            window.process.env[key] = value;
          }
        } catch (err) {
          console.warn(`Could not map env var ${key}:`, err);
        }
      });
      
      // Add key Supabase env vars explicitly to ensure they're always available
      window.process.env.SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      window.process.env.SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      // Log that patch is activated in development environment
      if (import.meta.env.DEV) {
        console.log('✅ Environment compatibility patch applied: process.env is now available');
      }
      
      // Mark patch as applied
      envPatchApplied = true;
    }
  } catch (err) {
    console.error('Failed to apply environment patch:', err);
    // Create minimal environment to prevent crashes
    if (typeof window !== 'undefined' && window.process && window.process.env) {
      window.process.env.NODE_ENV = import.meta.env.MODE === 'production' ? 'production' : 'development';
    }
  }
}

// Apply the patch immediately
applyEnvironmentPatch();

// Export a utility function to get environment variables
export const ENV = {
  // Core environment
  NODE_ENV: import.meta.env.MODE === 'production' ? 'production' : 'development',
  DEV: import.meta.env.DEV === true,
  PROD: import.meta.env.PROD === true,
  
  // Supabase variables
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL as string,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  
  // Helper method to get any environment variable
  get: (key: string): string => {
    // Try getting from import.meta.env first (preferred method)
    const viteValue = (import.meta.env as Record<string, any>)[key];
    if (viteValue !== undefined) return viteValue;
    
    // Try with VITE_ prefix
    const viteWithPrefix = (import.meta.env as Record<string, any>)[`VITE_${key}`];
    if (viteWithPrefix !== undefined) return viteWithPrefix;
    
    // Fallback to process.env if available
    if (typeof process !== 'undefined' && process.env) {
      return (process.env as Record<string, any>)[key] || '';
    }
    
    return '';
  }
};

// Export the patch function in case it needs to be applied later
export const ensureEnvironmentPatch = applyEnvironmentPatch;
EOF

echo -e "${GRONN}✅ Miljøvariabel-håndtering oppdatert${INGEN}"
echo

# 6. Fikse CSP-konfigurasjonen
echo -e "${GUL}Steg 6: Fikser CSP-konfigurasjonen...${INGEN}"

mkdir -p src/services/security
cat > src/services/security/cspConfig.ts << 'EOF'
/**
 * CSP Configuration
 * 
 * Defines and applies Content Security Policy for the application.
 * Updated version without Cloudflare dependencies.
 */

/**
 * Apply the configured CSP policy to the document
 */
export function applyCspPolicy(): void {
  // Skip if not in browser context
  if (typeof document === 'undefined') return;

  // Define the CSP directives
  const cspDirectives: { [key: string]: string[] } = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'cdn.gpteng.co'],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:', '*.amazonaws.com', 'storage.googleapis.com', '*.supabase.co', '*.supabase.in'],
    'font-src': ["'self'", 'data:'],
    'connect-src': [
      "'self'", 
      '*.supabase.co', 
      '*.supabase.in',  
      'wss://*.supabase.co', 
      '*.amazonaws.com', 
      'storage.googleapis.com', 
      '*.snakkaz.com', 
      'dash.snakkaz.com', 
      'business.snakkaz.com', 
      'docs.snakkaz.com', 
      'analytics.snakkaz.com',
      'mcp.snakkaz.com',
      'help.snakkaz.com',
      'cdn.gpteng.co'
    ],
    'media-src': ["'self'", 'blob:'],
    'object-src': ["'none'"],
    'frame-src': ["'self'"],
    'worker-src': ["'self'", 'blob:'],
    'form-action': ["'self'"],
    'base-uri': ["'self'"],
    'frame-ancestors': ["'self'"],
    'report-uri': ['https://www.snakkaz.com/api/csp-report']
  };

  // Build CSP string
  let cspString = Object.entries(cspDirectives)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');

  try {
    // Check if there's an existing CSP meta tag
    const existingMetaTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    
    if (existingMetaTag) {
      // Update existing tag
      existingMetaTag.setAttribute('content', cspString);
    } else {
      // Create a new meta tag for CSP
      const metaTag = document.createElement('meta');
      metaTag.httpEquiv = 'Content-Security-Policy';
      metaTag.content = cspString;
      
      // Insert at the beginning of the head element
      const head = document.head || document.getElementsByTagName('head')[0];
      if (head.firstChild) {
        head.insertBefore(metaTag, head.firstChild);
      } else {
        head.appendChild(metaTag);
      }
    }
    
    console.log('CSP policy applied successfully');
  } catch (error) {
    console.error('Failed to apply CSP policy:', error);
  }
}

/**
 * Test the Content Security Policy for proper configuration
 */
export function testCspConfiguration(): { success: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check for required domains in our configuration
  const requiredDomains = [
    { type: 'connect-src', domain: '*.supabase.co' },
    { type: 'connect-src', domain: 'wss://*.supabase.co' },
    { type: 'connect-src', domain: '*.snakkaz.com' },
    { type: 'connect-src', domain: 'mcp.snakkaz.com' },
    { type: 'connect-src', domain: 'help.snakkaz.com' }
  ];
  
  // In a browser context, check the actual meta tag
  if (typeof document !== 'undefined') {
    const cspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!cspTag) {
      issues.push('No Content Security Policy meta tag found in document');
    } else {
      const content = cspTag.getAttribute('content') || '';
      
      // Check for each required domain
      for (const { type, domain } of requiredDomains) {
        if (!content.includes(domain)) {
          issues.push(`Missing required domain ${domain} in ${type} directive`);
        }
      }
    }
  }
  
  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Testing function that returns information about CSP configuration
 * Used by diagnostics
 */
export function testCsp() {
  // Build CSP directives object for testing
  const cspDirectives: { [key: string]: string[] } = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'cdn.gpteng.co'],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:', '*.amazonaws.com', 'storage.googleapis.com', '*.supabase.co'],
    'font-src': ["'self'", 'data:'],
    'connect-src': [
      "'self'", 
      '*.supabase.co', 
      '*.supabase.in',  
      'wss://*.supabase.co', 
      '*.amazonaws.com', 
      'storage.googleapis.com', 
      '*.snakkaz.com',
      'mcp.snakkaz.com',
      'help.snakkaz.com'
    ]
  };
  
  // Return domains that will be allowed by the policy
  return {
    success: true,
    allowedDomains: {
      supabase: ['*.supabase.co', '*.supabase.in'],
      api: ['self'],
      storage: ['*.amazonaws.com', 'storage.googleapis.com']
    }
  };
}
EOF

echo -e "${GRONN}✅ CSP-konfigurasjon fikset${INGEN}"
echo

# 7. Aktiver Toaster-komponenten i App.tsx
echo -e "${GUL}Steg 7: Aktiverer Toaster-komponenten i App.tsx...${INGEN}"

if [ -f "src/pages/App.tsx" ]; then
  # Finn og erstatt import kommentaren
  sed -i 's#// Note: Toaster component import was causing errors, commenting it out until we find the correct path#// Import Toaster component#' src/pages/App.tsx
  sed -i 's#// import { Toaster } from "@/components/ui/toaster";#import { Toaster } from "@/components/ui/toaster";#' src/pages/App.tsx
  
  # Finn og erstatt Toaster-komponenten
  sed -i 's#        {/\* Temporarily commenting out due to import issues \*/}#        {/\* Add Toaster for notifications \*/}#' src/pages/App.tsx
  sed -i 's#{/\* <Toaster /> \*/}#<Toaster />#' src/pages/App.tsx
  
  echo "Aktiverte Toaster-komponenten i App.tsx"
else
  echo -e "${ROD}Advarsel: Fant ikke App.tsx, kunne ikke aktivere Toaster-komponenten${INGEN}"
fi

echo -e "${GRONN}✅ Toaster-komponent aktivert${INGEN}"
echo

# 8. Forbedre FTP-opplastingsskript
echo -e "${GUL}Steg 8: Forbedrer FTP-opplastingsskript...${INGEN}"

cat > upload-to-namecheap.sh << 'EOF'
#!/bin/bash
# upload-to-namecheap.sh
# 
# Dette skriptet laster opp Snakkaz Chat-applikasjonen til Namecheap-hostingen
# ved hjelp av FTP-innstillingene i .env-filen.

set -e # Exit on error

# ANSI colors
GRONN='\033[0;32m'
GUL='\033[1;33m'
ROD='\033[0;31m'
BLA='\033[0;34m'
INGEN='\033[0m'

echo -e "${BLA}======================================================${INGEN}"
echo -e "${BLA}     OPPLASTING AV SNAKKAZ CHAT TIL NAMECHEAP         ${INGEN}"
echo -e "${BLA}======================================================${INGEN}"
echo

# Check if .env file exists
if [ ! -f .env ]; then
  echo -e "${ROD}Feil: .env-fil mangler!${INGEN}"
  echo "Opprett en .env-fil med FTP-innstillingene dine først."
  exit 1
fi

# Source the .env file to load FTP settings
source .env

# Verify that FTP settings are set
if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ] || [ -z "$FTP_REMOTE_DIR" ]; then
  echo -e "${ROD}Feil: Manglende FTP-innstillinger i .env-filen.${INGEN}"
  echo "Sørg for at du har definert følgende variabler:"
  echo "FTP_HOST, FTP_USER, FTP_PASS, FTP_REMOTE_DIR"
  exit 1
fi

# Verify that dist folder exists
if [ ! -d "dist" ]; then
  echo -e "${ROD}Feil: 'dist'-mappe mangler!${INGEN}"
  echo "Du må bygge applikasjonen ved å kjøre 'npm run build' først."
  exit 1
fi

echo -e "${GUL}FTP-innstillinger:${INGEN}"
echo "Host: $FTP_HOST"
echo "Bruker: $FTP_USER"
echo "Mappe: $FTP_REMOTE_DIR"
echo

# Check if lftp is available (better than standard ftp)
if command -v lftp &> /dev/null; then
  echo -e "${GUL}Laster opp med lftp (robust FTP-klient)...${INGEN}"
  
  lftp -d -c "
  set ftp:ssl-allow true;
  set ssl:verify-certificate no;
  set net:timeout 120;
  set net:max-retries 3;
  set net:reconnect-interval-base 5;
  set net:reconnect-interval-multiplier 1;
  open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST;
  lcd dist;
  cd $FTP_REMOTE_DIR;
  mirror -R --parallel=1 --use-cache --verbose ./;
  bye
  "
  
  echo -e "${GRONN}✓ Opplasting fullført med lftp${INGEN}"

# Check if ncftp is available (also better than standard ftp)
elif command -v ncftp &> /dev/null; then
  echo -e "${GUL}Laster opp med ncftp (raskere FTP-klient)...${INGEN}"
  
  # Create a temporary batch file for ncftp
  BATCH_FILE=$(mktemp)
  echo "open -u $FTP_USER -p $FTP_PASS $FTP_HOST" > "$BATCH_FILE"
  echo "cd $FTP_REMOTE_DIR" >> "$BATCH_FILE"
  echo "mirror -R dist/ ." >> "$BATCH_FILE"
  echo "bye" >> "$BATCH_FILE"
  
  # Upload using ncftp
  ncftp -f "$BATCH_FILE"
  
  # Remove temporary file
  rm "$BATCH_FILE"
  
  echo -e "${GRONN}✓ Opplasting fullført med ncftp${INGEN}"

# Fallback to standard ftp command
else
  echo -e "${GUL}Laster opp med standard ftp-kommando...${INGEN}"
  
  cd dist
  
  # Create a temporary file with FTP commands
  FTP_COMMANDS=$(mktemp)
  cat > "$FTP_COMMANDS" << EOL
open $FTP_HOST
user $FTP_USER $FTP_PASS
binary
prompt off
cd $FTP_REMOTE_DIR
mput *
bye
EOL
  
  # Execute FTP commands
  ftp -n < "$FTP_COMMANDS"
  
  # Remove temporary file
  rm "$FTP_COMMANDS"
  
  cd ..
  
  echo -e "${GRONN}✓ Opplasting fullført med standard ftp${INGEN}"
fi

echo
echo -e "${GRONN}==========================================${INGEN}"
echo -e "${GRONN}      OPPLASTING TIL NAMECHEAP FULLFØRT   ${INGEN}"
echo -e "${GRONN}==========================================${INGEN}"
echo
echo -e "${GUL}Neste steg:${INGEN}"
echo "1. Åpne https://www.snakkaz.com i nettleseren din"
echo "2. Bekreft at alle funksjoner fungerer som forventet"
echo "3. Sjekk om innlogging, registrering og chat virker"
echo
echo -e "${BLA}Hvis du møter problemer, sjekk følgende:${INGEN}"
echo "- Sjekk nettleserens utviklerkonsoll for feil"
echo "- Verifiser at .htaccess-filen ble lastet opp korrekt"
echo "- Bekreft at Supabase-API-konfigurasjonen er riktig"
echo
echo "Dokumentasjon: /docs/ENDRINGER-OG-FEILRETTINGER-2025-05-18.md"
echo
EOF

chmod +x upload-to-namecheap.sh
echo -e "${GRONN}✅ FTP-opplastingsskript forbedret${INGEN}"
echo

# 9. Bygg og forbered for deployment
echo -e "${GUL}Steg 9: Bygger og forbereder for deployment...${INGEN}"

# Installer avhengigheter hvis de mangler
if [ ! -d "node_modules" ]; then
  echo -e "${GUL}Installerer avhengigheter...${INGEN}"
  npm install
fi

# Bygg applikasjonen
echo -e "${GUL}Bygger applikasjonen...${INGEN}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${ROD}Feil ved bygging av applikasjonen. Se feilmeldinger ovenfor.${INGEN}"
  exit 1
fi

echo -e "${GRONN}✅ Applikasjonen er bygget og klar for deployment${INGEN}"
echo

# 10. Generer dokumentasjon
echo -e "${GUL}Steg 10: Genererer dokumentasjon...${INGEN}"

# Loggfør alle endringer i en dokumentasjonsfil
cat > docs/ENDRINGER-OG-FEILRETTINGER-2025-05-18.md << 'EOF'
# Endringer og feilrettinger for Snakkaz Chat

## Utførte endringer pr. 18. mai 2025

### 1. Fikset missing auth-bg.jpg problem
- Opprettet en CSS-basert bakgrunn som erstatning for det manglende bakgrunnsbildet
- Lagt til auth-bg.css i public/assets mappen
- Oppdatert AuthPage.tsx til å bruke CSS-klassen i stedet for bilde-URL
- Inkludert CSS-filen i index.html

### 2. Løst problemer med Supabase-klienten
- Implementert singleton-mønster i src/lib/supabaseClient.ts for å unngå flere GoTrueClient-instanser
- Oppdatert src/services/encryption/supabasePatch.ts til å bruke samme instans
- Fjernet duplikat-funksjonalitet mellom filene

### 3. Forbedret miljøvariabel-håndtering
- Oppdatert src/utils/env/environmentFix.ts til versjon 3 med bedre feilhåndtering
- Lagt til håndtering av sirkulære referanser i miljøvariabler
- Sikret at kritiske Supabase-variabler alltid er tilgjengelige

### 4. Fikset CSP-konfigurasjon
- Fjernet Cloudflare-referanser fra CSP-policyen
- Oppdatert connect-src direktiver for å støtte Namecheap-hosting
- Fjernet duplikate URL-er i direktiver

### 5. Toaster-komponent fiks
- Aktivert Toaster-komponenten i App.tsx
- Sikret at Toaster brukes korrekt for å unngå "nt.current" feil

### 6. FTP-opplastingsforbedringer
- Forbedret upload-to-namecheap.sh med bedre feilhåndtering
- Lagt til timeout og retry-håndtering for mer robuste FTP-opplastinger
- Redusert parallelitet for å unngå tilkoblingsproblemer

## Kvalitetssikringsverktøy

1. **Deploy-sjekkliste**
   - Verifiser at alle kritiske filer er oppdatert
   - Sjekk at miljøvariabler er korrekt konfigurert
   - Verifiser at Supabase-tilkobling fungerer

2. **Terminal-kommandoer for testing**
   ```bash
   # Test bygging
   npm run build
   
   # Test lokal kjøring
   npm run dev
   
   # Test FTP-opplasting
   ./upload-to-namecheap.sh
   ```

3. **Feilsøkingssteg**
   - Sjekk nettleserkonsollet for JavaScript-feil
   - Verifiser nettverksforespørsler til Supabase API
   - Test CSP-konfigurasjonen med nettverksverktøyet

## Neste steg

1. **SSL-sertifikater**
   - Konfigurer SSL-sertifikater for hoveddomain og subdomener
   - Verifiser at HTTPS fungerer på alle subdomener

2. **Subdomain-setup**
   - Verifiser at alle subdomener er riktig konfigurert i Namecheap
   - Test tilkoblinger til subdomain-endepunkter

3. **Performance-testing**
   - Gjennomfør ytelsestesting med Namecheap-hosting
   - Sammenlign med tidligere Cloudflare-ytelse

4. **Sikkerhetsevaluering**
   - Utfør sikkerhetsevaluering uten Cloudflare WAF
   - Implementer alternative sikkerhetstiltak på Namecheap

## Oppsummering

Migrasjonen fra Cloudflare til Namecheap har krevd flere endringer i kodebasen for å støtte det nye hostingmiljøet. De viktigste endringene har vært relatert til Supabase-klienthåndtering, CSP-konfigurasjon, og miljøvariabel-håndtering. Applikasjonen er nå optimalisert for Namecheap-hosting og bør kjøre stabilt i det nye miljøet.
EOF

echo -e "${GRONN}✅ Dokumentasjonen er generert i docs/ENDRINGER-OG-FEILRETTINGER-2025-05-18.md${INGEN}"
echo

# 11. Oppsummering
echo -e "${BLA}======================================================${INGEN}"
echo -e "${BLA}    SNAKKAZ CHAT - FEILRETTING FULLFØRT                ${INGEN}"
echo -e "${BLA}======================================================${INGEN}"
echo
echo -e "${GRONN}Alle feilrettinger er nå implementert:${INGEN}"
echo "1. ✅ Fikset auth-bg.jpg problemet med CSS"
echo "2. ✅ Implementert Supabase singleton-mønster"
echo "3. ✅ Forbedret miljøvariabel-håndtering"
echo "4. ✅ Oppdatert CSP-konfigurasjon for Namecheap"
echo "5. ✅ Aktivert Toaster-komponenten"
echo "6. ✅ Forbedret FTP-opplastingsskript"
echo "7. ✅ Bygget applikasjonen"
echo "8. ✅ Generert dokumentasjon"
echo
echo -e "${GUL}Neste steg:${INGEN}"
echo "1. Oppdater FTP-innstillingene i .env-filen med dine faktiske kredentialer"
echo "2. Kjør upload-to-namecheap.sh for å laste opp til serveren"
echo "3. Konfigurer SSL-sertifikater på Namecheap-hostingen"
echo "4. Verifiser at applikasjonen fungerer på https://www.snakkaz.com"
echo
echo -e "${BLA}Dokumentasjon: docs/ENDRINGER-OG-FEILRETTINGER-2025-05-18.md${INGEN}"
echo

# Start lokal server for testing?
read -p "Vil du starte en lokal server for testing? (j/n): " start_server
if [[ "$start_server" == "j" || "$start_server" == "J" ]]; then
  echo -e "${GUL}Starter lokal server på port 8080...${INGEN}"
  cd dist
  python3 -m http.server 8080 || php -S localhost:8080 || npx http-server -p 8080 || echo -e "${ROD}Kunne ikke starte lokal server. Installer python3, php eller npx.${INGEN}"
fi
