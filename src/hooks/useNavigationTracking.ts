/**
 * FASE 3 Performance Enhancement: Navigation Tracker Hook
 * 
 * This hook integrates with React Router to automatically track navigation
 * patterns and trigger intelligent preloading of likely next routes.
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { routePreloader } from '@/utils/performance/intelligent-preloader';

interface NavigationTrackingOptions {
  enabled?: boolean;
  preloadCriticalOnMount?: boolean;
  excludeRoutes?: string[];
}

export function useNavigationTracking(options: NavigationTrackingOptions = {}) {
  const {
    enabled = true,
    preloadCriticalOnMount = true,
    excludeRoutes = []
  } = options;

  const location = useLocation();
  const previousLocation = useRef<string>('');
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!enabled) return;

    const currentPath = location.pathname;

    // Skip tracking for excluded routes
    if (excludeRoutes.includes(currentPath)) return;

    // Record navigation (except for initial mount)
    if (!isInitialMount.current && previousLocation.current !== currentPath) {
      routePreloader.recordNavigation(previousLocation.current, currentPath);
    }

    // Update previous location
    previousLocation.current = currentPath;

    // Preload critical components on app start
    if (isInitialMount.current && preloadCriticalOnMount) {
      // Delay to avoid blocking initial render
      setTimeout(() => {
        routePreloader.preloadCriticalComponents();
      }, 1000);
    }

    isInitialMount.current = false;
  }, [location.pathname, enabled, excludeRoutes, preloadCriticalOnMount]);

  return {
    currentRoute: location.pathname,
    preloadStats: routePreloader.getStats()
  };
}

/**
 * React component wrapper that automatically tracks navigation
 */
export function NavigationTracker({ 
  children, 
  options = {} 
}: { 
  children: React.ReactNode;
  options?: NavigationTrackingOptions;
}) {
  useNavigationTracking(options);
  return children as React.ReactElement;
}
