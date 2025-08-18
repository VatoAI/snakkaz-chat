/**
 * API utilities for Snakkaz Chat
 * 
 * Dette er en høynivå wrapper rundt Supabase-kall som legger til:
 * - Ytelsesovervåking
 * - Standardisert feilhåndtering
 * - Retry-logikk for midlertidige nettverksfeil
 * - Felles respons-formatering
 * - API caching for forbedret ytelse
 * 
 * All kommunikasjon med backend bør gå gjennom disse funksjonene.
 */
import { supabase } from '@/integrations/supabase/client';
import { performanceMonitor } from '@/services/performanceMonitor';
import { errorReporting, ErrorCategory, ErrorSeverity } from '@/services/errorReporting';

// Importere API caching funksjonalitet
import { cachedFetch, clearApiCache, clearApiCacheByPattern } from '@/utils/data-fetching/api-cache';

// Standardkonfigurasjon for API-kall
const API_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // ms
  timeout: 15000, // 15 sekunder
  enableCache: true, // Aktiver caching som standard
  cacheMaxAge: 5 * 60 * 1000, // 5 minutter standard cache tid
};

// Cache nøkkelgenerator for supabase kall
const generateCacheKey = (tableName: string, query: any, options: any) => {
  return `${tableName}:${JSON.stringify(query)}:${JSON.stringify(options)}`;
};

// Export cache kontroll funksjoner
export { clearApiCache, clearApiCacheByPattern };

/**
 * Generisk respons-type for API-kall
 */
export interface ApiResponse<T = any> {
  data: T | null;
  error: Error | null;
  status: number;
  metadata?: {
    processingTime: number;
    retries?: number;
    cached?: boolean;
  };
}

/**
 * Timeout Promise helper
 */
const createTimeout = (ms: number) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms);
  });
};

/**
 * Wrapper for Supabase select med ytelsesovervåking
 */
export async function fetchData<T = unknown>(
  tableName: string,
  query: unknown,
  options: {
    retries?: number;
    timeout?: number;
    metricName?: string;
    enableCache?: boolean;
    cacheMaxAge?: number;
    cacheBustKey?: string;
  } = {}
): Promise<ApiResponse<T>> {
  const startTime = performance.now();
  const retries = options.retries ?? API_CONFIG.maxRetries;
  const timeout = options.timeout ?? API_CONFIG.timeout;
  const metricName = options.metricName ?? `fetch:${tableName}`;
  const enableCache = options.enableCache ?? API_CONFIG.enableCache;
  const cacheMaxAge = options.cacheMaxAge ?? API_CONFIG.cacheMaxAge;
  
  // Generate a cache key for this request
  const cacheKey = generateCacheKey(tableName, query, options);
  
  let currentTry = 0;
  let lastError: Error | null = null;
  let isCached = false;
  
  // Check cache if enabled
  if (enableCache) {
    try {
      // Try to get from cache using the utility from api-cache.ts
      const cachedResult = await cachedFetch<{ data: T; error: Error | null }>(
        cacheKey,
        async () => {
          // This function will be called if the cache misses
          const result = await Promise.race([
            query,
            createTimeout(timeout)
          ]);
          return result;
        },
        { maxAge: cacheMaxAge, cacheBustKey: options.cacheBustKey }
      );
      
      if (cachedResult) {
        isCached = true;
        const duration = performance.now() - startTime;
        
        // Log performance for cached response
        performanceMonitor.measureApiCall(`${metricName}:cached`, duration, {
          table: tableName,
          success: !cachedResult.error,
          cached: true
        });
        
        return {
          data: cachedResult.data,
          error: cachedResult.error,
          status: cachedResult.error ? 500 : 200,
          metadata: {
            processingTime: duration,
            cached: true
          }
        };
      }
    } catch (err) {
      // If cache mechanism fails, continue with normal fetch
      console.warn('Cache mechanism failed:', err);
    }
  }
  
  // Normal fetch with retry logic
  while (currentTry <= retries) {
    try {
      currentTry++;
      
      // Race Supabase kall mot timeout
      const result = await Promise.race([
        query,
        createTimeout(timeout)
      ]);
      
      const duration = performance.now() - startTime;
      
      // Loggfør ytelsen
      performanceMonitor.measureApiCall(metricName, duration, {
        table: tableName,
        success: !result.error,
        retries: currentTry - 1
      });
      
      // Cache the successful result if enabled
      if (enableCache && !result.error) {
        try {
          // Store in cache using our utility
          await cachedFetch(cacheKey, async () => result, { 
            maxAge: cacheMaxAge,
            storeOnly: true
          });
        } catch (err) {
          // Just log if caching fails
          console.warn('Failed to store in cache:', err);
        }
      }
      
      // Returner resultatet
      return {
        data: result.data,
        error: result.error ? new Error(result.error.message) : null,
        status: result.error ? (result.error.code === 'PGRST116' ? 404 : 500) : 200,
        metadata: {
          processingTime: duration,
          retries: currentTry - 1,
          cached: false
        }
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Hvis dette var siste forsøk, bryt
      if (currentTry > retries) {
        break;
      }
      
      // Hvis det er en timeout eller nettverksfeil, prøv igjen
      if (error instanceof Error && (
        error.message.includes('timeout') || 
        error.message.includes('network') ||
        error.message.includes('connection')
      )) {
        // Eksponentiell backoff
        const delay = API_CONFIG.retryDelay * Math.pow(2, currentTry - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      } else {
        // For andre feil, ikke prøv igjen
        break;
      }
    }
  }
  
  const duration = performance.now() - startTime;
  
  // Loggfør feil
  performanceMonitor.measureApiCall(metricName, duration, {
    table: tableName,
    success: false,
    error: lastError?.message,
    retries: currentTry - 1
  });
  
  // Rapporter feil
  if (lastError) {
    errorReporting.reportError(
      lastError,
      ErrorCategory.DATABASE,
      ErrorSeverity.ERROR,
      { table: tableName, operation: 'select', retries: currentTry - 1 }
    );
  }
  
  // Returner feilresultat
  return {
    data: null,
    error: lastError,
    status: 500,
    metadata: {
      processingTime: duration,
      retries: currentTry - 1
    }
  };
}

/**
 * Hent data fra en tabell
 */
export async function fetchFromTable<T = any>(
  tableName: string,
  options: {
    columns?: string;
    filters?: Record<string, any>;
    limit?: number;
    orderBy?: { column: string; ascending?: boolean };
    retries?: number;
    metricName?: string;
  } = {}
): Promise<ApiResponse<T[]>> {
  try {
    let query = supabase.from(tableName).select(options.columns || '*');
    
    // Legg til filtre hvis de finnes
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    // Legg til sortering hvis det er spesifisert
    if (options.orderBy) {
      query = query.order(
        options.orderBy.column,
        { ascending: options.orderBy.ascending !== false }
      );
    }
    
    // Legg til grense hvis den er spesifisert
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    return await fetchData<T[]>(
      tableName,
      query,
      {
        retries: options.retries,
        metricName: options.metricName
      }
    );
  } catch (error) {
    errorReporting.reportError(
      error instanceof Error ? error : new Error(String(error)),
      ErrorCategory.DATABASE,
      ErrorSeverity.ERROR,
      { table: tableName, operation: 'fetchFromTable' }
    );
    
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
      status: 500
    };
  }
}

/**
 * Hent en enkelt rad fra en tabell basert på ID
 */
export async function fetchById<T = any>(
  tableName: string,
  id: string,
  options: {
    columns?: string;
    retries?: number;
    metricName?: string;
  } = {}
): Promise<ApiResponse<T>> {
  try {
    const query = supabase
      .from(tableName)
      .select(options.columns || '*')
      .eq('id', id)
      .single();
    
    return await fetchData<T>(
      tableName,
      query,
      {
        retries: options.retries,
        metricName: options.metricName || `fetchById:${tableName}`
      }
    );
  } catch (error) {
    errorReporting.reportError(
      error instanceof Error ? error : new Error(String(error)),
      ErrorCategory.DATABASE,
      ErrorSeverity.ERROR,
      { table: tableName, operation: 'fetchById', id }
    );
    
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
      status: 500
    };
  }
}

/**
 * Lagre data i en tabell
 */
export async function insertData<T = any>(
  tableName: string,
  data: Record<string, any> | Record<string, any>[],
  options: {
    retries?: number;
    metricName?: string;
  } = {}
): Promise<ApiResponse<T>> {
  const startTime = performance.now();
  
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .insert(data)
      .select();
    
    const duration = performance.now() - startTime;
    
    // Loggfør ytelsen
    performanceMonitor.measureApiCall(
      options.metricName || `insert:${tableName}`,
      duration,
      {
        table: tableName,
        success: !error,
        recordCount: Array.isArray(data) ? data.length : 1
      }
    );
    
    return {
      data: result as T,
      error: error ? new Error(error.message) : null,
      status: error ? 500 : 200,
      metadata: {
        processingTime: duration
      }
    };
  } catch (error) {
    const duration = performance.now() - startTime;
    
    // Loggfør feil
    performanceMonitor.measureApiCall(
      options.metricName || `insert:${tableName}`,
      duration,
      {
        table: tableName,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        recordCount: Array.isArray(data) ? data.length : 1
      }
    );
    
    // Rapporter feil
    errorReporting.reportError(
      error instanceof Error ? error : new Error(String(error)),
      ErrorCategory.DATABASE,
      ErrorSeverity.ERROR,
      { table: tableName, operation: 'insert' }
    );
    
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
      status: 500,
      metadata: {
        processingTime: duration
      }
    };
  }
}

/**
 * Oppdater data i en tabell
 */
export async function updateData<T = any>(
  tableName: string,
  data: Record<string, any>,
  filters: Record<string, any>,
  options: {
    retries?: number;
    metricName?: string;
  } = {}
): Promise<ApiResponse<T>> {
  const startTime = performance.now();
  
  try {
    let query = supabase.from(tableName).update(data);
    
    // Legg til filtre
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { data: result, error } = await query.select();
    
    const duration = performance.now() - startTime;
    
    // Loggfør ytelsen
    performanceMonitor.measureApiCall(
      options.metricName || `update:${tableName}`,
      duration,
      {
        table: tableName,
        success: !error,
        filters: Object.keys(filters).join(',')
      }
    );
    
    return {
      data: result as T,
      error: error ? new Error(error.message) : null,
      status: error ? 500 : 200,
      metadata: {
        processingTime: duration
      }
    };
  } catch (error) {
    const duration = performance.now() - startTime;
    
    // Loggfør feil
    performanceMonitor.measureApiCall(
      options.metricName || `update:${tableName}`,
      duration,
      {
        table: tableName,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        filters: Object.keys(filters).join(',')
      }
    );
    
    // Rapporter feil
    errorReporting.reportError(
      error instanceof Error ? error : new Error(String(error)),
      ErrorCategory.DATABASE,
      ErrorSeverity.ERROR,
      { table: tableName, operation: 'update', filters: JSON.stringify(filters) }
    );
    
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
      status: 500,
      metadata: {
        processingTime: duration
      }
    };
  }
}

/**
 * Slett data fra en tabell
 */
export async function deleteData<T = any>(
  tableName: string,
  filters: Record<string, any>,
  options: {
    retries?: number;
    metricName?: string;
  } = {}
): Promise<ApiResponse<T>> {
  const startTime = performance.now();
  
  try {
    let query = supabase.from(tableName).delete();
    
    // Legg til filtre
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { data: result, error } = await query.select();
    
    const duration = performance.now() - startTime;
    
    // Loggfør ytelsen
    performanceMonitor.measureApiCall(
      options.metricName || `delete:${tableName}`,
      duration,
      {
        table: tableName,
        success: !error,
        filters: Object.keys(filters).join(',')
      }
    );
    
    return {
      data: result as T,
      error: error ? new Error(error.message) : null,
      status: error ? 500 : 200,
      metadata: {
        processingTime: duration
      }
    };
  } catch (error) {
    const duration = performance.now() - startTime;
    
    // Loggfør feil
    performanceMonitor.measureApiCall(
      options.metricName || `delete:${tableName}`,
      duration,
      {
        table: tableName,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        filters: Object.keys(filters).join(',')
      }
    );
    
    // Rapporter feil
    errorReporting.reportError(
      error instanceof Error ? error : new Error(String(error)),
      ErrorCategory.DATABASE,
      ErrorSeverity.ERROR,
      { table: tableName, operation: 'delete', filters: JSON.stringify(filters) }
    );
    
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
      status: 500,
      metadata: {
        processingTime: duration
      }
    };
  }
}