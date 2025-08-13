/**
 * FASE 3 Performance Enhancement: Performance Monitoring System
 * 
 * This system tracks key performance metrics to measure the impact
 * of our optimization efforts and identify areas for improvement.
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface RoutePerformance {
  route: string;
  loadTime: number;
  renderTime: number;
  chunkSize?: number;
  preloaded: boolean;
  timestamp: number;
}

interface PerformanceSnapshot {
  timestamp: number;
  metrics: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    fcp: number; // First Contentful Paint
    ttfb: number; // Time to First Byte
    bundleSize: number;
    chunkCount: number;
    preloadHitRate: number;
  };
  routes: RoutePerformance[];
  memory: {
    used: number;
    total: number;
    limit: number;
  };
  network: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private routePerformance: RoutePerformance[] = [];
  private observer: PerformanceObserver | null = null;
  private startTime = performance.now();

  constructor() {
    this.initializeObservers();
    this.trackMemoryUsage();
    this.trackNetworkConditions();
  }

  /**
   * Initialize performance observers for Web Vitals
   */
  private initializeObservers() {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            // @ts-ignore - element exists on LCP entries
            const element = (entry as any).element?.tagName || 'unknown';
            this.recordMetric('LCP', entry.startTime, {
              element
            });
          }
        }
      });

      try {
        this.observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observer not supported:', e);
      }

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            // @ts-ignore - processingStart exists on first-input entries
            this.recordMetric('FID', entry.processingStart - entry.startTime);
          }
        }
      });

      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID observer not supported:', e);
      }

      // Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          // @ts-ignore - value exists on layout-shift entries
          if (!entry.hadRecentInput) {
            // @ts-ignore
            clsValue += entry.value;
          }
        }
        if (clsValue > 0) {
          this.recordMetric('CLS', clsValue);
        }
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS observer not supported:', e);
      }

      // Navigation Timing
      this.trackNavigationTiming();
    }
  }

  /**
   * Track navigation timing metrics
   */
  private trackNavigationTiming() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.recordMetric('TTFB', navigation.responseStart - navigation.fetchStart);
          this.recordMetric('DOMLoad', navigation.domContentLoadedEventEnd - navigation.fetchStart);
          this.recordMetric('WindowLoad', navigation.loadEventEnd - navigation.fetchStart);
        }

        // First Contentful Paint
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcp) {
          this.recordMetric('FCP', fcp.startTime);
        }
      }, 100);
    });
  }

  /**
   * Record a performance metric
   */
  recordMetric(name: string, value: number, metadata?: Record<string, any>) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      metadata
    });

    // Keep only last 100 metrics to prevent memory bloat
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    console.log(`📊 Performance: ${name} = ${Math.round(value)}ms`, metadata || '');
  }

  /**
   * Record route performance data
   */
  recordRoutePerformance(route: string, loadTime: number, preloaded: boolean, chunkSize?: number) {
    const routePerf: RoutePerformance = {
      route,
      loadTime,
      renderTime: performance.now() - this.startTime,
      chunkSize,
      preloaded,
      timestamp: Date.now()
    };

    this.routePerformance.push(routePerf);

    // Keep only last 50 route performances
    if (this.routePerformance.length > 50) {
      this.routePerformance = this.routePerformance.slice(-50);
    }

    console.log(`🎯 Route Performance: ${route} loaded in ${Math.round(loadTime)}ms ${preloaded ? '(preloaded)' : ''}`);
  }

  /**
   * Track memory usage
   */
  private trackMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        // @ts-ignore - memory is experimental
        const memory = performance.memory;
        this.recordMetric('MemoryUsed', memory.usedJSHeapSize, {
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        });
      }, 30000); // Every 30 seconds
    }
  }

  /**
   * Track network conditions
   */
  private trackNetworkConditions() {
    // @ts-ignore - connection is experimental
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      this.recordMetric('NetworkDownlink', connection.downlink, {
        effectiveType: connection.effectiveType,
        rtt: connection.rtt,
        saveData: connection.saveData
      });

      connection.addEventListener('change', () => {
        this.recordMetric('NetworkChange', connection.downlink, {
          effectiveType: connection.effectiveType,
          rtt: connection.rtt
        });
      });
    }
  }

  /**
   * Get current performance snapshot
   */
  getPerformanceSnapshot(): PerformanceSnapshot {
    const latestMetrics = this.getLatestMetrics();
    
    // @ts-ignore
    const memory = performance.memory || { usedJSHeapSize: 0, totalJSHeapSize: 0, jsHeapSizeLimit: 0 };
    // @ts-ignore
    const connection = navigator.connection || { effectiveType: 'unknown', downlink: 0, rtt: 0 };

    // Calculate preload hit rate
    const preloadedRoutes = this.routePerformance.filter(r => r.preloaded).length;
    const totalRoutes = this.routePerformance.length;
    const preloadHitRate = totalRoutes > 0 ? (preloadedRoutes / totalRoutes) * 100 : 0;

    return {
      timestamp: Date.now(),
      metrics: {
        lcp: latestMetrics.LCP || 0,
        fid: latestMetrics.FID || 0,
        cls: latestMetrics.CLS || 0,
        fcp: latestMetrics.FCP || 0,
        ttfb: latestMetrics.TTFB || 0,
        bundleSize: this.estimateBundleSize(),
        chunkCount: this.countChunks(),
        preloadHitRate
      },
      routes: [...this.routePerformance],
      memory: {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      },
      network: {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      }
    };
  }

  /**
   * Get latest value for each metric type
   */
  private getLatestMetrics(): Record<string, number> {
    const latest: Record<string, number> = {};
    
    for (const metric of this.metrics) {
      latest[metric.name] = metric.value;
    }
    
    return latest;
  }

  /**
   * Estimate total bundle size from loaded resources
   */
  private estimateBundleSize(): number {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    return resources
      .filter(r => r.name.includes('.js') || r.name.includes('.css'))
      .reduce((total, r) => total + (r.transferSize || 0), 0);
  }

  /**
   * Count JavaScript chunks loaded
   */
  private countChunks(): number {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    return resources.filter(r => r.name.includes('.js') && r.name.includes('assets')).length;
  }

  /**
   * Get performance report for debugging
   */
  getPerformanceReport(): string {
    const snapshot = this.getPerformanceSnapshot();
    
    return `
FASE 3 Performance Report
========================
Core Web Vitals:
- LCP: ${Math.round(snapshot.metrics.lcp)}ms
- FID: ${Math.round(snapshot.metrics.fid)}ms  
- CLS: ${snapshot.metrics.cls.toFixed(3)}
- FCP: ${Math.round(snapshot.metrics.fcp)}ms
- TTFB: ${Math.round(snapshot.metrics.ttfb)}ms

Bundle Analysis:
- Total Size: ${Math.round(snapshot.metrics.bundleSize / 1024)}KB
- Chunks: ${snapshot.metrics.chunkCount}
- Preload Hit Rate: ${snapshot.metrics.preloadHitRate.toFixed(1)}%

Memory Usage:
- Used: ${Math.round(snapshot.memory.used / 1024 / 1024)}MB
- Total: ${Math.round(snapshot.memory.total / 1024 / 1024)}MB

Network:
- Type: ${snapshot.network.effectiveType}
- Speed: ${snapshot.network.downlink}Mbps
- RTT: ${snapshot.network.rtt}ms

Recent Route Performance:
${snapshot.routes.slice(-5).map(r => 
  `- ${r.route}: ${Math.round(r.loadTime)}ms ${r.preloaded ? '(preloaded)' : ''}`
).join('\n')}
    `;
  }

  /**
   * Export performance data for analysis
   */
  exportData(): string {
    return JSON.stringify({
      snapshot: this.getPerformanceSnapshot(),
      metrics: this.metrics,
      routes: this.routePerformance
    }, null, 2);
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitoring() {
  const recordRoute = (route: string, loadTime: number, preloaded: boolean, chunkSize?: number) => {
    performanceMonitor.recordRoutePerformance(route, loadTime, preloaded, chunkSize);
  };

  const getSnapshot = () => {
    return performanceMonitor.getPerformanceSnapshot();
  };

  const getReport = () => {
    return performanceMonitor.getPerformanceReport();
  };

  return {
    recordRoute,
    getSnapshot,
    getReport
  };
}

export default performanceMonitor;
