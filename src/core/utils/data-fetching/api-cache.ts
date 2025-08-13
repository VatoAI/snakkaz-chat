import { useState, useEffect } from 'react';
import useSWR, { SWRConfiguration } from 'swr';

// Global cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>();
const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * Fetcher function with caching
 */
async function cachingFetcher(url: string, options?: RequestInit) {
  // Check cache first
  const cached = apiCache.get(url);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp < DEFAULT_CACHE_TIME)) {
    console.log(`Using cached data for ${url}`);
    return cached.data;
  }
  
  // If not in cache or expired, fetch fresh data
  console.log(`Fetching fresh data for ${url}`);
  const res = await fetch(url, options);
  
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  
  const data = await res.json();
  
  // Store in cache
  apiCache.set(url, { data, timestamp: now });
  
  return data;
}

/**
 * Hook for data fetching with SWR and caching
 */
export function useApiData<T>(
  url: string | null, 
  options?: RequestInit, 
  config?: SWRConfiguration
) {
  return useSWR<T>(
    url, 
    url => cachingFetcher(url, options),
    { 
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      ...config
    }
  );
}

/**
 * Clear API cache
 */
export function clearApiCache(urlPattern?: RegExp) {
  if (urlPattern) {
    // Clear only matching URLs
    for (const key of apiCache.keys()) {
      if (urlPattern.test(key)) {
        apiCache.delete(key);
      }
    }
  } else {
    // Clear entire cache
    apiCache.clear();
  }
}

/**
 * Prefetch data and store in cache
 */
export async function prefetchApiData(urls: string[], options?: RequestInit) {
  const results = await Promise.allSettled(
    urls.map(url => cachingFetcher(url, options))
  );
  
  return results.map((result, index) => ({
    url: urls[index],
    success: result.status === 'fulfilled',
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason : null,
  }));
}
