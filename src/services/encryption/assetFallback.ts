/**
 * Asset Fallback Service
 * 
 * Handles fallbacks for assets when main URLs can't be resolved
 * Provides alternatives for critical resources
 */

// Map of original assets to local/fallback alternatives
const fallbackAssets: Record<string, string> = {
  'https://www.snakkaz.com/assets/supabase-client-8CdlZEUY.js': '/assets/vendor/supabase-client.js',
  'https://snakkaz.com/images/auth-bg.jpg': '/assets/images/auth-bg.jpg',
  'https://www.snakkaz.com/images/auth-bg.jpg': '/assets/images/auth-bg.jpg',
  // Add other assets here as needed
};

/**
 * Register service worker for offline asset handling
 */
export function registerAssetFallbackHandlers() {
  // Only run in browser environment
  if (typeof window === 'undefined') return;

  // Add error handling for asset loading
  document.addEventListener('error', (event) => {
    const target = event.target as HTMLElement;
    
    // Handle script loading errors
    if (target instanceof HTMLScriptElement && target.src) {
      const fallbackSrc = getFallbackForAsset(target.src);
      
      if (fallbackSrc) {
        console.log(`Loading fallback for script: ${target.src}`);
        target.src = fallbackSrc;
        event.preventDefault();
      }
    }
    
    // Handle image loading errors
    if (target instanceof HTMLImageElement && target.src) {
      const fallbackSrc = getFallbackForAsset(target.src);
      
      if (fallbackSrc) {
        console.log(`Loading fallback for image: ${target.src}`);
        target.src = fallbackSrc;
        event.preventDefault();
      } else if (target.src.includes('auth-bg.jpg')) {
        // Special handling for auth-bg.jpg
        console.log(`Using default fallback for auth background`);
        target.src = '/assets/images/auth-bg.jpg';
        event.preventDefault();
      }
    }
  }, true); // Capture phase to catch before reaching the element

  // Pre-check critical assets
  precheckCriticalAssets();
}

/**
 * Preload local versions of assets
 */
export function preloadLocalAssets() {
  // Create link elements for critical assets
  Object.values(fallbackAssets).forEach(assetPath => {
    // Skip if not a local asset
    if (assetPath.startsWith('http')) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = assetPath.endsWith('.js') ? 'script' : 
              assetPath.endsWith('.css') ? 'style' : 'fetch';
    link.href = assetPath;
    
    document.head.appendChild(link);
  });
}

/**
 * Get fallback URL for an asset
 */
export function getFallbackForAsset(originalUrl: string): string | null {
  // Check exact match
  if (fallbackAssets[originalUrl]) {
    return fallbackAssets[originalUrl];
  }
  
  // Check for partial matches (handle versioned files)
  const matchingKey = Object.keys(fallbackAssets).find(key => 
    originalUrl.includes(key.split('/').slice(0, -1).join('/'))
  );
  
  return matchingKey ? fallbackAssets[matchingKey] : null;
}

/**
 * Pre-check critical assets and load fallbacks if needed
 */
async function precheckCriticalAssets() {
  // Check supabase client availability
  if (typeof window !== 'undefined') {
    try {
      // Try to fetch the resource with a HEAD request
      const response = await fetch('https://www.snakkaz.com/assets/supabase-client-8CdlZEUY.js', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      
      // If successful, nothing more to do
      console.log('Supabase client is available online');
    } catch (error) {
      console.warn('Online supabase client not available, switching to local fallback');
      loadFallbackSupabaseClient();
    }
  }
}

/**
 * Load fallback Supabase client
 */
function loadFallbackSupabaseClient() {
  const script = document.createElement('script');
  script.src = fallbackAssets['https://www.snakkaz.com/assets/supabase-client-8CdlZEUY.js'];
  script.async = true;
  document.head.appendChild(script);
  
  console.log('Loaded local fallback for Supabase client');
}

/**
 * Create local asset directory if needed (for development)
 */
export async function ensureLocalAssets() {
  if (typeof window === 'undefined') return;
  
  // In development, ensure local assets directory exists
  if (process.env.NODE_ENV === 'development') {
    // Just log a reminder, can't create directories from browser
    console.log('Remember to create the /assets/vendor directory and copy required fallback assets there');
  }
}
