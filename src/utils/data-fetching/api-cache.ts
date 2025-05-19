/**
 * API Caching Utilities for Snakkaz Chat
 * These utilities provide a simple caching layer for API data
 */
import { LRUCache } from '../performance/memo-helpers';

// Types
interface CacheOptions {
  maxAge?: number;      // Maximum age in milliseconds
  staleWhileRevalidate?: boolean; // Return stale data while fetching fresh data
  cacheBustKey?: string; // Key to force cache busting
}

interface CachedData<T> {
  data: T;
  timestamp: number;
}

// In-memory cache for API responses
const apiCache = new LRUCache<string, CachedData<any>>(100);

// Enhanced fetch with caching
export async function cachedFetch<T>(
  url: string,
  options: RequestInit = {},
  cacheOptions: CacheOptions = {}
): Promise<T> {
  const cacheKey = generateCacheKey(url, options, cacheOptions.cacheBustKey);
  const maxAge = cacheOptions.maxAge || 5 * 60 * 1000; // Default: 5 minutes
  
  // Check if we have a valid cached response
  const cachedResponse = apiCache.get(cacheKey);
  const now = Date.now();
  
  if (cachedResponse && now - cachedResponse.timestamp < maxAge) {
    return cachedResponse.data;
  }
  
  // If stale data exists and staleWhileRevalidate is enabled, return stale data and revalidate
  if (cachedResponse && cacheOptions.staleWhileRevalidate) {
    // Revalidate in the background
    fetchAndCache<T>(url, options, cacheKey)
      .catch(error => console.error('Background revalidation failed:', error));
    
    // Return stale data immediately
    return cachedResponse.data;
  }
  
  // No valid cache or no staleWhileRevalidate, fetch fresh data
  return fetchAndCache<T>(url, options, cacheKey);
}

// Helper function to fetch and cache data
async function fetchAndCache<T>(
  url: string,
  options: RequestInit,
  cacheKey: string
): Promise<T> {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Cache the fresh data
  apiCache.put(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  return data;
}

// Generate a unique cache key for a request
function generateCacheKey(
  url: string,
  options: RequestInit,
  cacheBustKey?: string
): string {
  // Extract relevant parts of the request for the cache key
  const method = options.method || 'GET';
  const body = options.body ? JSON.stringify(options.body) : '';
  const headers = options.headers ? JSON.stringify(options.headers) : '';
  
  // Combine parts into a single string
  const keyParts = [method, url, body, headers];
  if (cacheBustKey) {
    keyParts.push(cacheBustKey);
  }
  
  return keyParts.join('|');
}

// Clear the entire cache
export function clearApiCache(): void {
  for (const key of (apiCache as any).cache.keys()) {
    (apiCache as any).cache.delete(key);
  }
}

// Clear specific cache entries by URL pattern
export function clearApiCacheByPattern(urlPattern: string | RegExp): void {
  const pattern = typeof urlPattern === 'string'
    ? new RegExp(urlPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    : urlPattern;
  
  for (const key of (apiCache as any).cache.keys()) {
    const parts = key.split('|');
    const url = parts[1]; // URL is the second part of our cache key
    
    if (pattern.test(url)) {
      (apiCache as any).cache.delete(key);
    }
  }
}

// Hook for React components to use cachedFetch with automatic cleanup
export function useCachedData<T>(
  url: string | null,
  options: RequestInit = {},
  cacheOptions: CacheOptions = {}
): { data: T | null; loading: boolean; error: Error | null; refetch: () => Promise<void> } {
  const [state, setState] = React.useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({
    data: null,
    loading: true,
    error: null
  });
  
  const fetchData = React.useCallback(async () => {
    if (!url) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await cachedFetch<T>(url, options, cacheOptions);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error instanceof Error ? error : new Error(String(error)) });
    }
  }, [url, JSON.stringify(options), JSON.stringify(cacheOptions)]);
  
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const refetch = React.useCallback(async () => {
    // Force cache busting by adding a timestamp
    const bustOptions: CacheOptions = {
      ...cacheOptions,
      cacheBustKey: Date.now().toString()
    };
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await cachedFetch<T>(url!, options, bustOptions);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error : new Error(String(error)) 
      }));
    }
  }, [url, options, cacheOptions]);
  
  return { ...state, refetch };
}
