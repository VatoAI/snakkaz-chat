/**
 * Asset Fallback Utilities
 * 
 * Provides fallback mechanisms for critical assets.
 * Updated version without Cloudflare dependencies.
 */

// URLs to preload (moved from original assetFallback.ts)
const CRITICAL_ASSETS = [
  '/assets/logo.svg',
  '/assets/favicon.ico',
  '/assets/fonts/rubik-v28-latin-regular.woff2',
  '/assets/fonts/rubik-v28-latin-500.woff2'
];

/**
 * Preload critical local assets
 */
export function preloadLocalAssets(): void {
  // Skip if not in browser context
  if (typeof document === 'undefined') return;

  try {
    CRITICAL_ASSETS.forEach(assetPath => {
      const link = document.createElement('link');
      link.rel = 'preload';
      
      // Determine correct 'as' attribute based on file extension
      const ext = assetPath.split('.').pop()?.toLowerCase();
      
      if (ext === 'svg' || ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'webp') {
        link.as = 'image';
      } else if (ext === 'woff' || ext === 'woff2' || ext === 'ttf' || ext === 'otf') {
        link.as = 'font';
        link.setAttribute('crossorigin', 'anonymous');
      } else if (ext === 'js') {
        link.as = 'script';
      } else if (ext === 'css') {
        link.as = 'style';
      }
      
      link.href = assetPath;
      document.head.appendChild(link);
    });
    
    console.log('Preloaded critical assets');
  } catch (error) {
    console.error('Failed to preload critical assets:', error);
  }
}

/**
 * Register handlers for asset loading fallbacks
 */
export function registerAssetFallbackHandlers(): void {
  // Skip if not in browser context
  if (typeof document === 'undefined') return;

  try {
    // Handle image loading errors
    document.addEventListener('error', (event) => {
      const target = event.target as HTMLElement;
      
      // Check if it's an image element with an error
      if (target.tagName === 'IMG' && event.type === 'error') {
        const img = target as HTMLImageElement;
        const src = img.src;
        
        // Skip if already processed or no src
        if (!src || img.dataset.fallbackApplied === 'true') {
          return;
        }
        
        console.warn(`Image failed to load: ${src}`);
        
        // Mark as processed
        img.dataset.fallbackApplied = 'true';
        
        // Apply fallback
        if (src.includes('avatar') || src.includes('profile')) {
          img.src = '/assets/default-avatar.png';
        } else {
          img.src = '/assets/image-placeholder.svg';
        }
      }
    }, true);
    
    // Handle font loading errors
    document.fonts.addEventListener('loadingerror', (event) => {
      console.warn('Font failed to load:', event);
    });
    
    console.log('Registered asset fallback handlers');
  } catch (error) {
    console.error('Failed to register asset fallback handlers:', error);
  }
}
