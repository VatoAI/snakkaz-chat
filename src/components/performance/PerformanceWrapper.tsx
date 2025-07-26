/**
 * FASE 3 Performance Enhancement: Route-Aware Performance Wrapper
 * 
 * This wrapper component integrates intelligent preloading and performance monitoring
 * into any React application, regardless of routing library used.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { routePreloader } from '@/utils/performance/intelligent-preloader';
import { performanceMonitor } from '@/utils/performance/performance-monitor';

interface PerformanceWrapperProps {
  children: React.ReactNode;
  currentRoute?: string;
  routeMetadata?: {
    title?: string;
    chunkSize?: number;
    preloaded?: boolean;
  };
  enablePreloading?: boolean;
  enableMonitoring?: boolean;
}

export function PerformanceWrapper({
  children,
  currentRoute,
  routeMetadata = {},
  enablePreloading = true,
  enableMonitoring = true
}: PerformanceWrapperProps) {
  const [previousRoute, setPreviousRoute] = useState<string>('');
  const [renderStartTime] = useState(() => performance.now());

  // Track route changes and performance
  useEffect(() => {
    if (!currentRoute) return;

    const loadTime = performance.now() - renderStartTime;

    // Record route performance
    if (enableMonitoring) {
      performanceMonitor.recordRoutePerformance(
        currentRoute,
        loadTime,
        routeMetadata.preloaded || false,
        routeMetadata.chunkSize
      );
    }

    // Record navigation pattern for preloading
    if (enablePreloading && previousRoute && previousRoute !== currentRoute) {
      routePreloader.recordNavigation(previousRoute, currentRoute);
    }

    setPreviousRoute(currentRoute);
  }, [currentRoute, previousRoute, renderStartTime, routeMetadata, enablePreloading, enableMonitoring]);

  // Initial preload of critical components
  useEffect(() => {
    if (enablePreloading) {
      // Delay to avoid blocking initial render
      const timer = setTimeout(() => {
        routePreloader.preloadCriticalComponents();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [enablePreloading]);

  return <>{children}</>;
}

/**
 * Hook for manually tracking navigation in custom routing systems
 */
export function usePerformanceTracking() {
  const recordNavigation = useCallback((fromRoute: string, toRoute: string) => {
    routePreloader.recordNavigation(fromRoute, toRoute);
  }, []);

  const recordRouteLoad = useCallback((route: string, loadTime: number, preloaded = false) => {
    performanceMonitor.recordRoutePerformance(route, loadTime, preloaded);
  }, []);

  const preloadRoute = useCallback((route: string) => {
    // Trigger preloading for a specific route
    routePreloader.recordNavigation(window.location.pathname, route);
  }, []);

  const getPerformanceStats = useCallback(() => {
    return {
      preloader: routePreloader.getStats(),
      monitor: performanceMonitor.getPerformanceSnapshot()
    };
  }, []);

  return {
    recordNavigation,
    recordRouteLoad,
    preloadRoute,
    getPerformanceStats
  };
}

/**
 * Performance-aware route component wrapper
 */
export function PerformantRoute({
  children,
  routeName,
  preloadTargets = [],
  chunkSize
}: {
  children: React.ReactNode;
  routeName: string;
  preloadTargets?: string[];
  chunkSize?: number;
}) {
  const [loadStart] = useState(() => performance.now());

  useEffect(() => {
    const loadTime = performance.now() - loadStart;
    
    // Record this route's performance
    performanceMonitor.recordRoutePerformance(routeName, loadTime, false, chunkSize);

    // Preload target routes after a delay
    if (preloadTargets.length > 0) {
      setTimeout(() => {
        preloadTargets.forEach(target => {
          routePreloader.recordNavigation(routeName, target);
        });
      }, 2000);
    }
  }, [routeName, loadStart, preloadTargets, chunkSize]);

  return (
    <PerformanceWrapper currentRoute={routeName}>
      {children}
    </PerformanceWrapper>
  );
}

export default PerformanceWrapper;
