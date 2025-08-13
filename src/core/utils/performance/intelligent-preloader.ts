/**
 * FASE 3 Performance Enhancement: Intelligent Route Preloading System
 * 
 * This system analyzes user navigation patterns and preloads components
 * that are likely to be visited next, improving perceived performance.
 * 
 * Features:
 * - Route prediction based on user behavior
 * - Idle time component preloading
 * - Network-aware loading (avoid on slow connections)
 * - Cache-aware loading (don't reload already cached components)
 */

interface UserBehaviorPattern {
  fromRoute: string;
  toRoute: string;
  frequency: number;
  lastAccessed: number;
}

interface PreloadConfig {
  enabled: boolean;
  maxPreloadChunks: number;
  networkThreshold: number; // Mbps - don't preload if connection is slower
  idleTimeout: number; // ms - wait this long before preloading
  cacheTimeout: number; // ms - how long to keep preloaded components
}

class IntelligentRoutePreloader {
  private behaviorPatterns: UserBehaviorPattern[] = [];
  private preloadedComponents = new Set<string>();
  private preloadQueue = new Set<string>();
  private isIdle = false;
  private idleTimer: NodeJS.Timeout | null = null;
  
  private config: PreloadConfig = {
    enabled: true,
    maxPreloadChunks: 3,
    networkThreshold: 1, // 1 Mbps minimum
    idleTimeout: 2000, // 2 seconds
    cacheTimeout: 300000 // 5 minutes
  };

  constructor() {
    this.loadBehaviorPatterns();
    this.setupIdleDetection();
    this.setupNetworkDetection();
  }

  /**
   * Record a route transition to learn user behavior
   */
  recordNavigation(fromRoute: string, toRoute: string) {
    if (!this.config.enabled) return;

    const existingPattern = this.behaviorPatterns.find(
      p => p.fromRoute === fromRoute && p.toRoute === toRoute
    );

    if (existingPattern) {
      existingPattern.frequency++;
      existingPattern.lastAccessed = Date.now();
    } else {
      this.behaviorPatterns.push({
        fromRoute,
        toRoute,
        frequency: 1,
        lastAccessed: Date.now()
      });
    }

    // Save patterns to localStorage
    this.saveBehaviorPatterns();

    // Predict next routes and start preloading
    this.predictAndPreload(toRoute);
  }

  /**
   * Predict likely next routes based on current route and user patterns
   */
  private predictAndPreload(currentRoute: string) {
    if (!this.isNetworkSuitable() || !this.isIdle) return;

    const predictions = this.behaviorPatterns
      .filter(p => p.fromRoute === currentRoute)
      .sort((a, b) => {
        // Sort by frequency and recency
        const aScore = a.frequency * (1 + 1 / (Date.now() - a.lastAccessed));
        const bScore = b.frequency * (1 + 1 / (Date.now() - b.lastAccessed));
        return bScore - aScore;
      })
      .slice(0, this.config.maxPreloadChunks)
      .map(p => p.toRoute);

    // Also include default predictions based on common navigation patterns
    const defaultPredictions = this.getDefaultPredictions(currentRoute);
    
    const routesToPreload = [...new Set([...predictions, ...defaultPredictions])];
    
    routesToPreload.forEach(route => this.preloadRoute(route));
  }

  /**
   * Get default route predictions based on common UX patterns
   */
  private getDefaultPredictions(currentRoute: string): string[] {
    const predictions: string[] = [];

    // Common navigation patterns
    if (currentRoute === '/login') {
      predictions.push('/beta-chat', '/basic-chat', '/profile');
    } else if (currentRoute === '/beta-chat' || currentRoute === '/basic-chat') {
      predictions.push('/profile', '/settings', '/groups');
    } else if (currentRoute === '/profile') {
      predictions.push('/settings', '/beta-chat');
    } else if (currentRoute === '/') {
      predictions.push('/beta-chat', '/basic-chat', '/login');
    }

    return predictions;
  }

  /**
   * Preload a specific route component
   */
  private async preloadRoute(route: string) {
    if (this.preloadedComponents.has(route) || this.preloadQueue.has(route)) {
      return;
    }

    this.preloadQueue.add(route);

    try {
      const componentImport = this.getRouteImport(route);
      if (componentImport) {
        await componentImport();
        this.preloadedComponents.add(route);
        console.log(`🚀 Preloaded route: ${route}`);
      }
    } catch (error) {
      console.warn(`Failed to preload route ${route}:`, error);
    } finally {
      this.preloadQueue.delete(route);
    }
  }

  /**
   * Get the import function for a route
   */
  private getRouteImport(route: string): (() => Promise<any>) | null {
    const routeImports: Record<string, () => Promise<any>> = {
      '/beta-chat': () => import('@/pages/SnakkaZChatBeta'),
      '/basic-chat': () => import('@/pages/BasicChatPage'),
      '/profile': () => import('@/pages/ProfilePageNew'),
      '/settings': () => import('@/components/dynamic/DynamicSettings'),
      '/groups': () => import('@/pages/CreateGroupPage'),
      '/friends': () => import('@/pages/FriendsPage'),
      '/find-friends': () => import('@/pages/FindFriends'),
      '/admin': () => import('@/pages/admin/AdminSecurityPanel'),
      '/dashboard': () => import('@/pages/DashboardPage'),
      '/memory': () => import('@/components/dynamic/DynamicMemoryDashboard'),
      '/mail': () => import('@/components/dynamic/DynamicMail'),
      '/subscription': () => import('@/pages/Subscription'),
      '/ai-chat': () => import('@/features/chat/components/common/AIChatPage'),
      '/group-chat': () => import('@/features/chat/components/group/DynamicGroupChatPage'),
    };

    return routeImports[route] || null;
  }

  /**
   * Setup idle detection to trigger preloading during user inactivity
   */
  private setupIdleDetection() {
    const resetIdleTimer = () => {
      this.isIdle = false;
      
      if (this.idleTimer) {
        clearTimeout(this.idleTimer);
      }

      this.idleTimer = setTimeout(() => {
        this.isIdle = true;
      }, this.config.idleTimeout);
    };

    // Monitor user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, resetIdleTimer, { passive: true });
    });

    resetIdleTimer();
  }

  /**
   * Check if network conditions are suitable for preloading
   */
  private isNetworkSuitable(): boolean {
    // @ts-ignore - Navigator.connection is experimental
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (!connection) return true; // Assume good connection if API not available

    // Don't preload on slow connections or save-data mode
    if (connection.saveData) return false;
    
    const effectiveType = connection.effectiveType;
    if (effectiveType === 'slow-2g' || effectiveType === '2g') return false;

    return true;
  }

  /**
   * Setup network detection
   */
  private setupNetworkDetection() {
    // @ts-ignore
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      connection.addEventListener('change', () => {
        console.log(`Network changed: ${connection.effectiveType}`);
      });
    }
  }

  /**
   * Load behavior patterns from localStorage
   */
  private loadBehaviorPatterns() {
    try {
      const stored = localStorage.getItem('snakkaz_route_patterns');
      if (stored) {
        this.behaviorPatterns = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load behavior patterns:', error);
    }
  }

  /**
   * Save behavior patterns to localStorage
   */
  private saveBehaviorPatterns() {
    try {
      // Keep only recent and frequent patterns (max 50)
      const filtered = this.behaviorPatterns
        .filter(p => Date.now() - p.lastAccessed < 7 * 24 * 60 * 60 * 1000) // 7 days
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 50);

      localStorage.setItem('snakkaz_route_patterns', JSON.stringify(filtered));
    } catch (error) {
      console.warn('Failed to save behavior patterns:', error);
    }
  }

  /**
   * Manually preload specific components (for critical paths)
   */
  public preloadCriticalComponents() {
    const criticalRoutes = ['/beta-chat', '/basic-chat', '/profile'];
    criticalRoutes.forEach(route => this.preloadRoute(route));
  }

  /**
   * Clear preloaded components (useful for memory management)
   */
  public clearPreloadCache() {
    this.preloadedComponents.clear();
    this.preloadQueue.clear();
  }

  /**
   * Get preloading statistics
   */
  public getStats() {
    return {
      preloadedComponents: Array.from(this.preloadedComponents),
      queueSize: this.preloadQueue.size,
      behaviorPatterns: this.behaviorPatterns.length,
      isIdle: this.isIdle,
      networkSuitable: this.isNetworkSuitable()
    };
  }
}

// Create singleton instance
export const routePreloader = new IntelligentRoutePreloader();

// React hook for using the preloader
export function useRoutePreloader() {
  const recordNavigation = (fromRoute: string, toRoute: string) => {
    routePreloader.recordNavigation(fromRoute, toRoute);
  };

  const preloadCritical = () => {
    routePreloader.preloadCriticalComponents();
  };

  const getStats = () => {
    return routePreloader.getStats();
  };

  return {
    recordNavigation,
    preloadCritical,
    getStats
  };
}

export default routePreloader;
