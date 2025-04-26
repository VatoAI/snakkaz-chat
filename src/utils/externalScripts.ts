/**
 * Utility for managing external scripts and analytics
 * Provides graceful handling of script loading errors
 */

// List of external scripts to manage
interface ExternalScript {
  id: string;
  src: string;
  async?: boolean;
  defer?: boolean;
  attributes?: Record<string, string>;
  enabled: boolean;
}

// Script configurations
const EXTERNAL_SCRIPTS: ExternalScript[] = [
  {
    id: 'cloudflare-insights',
    src: 'https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015',
    async: true,
    defer: true,
    attributes: {
      'data-cf-beacon': '{"token": "your-token-here"}'
    },
    enabled: import.meta.env.PROD // Only enable in production by default
  }
];

/**
 * Loads external scripts with error handling
 */
export function loadExternalScripts(): void {
  // Skip if not in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  
  // Filter console errors for external scripts
  setupErrorFilters();

  // Load each enabled script
  EXTERNAL_SCRIPTS.filter(script => script.enabled).forEach(loadScript);
}

/**
 * Set up error filters to suppress specific console errors
 */
function setupErrorFilters(): void {
  // Create a list of domains to filter errors for
  const domainsToFilter = [
    'cloudflareinsights.com',
    'business.snakkaz.com',
    'docs.snakkaz.com',
    'ai-dash.snakkaz.com', 
    'dash.snakkaz.com',
    'analytics.snakkaz.com'
  ];
  
  // Store original console methods
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  // Override console.error
  console.error = function(...args) {
    // Check if error is related to external scripts
    if (args.some(arg => {
      if (typeof arg !== 'string') return false;
      return domainsToFilter.some(domain => arg.includes(domain));
    })) {
      // Suppress the error
      return;
    }
    
    // Otherwise, call original method
    return originalConsoleError.apply(console, args);
  };
  
  // Override console.warn similarly
  console.warn = function(...args) {
    // Check if warning is related to external scripts
    if (args.some(arg => {
      if (typeof arg !== 'string') return false;
      return domainsToFilter.some(domain => arg.includes(domain));
    })) {
      // Suppress the warning
      return;
    }
    
    // Otherwise, call original method
    return originalConsoleWarn.apply(console, args);
  };
  
  // Create custom event listener to catch resource error events
  window.addEventListener('error', (event) => {
    // Check if error is for an external script
    if (event && event.target && 'src' in event.target) {
      const src = (event.target as HTMLScriptElement).src;
      if (domainsToFilter.some(domain => src.includes(domain))) {
        // Prevent the error from showing in console
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
    }
  }, true);
}

/**
 * Loads a single script with error handling
 * @param script Script configuration
 */
function loadScript(script: ExternalScript): void {
  // Check if script already exists
  if (document.getElementById(script.id)) {
    return;
  }
  
  try {
    // Create script element
    const scriptElement = document.createElement('script');
    scriptElement.id = script.id;
    scriptElement.src = script.src;
    
    // Add attributes
    if (script.async) scriptElement.async = true;
    if (script.defer) scriptElement.defer = true;
    
    if (script.attributes) {
      Object.entries(script.attributes).forEach(([key, value]) => {
        scriptElement.setAttribute(key, value);
      });
    }
    
    // Add error handler
    scriptElement.onerror = () => {
      // Silently handle errors
      if (import.meta.env.DEV) {
        console.debug(`[Dev] External script failed to load: ${script.id} - this is normal in development`);
      }
    };
    
    // Append to document
    document.head.appendChild(scriptElement);
  } catch (error) {
    // Silently fail
    if (import.meta.env.DEV) {
      console.debug(`[Dev] Failed to add script ${script.id}: ${error}`);
    }
  }
}

// Automatically load scripts when imported in browser environment
if (typeof window !== 'undefined') {
  // Delay loading to ensure page loads first
  setTimeout(loadExternalScripts, 2000);
}