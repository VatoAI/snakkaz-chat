/**
 * useApiCache - React hook for API data fetching with caching
 * Performance optimized hook for data fetching in Snakkaz Chat
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LRUCache } from '@/utils/performance/memo-helpers';

// Types
interface ApiCacheOptions {
  maxAge?: number;
  staleWhileRevalidate?: boolean;
  disableCache?: boolean;
  refetchInterval?: number | null;
  onError?: (error: Error) => void;
  select?: (data: any) => any;
}

interface ApiCacheResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
}

// In-memory API cache
const apiCache = new LRUCache<string, { data: any; timestamp: number }>(100);

/**
 * Hook for fetching and caching Supabase data
 */
export function useSupabaseQuery<T>(
  tableName: string,
  query: (supabase: typeof supabase) => Promise<{ data: T | null; error: any }>,
  options: ApiCacheOptions = {}
): ApiCacheResult<T> {
  const {
    maxAge = 5 * 60 * 1000, // 5 minutes
    staleWhileRevalidate = true,
    disableCache = false,
    refetchInterval = null,
    onError,
    select
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const queryRef = useRef(query);
  
  // Function to generate a cache key
  const getCacheKey = useCallback(() => {
    return `${tableName}:${queryRef.current.toString()}`;
  }, [tableName]);

  const executeQuery = useCallback(async (skipCache = false): Promise<void> => {
    const cacheKey = getCacheKey();
    
    if (!skipCache && !disableCache) {
      // Check if we have a valid cached response
      const cachedResponse = apiCache.get(cacheKey);
      const now = Date.now();
      
      if (cachedResponse && now - cachedResponse.timestamp < maxAge) {
        setData(select ? select(cachedResponse.data) : cachedResponse.data);
        setError(null);
        setIsLoading(false);
        return;
      }
      
      // If we have stale data and staleWhileRevalidate is true, use it while fetching fresh data
      if (cachedResponse && staleWhileRevalidate) {
        setData(select ? select(cachedResponse.data) : cachedResponse.data);
        setIsLoading(true);
      }
    }
    
    try {
      const result = await query(supabase);
      
      if (result.error) {
        throw result.error;
      }
      
      const processedData = select ? select(result.data) : result.data;
      setData(processedData);
      
      // Cache the result if caching is enabled
      if (!disableCache) {
        apiCache.put(cacheKey, {
          data: result.data,
          timestamp: Date.now()
        });
      }
      
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [disableCache, maxAge, staleWhileRevalidate, select, onError, getCacheKey]);

  // Function to manually refetch data
  const refetch = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    await executeQuery(true); // Skip cache when manually refetching
  }, [executeQuery]);

  // Set up initial data fetching
  useEffect(() => {
    executeQuery();
    
    // Set up refetch interval if specified
    if (refetchInterval) {
      intervalRef.current = setInterval(() => {
        executeQuery();
      }, refetchInterval);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [executeQuery, refetchInterval]);

  return {
    data,
    error,
    isLoading,
    isSuccess: !!data && !error,
    isError: !!error,
    refetch
  };
}

/**
 * Hook for fetching data from a Supabase table with filters
 */
export function useSupabaseTable<T>(
  tableName: string,
  {
    columns = '*',
    filters = {},
    order,
    limit,
    options = {}
  }: {
    columns?: string;
    filters?: Record<string, unknown>;
    order?: { column: string; ascending?: boolean };
    limit?: number;
    options?: ApiCacheOptions;
  }
): ApiCacheResult<T[]> {
  return useSupabaseQuery<T[]>(
    tableName,
    async (supabase) => {
      let query = supabase.from(tableName).select(columns);
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
      
      // Apply ordering
      if (order) {
        query = query.order(order.column, { ascending: order.ascending ?? true });
      }
      
      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }
      
      return await query;
    },
    options
  );
}

/**
 * Hook for fetching a single record by ID
 */
export function useSupabaseRecord<T>(
  tableName: string,
  id: string | number | null,
  {
    columns = '*',
    idField = 'id',
    options = {}
  }: {
    columns?: string;
    idField?: string;
    options?: ApiCacheOptions;
  } = {}
): ApiCacheResult<T> {
  return useSupabaseQuery<T>(
    tableName,
    async (supabase) => {
      if (!id) return { data: null, error: new Error('No ID provided') };
      
      return await supabase
        .from(tableName)
        .select(columns)
        .eq(idField, id)
        .single();
    },
    {
      ...options,
      select: (data) => (Array.isArray(data) && data.length > 0 ? data[0] : data)
    }
  );
}

/**
 * Clear the entire API cache
 */
export function clearApiCache(): void {
  const cacheKeys = [];
  for (const key of (apiCache as any).cache.keys()) {
    cacheKeys.push(key);
  }
  
  for (const key of cacheKeys) {
    apiCache.put(key, undefined as any);
  }
}

/**
 * Clear specific cache entries by table name
 */
export function clearTableCache(tableName: string): void {
  const cacheKeys = [];
  for (const key of (apiCache as any).cache.keys()) {
    if (key.startsWith(`${tableName}:`)) {
      cacheKeys.push(key);
    }
  }
  
  for (const key of cacheKeys) {
    apiCache.put(key, undefined as any);
  }
}
