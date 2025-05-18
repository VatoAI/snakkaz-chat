#!/bin/bash
# fix-multiple-supabase-client.sh
#
# This script fixes the "Multiple GoTrueClient instances detected" warning in Snakkaz Chat

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Fix Multiple Supabase Client Issue  ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Check we're in the right directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}Error: This script must be run from the root directory of the Snakkaz Chat project${NC}"
  echo "Navigate to the root directory and try again."
  exit 1
fi

# Create a backup directory
echo -e "${YELLOW}Creating backup of existing files...${NC}"
mkdir -p backup/supabase-fix
TIMESTAMP=$(date "+%Y%m%d%H%M%S")

# Backup existing files
if [ -f "src/lib/supabaseClient.ts" ]; then
  cp src/lib/supabaseClient.ts backup/supabase-fix/supabaseClient-$TIMESTAMP.ts
fi

# Find all files that might initialize Supabase
echo -e "${YELLOW}Searching for files that create Supabase clients...${NC}"
CLIENT_FILES=$(grep -r "createClient(" --include="*.ts" --include="*.tsx" --include="*.js" src | grep -v "supabaseClient.ts" | cut -d':' -f1 | sort | uniq)

if [ -n "$CLIENT_FILES" ]; then
  echo -e "Found potential Supabase client initialization in:"
  for file in $CLIENT_FILES; do
    echo "  - $file"
    # Backup these files
    cp "$file" "backup/supabase-fix/$(basename $file)-$TIMESTAMP"
  done
  echo
else
  echo -e "${GREEN}No additional direct client initializations found.${NC}"
  echo
fi

# Create a singleton Supabase client
echo -e "${YELLOW}Creating singleton Supabase client...${NC}"

# Create directory if it doesn't exist
mkdir -p src/lib

# Create the singleton client file
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

echo -e "${GREEN}✅ Created singleton Supabase client${NC}"

# Update other client initialization files
if [ -n "$CLIENT_FILES" ]; then
  echo -e "${YELLOW}Updating files to use the singleton client...${NC}"
  
  for file in $CLIENT_FILES; do
    # Skip files that might already be using the singleton pattern
    if grep -q "supabaseClient.ts" "$file"; then
      echo "  - $file (already imports from supabaseClient.ts)"
      continue
    fi
    
    # Create backup
    cp "$file" "$file.bak"
    
    # Replace direct client creation
    echo "  - Updating $file"
    
    # Get file extension
    ext="${file##*.}"
    
    if [ "$ext" = "ts" ] || [ "$ext" = "tsx" ]; then
      # Use TypeScript import
      sed -i '1i import { supabase } from '\''@/lib/supabaseClient'\'';' "$file"
      # Add comment explaining the change
      sed -i '1i // Using singleton Supabase client to prevent "Multiple GoTrueClient instances" warning' "$file"
    else
      # Use JavaScript import
      sed -i '1i const { supabase } = require('\''@/lib/supabaseClient'\'');' "$file"
      # Add comment explaining the change
      sed -i '1i // Using singleton Supabase client to prevent "Multiple GoTrueClient instances" warning' "$file"
    fi
    
    # Comment out any direct client creation to prevent errors
    sed -i 's/const supabase = createClient(/\/\/ REPLACED: const supabase = createClient(/g' "$file"
    sed -i 's/const supabaseClient = createClient(/\/\/ REPLACED: const supabaseClient = createClient(/g' "$file"
    
    echo -e "    ${GREEN}✓${NC} Updated"
  done
  
  echo -e "${GREEN}✅ Updated files to use singleton client${NC}"
else
  echo -e "${GREEN}✅ No files need to be updated${NC}"
fi

# Fix any remaining supabasePatch.ts file
if [ -f "src/services/encryption/supabasePatch.ts" ]; then
  echo -e "${YELLOW}Updating supabasePatch.ts to use singleton client...${NC}"
  
  # Backup the file
  cp src/services/encryption/supabasePatch.ts backup/supabase-fix/supabasePatch-$TIMESTAMP.ts
  
  # Create updated version
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

// Export a utility to test the connection
export const testConnection = async () => {
  try {
    const { error } = await supabaseInstance.from('profiles').select('*').limit(1);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// Export the configured client
export const supabase = supabaseInstance;
EOF

  echo -e "${GREEN}✅ Updated supabasePatch.ts${NC}"
fi

# Create documentation file
echo -e "${YELLOW}Creating documentation...${NC}"
mkdir -p docs

cat > docs/SUPABASE-SINGLETON-PATTERN.md << 'EOF'
# Supabase Singleton Pattern Implementation

## Problem: Multiple GoTrueClient Instances

The Snakkaz Chat application was experiencing warnings about multiple GoTrueClient instances being detected. This occurs when the `createClient()` function from Supabase is called multiple times in different parts of the application.

Example warning:
```
Multiple GoTrueClient instances detected. It's recommended to use just one instance.
```

This can lead to various issues:
- Authentication state inconsistencies
- Increased network traffic
- Memory leaks
- Performance degradation

## Solution: Singleton Pattern

To fix this issue, we've implemented the Singleton pattern for the Supabase client:

1. Created a single source of truth in `src/lib/supabaseClient.ts`
2. Ensured only one instance of the client is created
3. Updated all imports to use this singleton instance
4. Provided backward compatibility for existing code

## Implementation Details

### 1. Singleton Client (`src/lib/supabaseClient.ts`)

```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@/config/environment';

// Use environment configuration or fallback to direct env variables
const supabaseUrl = environment.supabase.url || import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = environment.supabase.anonKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a singleton instance to prevent multiple GoTrueClient instances
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Only create a new instance if one doesn't exist
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    global: { headers: { 'X-Client-Info': 'snakkaz-chat' } },
  });
  
  return supabaseInstance;
}

// Export the singleton instance
export const supabase = getSupabaseClient();
```

### 2. Compatibility Layer (`src/services/encryption/supabasePatch.ts`)

```typescript
import { supabase as supabaseInstance } from '@/lib/supabaseClient';

// Export the singleton client
export const supabaseClient = supabaseInstance;

// Backward compatibility function
export const createSupabaseClient = () => {
  if (import.meta.env.DEV) {
    console.warn('createSupabaseClient() is deprecated. Import from @/lib/supabaseClient instead.');
  }
  return supabaseInstance;
};
```

## How to Use the Singleton Client

Throughout the application, import the Supabase client like this:

```typescript
// Correct way to import Supabase client
import { supabase } from '@/lib/supabaseClient';

// Then use it as normal
const { data, error } = await supabase.auth.getSession();
```

Avoid creating new instances with `createClient()` directly.

## Benefits of This Approach

1. **Consistent State**: Authentication state is shared across the entire application
2. **Reduced Resource Usage**: Only one connection is maintained
3. **Simplified Testing**: Mocking a single instance is easier
4. **Better Performance**: Less overhead from multiple client initializations

## Troubleshooting

If you still see the "Multiple GoTrueClient instances" warning:

1. Check for any remaining direct imports of `@supabase/supabase-js` with `createClient()`
2. Ensure all components are importing from `@/lib/supabaseClient`
3. Verify that there are no conditional initializations in your code
4. Check for modules that might be bundled separately

Run this command to find potential issues:
```bash
grep -r "createClient(" --include="*.ts" --include="*.tsx" --include="*.js" src
```
EOF

echo -e "${GREEN}✅ Created documentation in docs/SUPABASE-SINGLETON-PATTERN.md${NC}"

# Final steps
echo
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Multiple Supabase Client Fix Complete${NC}"
echo -e "${BLUE}========================================${NC}"
echo
echo -e "${GREEN}The fix has been applied successfully:${NC}"
echo "1. Created a singleton Supabase client in src/lib/supabaseClient.ts"
if [ -n "$CLIENT_FILES" ]; then
  echo "2. Updated files that were creating their own clients"
fi
if [ -f "src/services/encryption/supabasePatch.ts" ]; then
  echo "3. Updated supabasePatch.ts to use the singleton client"
fi
echo "4. Created documentation in docs/SUPABASE-SINGLETON-PATTERN.md"
echo
echo -e "${YELLOW}Backups are stored in backup/supabase-fix/${NC}"
echo
echo -e "${GREEN}Next steps:${NC}"
echo "1. Build and test your application to verify the fix works"
echo "2. Check the browser console for any remaining warnings"
echo "3. If issues persist, refer to the troubleshooting section in the documentation"
echo "4. For any custom components that use Supabase directly, update their imports"
echo
echo -e "${BLUE}For detailed instructions, see: docs/SUPABASE-SINGLETON-PATTERN.md${NC}"
