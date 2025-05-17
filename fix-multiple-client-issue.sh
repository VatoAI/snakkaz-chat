#!/bin/bash
# Snakkaz Chat Fix: Supabase Multiple Client Fix
# This script fixes the issues with multiple GoTrueClient instances in the Snakkaz Chat application
#
# Created: May 17, 2025
# Author: GitHub Copilot

set -e # Exit on any error

echo "⚙️ Snakkaz Chat - Multiple GoTrueClient Fix Script"
echo "====================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: This script must be run from the root of the Snakkaz Chat project"
  echo "Please navigate to the project root directory and try again."
  exit 1
fi

# Create a backup of key files
echo "📦 Creating backups of key files..."
mkdir -p backup/multiple-client-fix
cp -f src/lib/supabaseClient.ts backup/multiple-client-fix/ 2>/dev/null || true
cp -f src/utils/env/environmentFix.ts backup/multiple-client-fix/ 2>/dev/null || true
cp -f src/services/encryption/supabasePatch.ts backup/multiple-client-fix/ 2>/dev/null || true
cp -f src/hooks/useAuth.tsx backup/multiple-client-fix/ 2>/dev/null || true
cp -f src/App.tsx backup/multiple-client-fix/ 2>/dev/null || true
echo "✅ Backups created"

# Update the environment setup
echo "🔧 Updating environment configuration..."
cat > src/utils/env/environmentFix.ts << 'EOF'
/**
 * Environment Variable Patch for Browser Compatibility - v2
 * 
 * This script ensures that environment variables work correctly
 * in both development and production, regardless of whether
 * the code is running on a server or in a browser.
 * 
 * The key improvements in this version:
 * 1. More robust window.process detection and configuration
 * 2. Better error handling for environment variable access
 * 3. Safe initialization to prevent multiple patching
 */

// Flag to track if environment patch has been applied
let envPatchApplied = false;

// Apply global shim for process.env to prevent errors in browser
function applyEnvironmentPatch() {
  if (envPatchApplied) {
    return; // Don't apply patch multiple times
  }

  if (typeof window !== 'undefined') {
    // Create a safe process object if it doesn't exist
    if (!window.process) {
      window.process = {};
    }
    
    // Create a safe env object if it doesn't exist
    if (!window.process.env) {
      window.process.env = {};
    }
    
    // Set NODE_ENV based on Vite mode
    window.process.env.NODE_ENV = import.meta.env.MODE === 'production' ? 'production' : 'development';
    
    // Map all VITE_ environment variables to process.env.*
    Object.entries(import.meta.env).forEach(([key, value]) => {
      if (key.startsWith('VITE_')) {
        window.process.env[key.replace('VITE_', '')] = value;
      }
    });
    
    // Also map the original VITE_ variables to process.env
    Object.entries(import.meta.env).forEach(([key, value]) => {
      window.process.env[key] = value;
    });
    
    // Log that patch is activated in development environment
    if (import.meta.env.DEV) {
      console.log('✅ Environment compatibility patch applied: process.env is now available');
    }
    
    // Mark patch as applied
    envPatchApplied = true;
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
echo "✅ Environment configuration updated"

# Create a singleton Supabase client
echo "🔧 Creating singleton Supabase client..."
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
echo "✅ Singleton Supabase client created"

# Update the supabasePatch.ts file
echo "🔧 Updating Supabase patch..."
cat > src/services/encryption/supabasePatch.ts << 'EOF'
/**
 * Supabase Client Configuration Patch
 * 
 * This module provides corrected configuration for the Supabase client
 * to resolve CORS and API connection issues.
 * 
 * UPDATED: Now uses the singleton pattern to avoid multiple GoTrueClient instances
 */

import { supabase } from '@/lib/supabaseClient';

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
export const supabaseClient = supabase;

// IMPORTANT: Export a function that returns the singleton to avoid breaking existing code
export const createSupabaseClient = () => {
  // Warn about deprecated usage in development
  if (import.meta.env.DEV) {
    console.warn(
      'The createSupabaseClient() function is deprecated and will be removed in a future version.\n' +
      'Please import the supabase client directly from @/lib/supabaseClient instead.'
    );
  }
  
  return supabase;
};

// Configuration verification function - useful for debugging
export const verifySupabaseConfig = () => {
  try {
    const isConfigValid = !!supabase && ENV_CHECK;
    
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
EOF
echo "✅ Supabase patch updated"

# Fix any integrations that might be importing from other places
echo "🔍 Finding and fixing integrations that import Supabase clients..."
find src -type f -name "*.ts" -o -name "*.tsx" | xargs grep -l "@supabase/supabase-js" | while read -r file; do
  # Skip our updated files
  if [[ "$file" == "src/lib/supabaseClient.ts" || "$file" == "src/services/encryption/supabasePatch.ts" ]]; then
    continue
  fi
  
  # Check if the file directly creates a Supabase client
  if grep -q "createClient(" "$file"; then
    echo "⚠️  Found potential direct client creation in: $file"
    echo "   Consider updating this file to import from lib/supabaseClient"
  fi
done
echo "✅ Integration checks complete"

# Ensure main.tsx imports the environment fix first
echo "🔧 Ensuring main.tsx imports environment fix correctly..."
if grep -q "import './utils/env/environmentFix';" "src/main.tsx"; then
  echo "✅ main.tsx already imports environment fix"
else
  # Add the import at the top of the file
  temp_file=$(mktemp)
  echo "// Import environment fix first to ensure process.env is available" > "$temp_file"
  echo "import './utils/env/environmentFix';" >> "$temp_file"
  echo "" >> "$temp_file"
  cat "src/main.tsx" >> "$temp_file"
  mv "$temp_file" "src/main.tsx"
  echo "✅ Added environment fix import to main.tsx"
fi

# Build the application to test for errors
echo "🔨 Building the application to test for errors..."
if command -v bun > /dev/null; then
  bun run build
elif command -v npm > /dev/null; then
  npm run build
else
  echo "⚠️ Neither bun nor npm found, skipping build step"
fi

echo ""
echo "✅ Snakkaz Chat - Multiple GoTrueClient Fix Script completed!"
echo "====================================================="
echo ""
echo "The following files have been updated:"
echo "- src/lib/supabaseClient.ts (singleton Supabase client)"
echo "- src/utils/env/environmentFix.ts (improved environment handling)"
echo "- src/services/encryption/supabasePatch.ts (fixed to use singleton)"
echo ""
echo "To test locally, run:"
echo "  npm run dev"
echo ""
echo "If issues persist, check the following:"
echo "1. Make sure environment variables are correctly set (.env file)"
echo "2. Check for any remaining Supabase client instances in other files"
echo "3. Check browser console for any errors during initialization"
echo ""
echo "Backups of original files are in backup/multiple-client-fix/"
