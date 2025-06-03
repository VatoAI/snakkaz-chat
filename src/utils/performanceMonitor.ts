// Performance Monitoring Utility for Snakkaz Chat
// Tracks bundle loading performance and user experience metrics

interface PerformanceMetrics {
  chunkLoadTime: number;
  componentRenderTime: number;
  totalBundleSize: number;
  cacheHitRate: number;
  timestamp: number;
}

interface ComponentLoadMetrics {
  componentName: string;
  loadTime: number;
  bundleSize: number;
  isFromCache: boolean;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private componentMetrics: ComponentLoadMetrics[] = [];
  private startTime: number;

  constructor() {
    this.startTime = performance.now();
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    // Monitor navigation performance
    if ('navigation' in window.performance) {
      window.addEventListener('load', () => {
        this.recordInitialLoadMetrics();
      });
    }

    // Monitor chunk loading
    this.observeResourceLoading();
  }

  private recordInitialLoadMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const metrics: PerformanceMetrics = {
      chunkLoadTime: navigation.loadEventEnd - navigation.fetchStart,
      componentRenderTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      totalBundleSize: this.calculateTotalBundleSize(),
      cacheHitRate: this.calculateCacheHitRate(),
      timestamp: Date.now()
    };

    this.metrics.push(metrics);
    this.logPerformanceMetrics(metrics);
  }

  private observeResourceLoading() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('/assets/js/') && entry.name.includes('.js')) {
          this.recordChunkLoadTime(entry as PerformanceResourceTiming);
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  private recordChunkLoadTime(entry: PerformanceResourceTiming) {
    const chunkName = this.extractChunkName(entry.name);
    const loadTime = entry.responseEnd - entry.startTime;
    const isFromCache = entry.transferSize === 0 && entry.decodedBodySize > 0;

    console.log(`📦 Chunk loaded: ${chunkName} in ${loadTime.toFixed(2)}ms ${isFromCache ? '(cached)' : '(network)'}`);
  }

  private extractChunkName(url: string): string {
    const match = url.match(/\/([^\/]+)\.js$/);
    return match ? match[1] : 'unknown';
  }

  private calculateTotalBundleSize(): number {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    return resources
      .filter(resource => resource.name.includes('/assets/js/'))
      .reduce((total, resource) => total + (resource.transferSize || 0), 0);
  }

  private calculateCacheHitRate(): number {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const jsResources = resources.filter(resource => resource.name.includes('/assets/js/'));
    const cachedResources = jsResources.filter(resource => 
      resource.transferSize === 0 && resource.decodedBodySize > 0
    );
    
    return jsResources.length > 0 ? (cachedResources.length / jsResources.length) * 100 : 0;
  }

  // Track dynamic component loading
  trackComponentLoad(componentName: string, loadTime: number, bundleSize: number, isFromCache: boolean) {
    const metric: ComponentLoadMetrics = {
      componentName,
      loadTime,
      bundleSize,
      isFromCache
    };

    this.componentMetrics.push(metric);
    
    console.log(`🚀 Component loaded: ${componentName} in ${loadTime.toFixed(2)}ms 
                 Size: ${(bundleSize / 1024).toFixed(2)}KB ${isFromCache ? '(cached)' : '(fresh)'}`);
  }

  // Get performance summary
  getPerformanceSummary() {
    const avgLoadTime = this.componentMetrics.reduce((sum, metric) => sum + metric.loadTime, 0) / 
                       (this.componentMetrics.length || 1);
    
    const totalBundleSize = this.componentMetrics.reduce((sum, metric) => sum + metric.bundleSize, 0);
    
    const cacheHitRate = this.componentMetrics.filter(metric => metric.isFromCache).length / 
                        (this.componentMetrics.length || 1) * 100;

    return {
      averageLoadTime: avgLoadTime,
      totalBundleSize: totalBundleSize,
      cacheHitRate: cacheHitRate,
      componentsLoaded: this.componentMetrics.length,
      optimizationScore: this.calculateOptimizationScore()
    };
  }

  private calculateOptimizationScore(): number {
    // Score based on load times, bundle sizes, and cache hit rate
    const summary = this.getPerformanceSummary();
    let score = 100;

    // Deduct points for slow loading (>500ms)
    if (summary.averageLoadTime > 500) {
      score -= Math.min(30, (summary.averageLoadTime - 500) / 100 * 10);
    }

    // Deduct points for large bundles (>50KB average)
    const avgBundleSize = summary.totalBundleSize / (summary.componentsLoaded || 1);
    if (avgBundleSize > 50000) {
      score -= Math.min(30, (avgBundleSize - 50000) / 10000 * 10);
    }

    // Add points for good cache hit rate
    score += summary.cacheHitRate / 100 * 20;

    return Math.max(0, Math.min(100, score));
  }

  private logPerformanceMetrics(metrics: PerformanceMetrics) {
    console.group('🎯 Performance Metrics');
    console.log(`⏱️  Chunk Load Time: ${metrics.chunkLoadTime.toFixed(2)}ms`);
    console.log(`🎨 Component Render Time: ${metrics.componentRenderTime.toFixed(2)}ms`);
    console.log(`📊 Total Bundle Size: ${(metrics.totalBundleSize / 1024).toFixed(2)}KB`);
    console.log(`💾 Cache Hit Rate: ${metrics.cacheHitRate.toFixed(1)}%`);
    console.groupEnd();
  }

  // Export metrics for analysis
  exportMetrics() {
    return {
      performanceMetrics: this.metrics,
      componentMetrics: this.componentMetrics,
      summary: this.getPerformanceSummary()
    };
  }
}

// Create global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Helper function for dynamic components to track their loading
export const trackDynamicComponentLoad = (componentName: string, startTime: number, bundleSize: number = 0) => {
  const loadTime = performance.now() - startTime;
  const isFromCache = loadTime < 50; // Assume cached if very fast
  performanceMonitor.trackComponentLoad(componentName, loadTime, bundleSize, isFromCache);
};
