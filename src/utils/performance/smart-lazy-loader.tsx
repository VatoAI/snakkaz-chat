/**
 * FASE 3 Performance Enhancement: Advanced Component Lazy Loading System
 * 
 * This system builds upon the existing lazy loading infrastructure to provide:
 * - Intelligent component preloading based on user behavior
 * - Performance-aware loading (network and device considerations)
 * - Enhanced error boundaries with retry mechanisms
 * - Bundle size optimization through smart chunking
 */

import React, { lazy, Suspense, useState, useEffect, useCallback } from 'react';
import { routePreloader } from '@/utils/performance/intelligent-preloader';
import { performanceMonitor } from '@/utils/performance/performance-monitor';

interface LazyComponentOptions {
  fallback?: React.ComponentType;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  preloadDelay?: number;
  chunkName?: string;
  priority?: 'high' | 'medium' | 'low';
  networkThreshold?: 'fast' | 'medium' | 'slow';
}

interface ComponentCache {
  [key: string]: {
    component: React.LazyExoticComponent<React.ComponentType<any>>;
    loadPromise?: Promise<any>;
    loaded: boolean;
    error?: Error;
    retryCount: number;
  };
}

// Enhanced loading fallback with better UX
const EnhancedLoader = ({ chunkName, priority }: { chunkName?: string; priority?: string }) => (
  <div className="flex items-center justify-center min-h-[200px] p-4">
    <div className="flex flex-col items-center space-y-3">
      {/* Smart loading indicator based on priority */}
      <div className={`animate-spin rounded-full border-2 border-t-transparent ${
        priority === 'high' ? 'h-8 w-8 border-cybergold-500' :
        priority === 'medium' ? 'h-6 w-6 border-cyberblue-500' :
        'h-4 w-4 border-cyberdark-400'
      }`} />
      
      {/* Context-aware loading message */}
      <div className="text-sm text-cyberdark-400 text-center">
        {priority === 'high' ? 'Laster hovedkomponent...' :
         priority === 'medium' ? 'Laster...' :
         'Forbereder...'}
        {chunkName && (
          <div className="text-xs text-cyberdark-500 mt-1">
            {chunkName}
          </div>
        )}
      </div>
    </div>
  </div>
);

// Enhanced error boundary with retry mechanism
const EnhancedErrorFallback = ({ 
  error, 
  retry, 
  chunkName 
}: { 
  error: Error; 
  retry: () => void; 
  chunkName?: string;
}) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-cyberdark-900/50 rounded-lg border border-red-900/30">
    <div className="text-red-400 text-center mb-4">
      <div className="text-lg font-medium mb-2">Kunne ikke laste komponent</div>
      <div className="text-sm text-red-300/70">
        {error.message}
        {chunkName && (
          <div className="text-xs text-red-400/50 mt-1">
            Chunk: {chunkName}
          </div>
        )}
      </div>
    </div>
    <button
      onClick={retry}
      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md text-sm transition-colors"
    >
      Prøv igjen
    </button>
  </div>
);

class SmartLazyLoader {
  private componentCache: ComponentCache = {};
  private preloadQueue = new Set<string>();
  private maxRetries = 3;

  /**
   * Create a smart lazy component with enhanced features
   */
  createLazyComponent<T extends React.ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    options: LazyComponentOptions = {}
  ) {
    const {
      fallback,
      errorFallback,
      preloadDelay = 0,
      chunkName,
      priority = 'medium',
      networkThreshold = 'medium'
    } = options;

    const componentKey = importFn.toString();

    // Check if component is already cached
    if (this.componentCache[componentKey]) {
      return this.componentCache[componentKey].component;
    }

    // Create lazy component with enhanced error handling
    const LazyComponent = lazy(async () => {
      const startTime = performance.now();
      
      try {
        // Check network conditions before loading
        if (!this.shouldLoadBasedOnNetwork(networkThreshold)) {
          console.warn(`Skipping component load due to poor network conditions`);
          throw new Error('Nettverk for sakte - last siden på nytt');
        }

        const module = await importFn();
        const loadTime = performance.now() - startTime;

        // Record performance metrics
        performanceMonitor.recordMetric(`ComponentLoad_${chunkName || 'Unknown'}`, loadTime, {
          priority,
          networkThreshold,
          chunkName
        });

        // Mark component as loaded
        if (this.componentCache[componentKey]) {
          this.componentCache[componentKey].loaded = true;
          this.componentCache[componentKey].error = undefined;
        }

        return module;
      } catch (error) {
        // Update cache with error info
        if (this.componentCache[componentKey]) {
          this.componentCache[componentKey].error = error as Error;
          this.componentCache[componentKey].retryCount++;
        }

        throw error;
      }
    });

    // Store in cache
    this.componentCache[componentKey] = {
      component: LazyComponent,
      loaded: false,
      retryCount: 0
    };

    // Create wrapper component with enhanced error handling
    const WrappedComponent = (props: React.ComponentProps<T>) => {
      const [retryKey, setRetryKey] = useState(0);
      const cacheEntry = this.componentCache[componentKey];

      const handleRetry = useCallback(() => {
        if (cacheEntry && cacheEntry.retryCount < this.maxRetries) {
          setRetryKey(prev => prev + 1);
          cacheEntry.error = undefined;
        }
      }, [cacheEntry]);

      const FallbackComponent = fallback || 
        (() => <EnhancedLoader chunkName={chunkName} priority={priority} />);

      const ErrorComponent = errorFallback || 
        ((errorProps: { error: Error }) => (
          <EnhancedErrorFallback 
            error={errorProps.error} 
            retry={handleRetry}
            chunkName={chunkName}
          />
        ));

      return (
        <ErrorBoundary
          key={retryKey}
          FallbackComponent={ErrorComponent}
          onError={(error) => {
            console.error(`Error loading component ${chunkName || 'Unknown'}:`, error);
          }}
        >
          <Suspense fallback={<FallbackComponent />}>
            <LazyComponent {...props} />
          </Suspense>
        </ErrorBoundary>
      );
    };

    // Schedule preloading if specified
    if (preloadDelay > 0) {
      setTimeout(() => {
        this.preloadComponent(componentKey, importFn);
      }, preloadDelay);
    }

    return WrappedComponent as React.ComponentType<React.ComponentProps<T>>;
  }

  /**
   * Preload a component without rendering it
   */
  preloadComponent(componentKey: string, importFn: () => Promise<any>) {
    if (this.preloadQueue.has(componentKey) || 
        (this.componentCache[componentKey] && this.componentCache[componentKey].loaded)) {
      return;
    }

    this.preloadQueue.add(componentKey);

    const loadPromise = importFn()
      .then(() => {
        console.log(`✅ Preloaded component: ${componentKey.slice(0, 50)}...`);
        if (this.componentCache[componentKey]) {
          this.componentCache[componentKey].loaded = true;
        }
      })
      .catch((error) => {
        console.warn(`❌ Failed to preload component:`, error);
      })
      .finally(() => {
        this.preloadQueue.delete(componentKey);
      });

    if (this.componentCache[componentKey]) {
      this.componentCache[componentKey].loadPromise = loadPromise;
    }
  }

  /**
   * Check if component should load based on network conditions
   */
  private shouldLoadBasedOnNetwork(threshold: 'fast' | 'medium' | 'slow'): boolean {
    // @ts-ignore - experimental API
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (!connection) return true; // Assume good connection if API not available

    const effectiveType = connection.effectiveType;

    switch (threshold) {
      case 'fast':
        return effectiveType === '4g';
      case 'medium':
        return effectiveType === '4g' || effectiveType === '3g';
      case 'slow':
        return true; // Load regardless of connection
      default:
        return true;
    }
  }

  /**
   * Get loading statistics
   */
  getStats() {
    const totalComponents = Object.keys(this.componentCache).length;
    const loadedComponents = Object.values(this.componentCache).filter(c => c.loaded).length;
    const errorComponents = Object.values(this.componentCache).filter(c => c.error).length;
    const preloadingComponents = this.preloadQueue.size;

    return {
      total: totalComponents,
      loaded: loadedComponents,
      errors: errorComponents,
      preloading: preloadingComponents,
      loadSuccess: totalComponents > 0 ? (loadedComponents / totalComponents) * 100 : 0
    };
  }

  /**
   * Clear component cache (useful for development)
   */
  clearCache() {
    this.componentCache = {};
    this.preloadQueue.clear();
  }
}

// Error boundary component
class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  FallbackComponent: React.ComponentType<{ error: Error }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return <this.props.FallbackComponent error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Create singleton instance
export const smartLazyLoader = new SmartLazyLoader();

// Convenience function for creating smart lazy components
export function createSmartLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: LazyComponentOptions
) {
  return smartLazyLoader.createLazyComponent(importFn, options);
}

// Hook for accessing loader stats
export function useSmartLazyStats() {
  const [stats, setStats] = useState(smartLazyLoader.getStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(smartLazyLoader.getStats());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return stats;
}

export default smartLazyLoader;
