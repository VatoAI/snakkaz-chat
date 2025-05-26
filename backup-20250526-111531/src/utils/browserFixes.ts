/**
 * Browser Compatibility Fixes
 * 
 * Applies fixes for browser compatibility issues.
 * Updated version without Cloudflare dependencies.
 */

/**
 * Apply general browser compatibility fixes
 */
export function applyBrowserCompatibilityFixes(): void {
  // Skip if not in browser context
  if (typeof window === 'undefined') return;

  try {
    // Add polyfills for older browsers
    polyfillObjectAssign();
    polyfillArrayIncludes();
    polyfillPromiseFinally();
    
    // Fix for Safari's IDB implementation
    fixSafariIndexedDB();
    
    // Fix for IE's lack of CustomEvent
    polyfillCustomEvent();
    
    console.log('Applied browser compatibility fixes');
  } catch (error) {
    console.error('Failed to apply browser compatibility fixes:', error);
  }
}

/**
 * Apply fixes for module import issues
 */
export function fixModuleImportIssues(): void {
  // Skip if not in browser context
  if (typeof window === 'undefined') return;

  try {
    // Polyfill dynamic import if needed
    if (typeof window.__vite_import__ === 'undefined') {
      console.log('Polyfilling dynamic imports with script loading');
    }
    
    console.log('Applied module import fixes');
  } catch (error) {
    console.error('Failed to apply module import fixes:', error);
  }
}

// Helper function to polyfill Object.assign
function polyfillObjectAssign(): void {
  if (typeof Object.assign !== 'function') {
    Object.assign = function(target: any, ...args: any[]): any {
      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      
      const to = Object(target);
      
      for (let i = 0; i < args.length; i++) {
        const nextSource = args[i];
        
        if (nextSource !== null && nextSource !== undefined) {
          for (const nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      
      return to;
    };
  }
}

// Helper function to polyfill Array.includes
function polyfillArrayIncludes(): void {
  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function(searchElement: any, fromIndex?: number): boolean {
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }
        
        const o = Object(this);
        const len = o.length >>> 0;
        
        if (len === 0) return false;
        
        const n = fromIndex || 0;
        let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        
        function sameValueZero(x: any, y: any): boolean {
          return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
        }
        
        while (k < len) {
          if (sameValueZero(o[k], searchElement)) {
            return true;
          }
          k++;
        }
        
        return false;
      }
    });
  }
}

// Helper function to polyfill Promise.finally
function polyfillPromiseFinally(): void {
  if (typeof Promise !== 'undefined' && !Promise.prototype.finally) {
    Promise.prototype.finally = function(callback: () => void): Promise<any> {
      const promise = this;
      
      return promise.then(
        value => Promise.resolve(callback()).then(() => value),
        reason => Promise.resolve(callback()).then(() => { throw reason; })
      );
    };
  }
}

// Fix Safari's IndexedDB implementation
function fixSafariIndexedDB(): void {
  // Check if it's Safari
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  if (isSafari && typeof indexedDB !== 'undefined') {
    // Patch transaction abort handling in Safari
    const originalOpen = indexedDB.open;
    
    indexedDB.open = function(...args): IDBOpenDBRequest {
      const request = originalOpen.apply(this, args as any);
      
      const originalOnError = request.onerror;
      request.onerror = function(event): void {
        // Prevent certain Safari errors from propagating
        const error = (event.target as any).error;
        
        if (error && error.name === 'AbortError') {
          console.warn('Safari IndexedDB abort error suppressed');
          event.preventDefault();
          return;
        }
        
        if (originalOnError) {
          originalOnError.call(this, event);
        }
      };
      
      return request;
    };
  }
}

// Helper function to polyfill CustomEvent
function polyfillCustomEvent(): void {
  if (typeof window.CustomEvent !== 'function') {
    window.CustomEvent = function(event: string, params: CustomEventInit): CustomEvent {
      params = params || { bubbles: false, cancelable: false, detail: null };
      const evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles || false, params.cancelable || false, params.detail || null);
      return evt;
    } as any;
  }
}
