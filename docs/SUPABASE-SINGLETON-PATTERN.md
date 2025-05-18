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
