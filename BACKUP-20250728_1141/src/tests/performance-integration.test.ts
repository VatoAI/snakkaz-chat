/**
 * FASE 3 Performance System Integration Test
 * 
 * Tests for all performance enhancement systems implemented in FASE 3:
 * - Intelligent preloader
 * - Advanced caching
 * - Bundle analyzer
 * - Smart lazy loader
 * - Performance monitor
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { performanceMonitor } from '@/utils/performance/performance-monitor';
import { cacheManager } from '@/utils/performance/advanced-cache';
import { routePreloader } from '@/utils/performance/intelligent-preloader';
import { smartLazyLoader } from '@/utils/performance/smart-lazy-loader';
import { bundleAnalyzer } from '@/utils/performance/bundle-analyzer';

// Mock performance APIs
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(() => []),
  getEntriesByName: vi.fn(() => [])
};

// Mock navigator APIs
const mockNavigator = {
  deviceMemory: 8,
  connection: {
    effectiveType: '4g',
    downlink: 10
  }
};

// Setup mocks
beforeEach(() => {
  global.performance = mockPerformance as any;
  global.navigator = mockNavigator as any;
  
  // Mock IndexedDB
  global.indexedDB = {
    open: vi.fn(() => ({
      onsuccess: null,
      onerror: null,
      onupgradeneeded: null
    }))
  } as any;
  
  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  };
  global.localStorage = localStorageMock as any;
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('FASE 3 Performance System Integration', () => {
  describe('Performance Monitor', () => {
    test('should initialize and start monitoring', () => {
      performanceMonitor.startMonitoring();
      
      // Should set up performance observation
      expect(performanceMonitor.isMonitoring()).toBe(true);
    });

    test('should record custom metrics', () => {
      const metricName = 'test-metric';
      const value = 100;
      const metadata = { component: 'test' };

      performanceMonitor.recordMetric(metricName, value, metadata);

      const metrics = performanceMonitor.getAllMetrics();
      expect(metrics).toHaveProperty(metricName);
      expect(metrics[metricName]).toEqual(
        expect.objectContaining({
          value,
          metadata
        })
      );
    });

    test('should track errors', () => {
      const error = new Error('Test error');
      const context = { component: 'test-component' };

      performanceMonitor.recordError(error, context);

      const errors = performanceMonitor.getErrors();
      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatchObject({
        message: 'Test error',
        context
      });
    });

    test('should generate performance reports', () => {
      performanceMonitor.recordMetric('load-time', 500);
      performanceMonitor.recordMetric('render-time', 100);

      const report = performanceMonitor.generateReport();
      
      expect(report).toHaveProperty('summary');
      expect(report).toHaveProperty('metrics');
      expect(report).toHaveProperty('webVitals');
      expect(report.summary).toContain('Performance Report');
    });
  });

  describe('Advanced Cache Manager', () => {
    test('should cache and retrieve data', async () => {
      const key = 'test-key';
      const data = { message: 'Hello, World!' };

      await cacheManager.set(key, data);
      const retrieved = await cacheManager.get(key);

      expect(retrieved).toEqual(data);
    });

    test('should respect TTL expiration', async () => {
      const key = 'expiring-key';
      const data = { value: 'expires soon' };
      
      // Set with very short TTL (1ms)
      await cacheManager.set(key, data, { ttl: 0.001 / 60 }); // 1ms in minutes
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const retrieved = await cacheManager.get(key);
      expect(retrieved).toBeNull();
    });

    test('should handle cache misses gracefully', async () => {
      const nonExistentKey = 'does-not-exist';
      const retrieved = await cacheManager.get(nonExistentKey);
      
      expect(retrieved).toBeNull();
    });

    test('should provide cache statistics', async () => {
      await cacheManager.set('stat-test-1', 'data1');
      await cacheManager.set('stat-test-2', 'data2');
      await cacheManager.get('stat-test-1'); // Hit
      await cacheManager.get('non-existent'); // Miss

      const stats = cacheManager.getStats();
      
      expect(stats).toHaveProperty('totalRequests');
      expect(stats).toHaveProperty('totalHits');
      expect(stats).toHaveProperty('totalMisses');
      expect(stats).toHaveProperty('hitRate');
      expect(stats.totalRequests).toBeGreaterThan(0);
    });

    test('should support cache with refresh pattern', async () => {
      const key = 'refresh-test';
      let callCount = 0;
      
      const fetchFn = async () => {
        callCount++;
        return { data: `fetch-${callCount}` };
      };

      // First call should fetch and cache
      const result1 = await cacheManager.cacheWithRefresh(key, fetchFn);
      expect(result1.data).toBe('fetch-1');
      expect(callCount).toBe(1);

      // Second call should return cached value
      const result2 = await cacheManager.cacheWithRefresh(key, fetchFn);
      expect(result2.data).toBe('fetch-1');
      expect(callCount).toBe(1);
    });
  });

  describe('Intelligent Route Preloader', () => {
    test('should track navigation patterns', () => {
      const route1 = '/chat';
      const route2 = '/profile';

      routePreloader.trackNavigation(route1, route2);
      
      const patterns = routePreloader.getNavigationPatterns();
      expect(patterns).toHaveProperty(route1);
      expect(patterns[route1]).toContain(route2);
    });

    test('should predict next routes based on history', () => {
      // Build navigation pattern
      routePreloader.trackNavigation('/home', '/chat');
      routePreloader.trackNavigation('/home', '/chat');
      routePreloader.trackNavigation('/home', '/profile');

      const predictions = routePreloader.predictNextRoutes('/home');
      
      expect(predictions).toHaveLength(2);
      expect(predictions[0]).toMatchObject({
        route: '/chat',
        probability: expect.any(Number)
      });
      expect(predictions[0].probability).toBeGreaterThan(predictions[1].probability);
    });

    test('should respect network conditions for preloading', () => {
      // Mock slow connection
      global.navigator.connection.effectiveType = '2g';
      
      const shouldPreload = routePreloader.shouldPreloadRoute('/heavy-page', 0.8);
      
      // Should not preload on slow connection even with high probability
      expect(shouldPreload).toBe(false);
    });

    test('should preload routes intelligently', async () => {
      const mockLoader = vi.fn().mockResolvedValue({ default: () => 'Component' });
      
      await routePreloader.preloadRoute('/test-route', mockLoader);
      
      expect(mockLoader).toHaveBeenCalled();
      expect(routePreloader.isPreloaded('/test-route')).toBe(true);
    });
  });

  describe('Smart Lazy Loader', () => {
    test('should create lazy components with enhanced features', () => {
      const mockImport = vi.fn().mockResolvedValue({ 
        default: () => 'TestComponent' 
      });

      const LazyComponent = smartLazyLoader.createLazyComponent(mockImport, {
        chunkName: 'test-chunk',
        priority: 'high'
      });

      expect(LazyComponent).toBeDefined();
      expect(typeof LazyComponent).toBe('function');
    });

    test('should track loading statistics', () => {
      const mockImport1 = vi.fn().mockResolvedValue({ default: () => 'Component1' });
      const mockImport2 = vi.fn().mockResolvedValue({ default: () => 'Component2' });

      smartLazyLoader.createLazyComponent(mockImport1);
      smartLazyLoader.createLazyComponent(mockImport2);

      const stats = smartLazyLoader.getStats();
      
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('loaded');
      expect(stats).toHaveProperty('errors');
      expect(stats).toHaveProperty('preloading');
      expect(stats.total).toBeGreaterThanOrEqual(2);
    });

    test('should handle loading errors gracefully', async () => {
      const mockImport = vi.fn().mockRejectedValue(new Error('Load failed'));

      const LazyComponent = smartLazyLoader.createLazyComponent(mockImport);

      // Component should still be created even if import might fail
      expect(LazyComponent).toBeDefined();
    });
  });

  describe('Bundle Analyzer', () => {
    test('should analyze bundle performance', async () => {
      // Mock resource timing entries
      mockPerformance.getEntriesByType.mockReturnValue([
        {
          name: 'app.js',
          transferSize: 100000,
          encodedBodySize: 150000
        },
        {
          name: 'vendor.js',
          transferSize: 200000,
          encodedBodySize: 300000
        }
      ]);

      const analysis = await bundleAnalyzer.analyzeBundlePerformance();
      
      expect(analysis).toHaveProperty('totalSize');
      expect(analysis).toHaveProperty('gzippedSize');
      expect(analysis).toHaveProperty('chunkCount');
      expect(analysis).toHaveProperty('largestChunks');
      expect(analysis.totalSize).toBeGreaterThan(0);
    });

    test('should generate optimization recommendations', async () => {
      // Mock large bundle scenario
      mockPerformance.getEntriesByType.mockReturnValue([
        {
          name: 'large-bundle.js',
          transferSize: 600000, // 600KB - exceeds budget
          encodedBodySize: 800000
        }
      ]);

      await bundleAnalyzer.analyzeBundlePerformance();
      const recommendations = bundleAnalyzer.getRecommendations();
      
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0]).toMatchObject({
        type: 'bundle-split',
        priority: 'high',
        description: expect.stringContaining('exceeds budget')
      });
    });

    test('should detect budget violations', async () => {
      await bundleAnalyzer.analyzeBundlePerformance();
      const violations = bundleAnalyzer.getBudgetViolations();
      
      expect(Array.isArray(violations)).toBe(true);
      // Violations depend on mocked data, should be array
    });

    test('should generate comprehensive reports', async () => {
      await bundleAnalyzer.analyzeBundlePerformance();
      const report = bundleAnalyzer.generateReport();
      
      expect(report).toHaveProperty('summary');
      expect(report).toHaveProperty('metrics');
      expect(report).toHaveProperty('violations');
      expect(report).toHaveProperty('recommendations');
      expect(report).toHaveProperty('score');
      expect(typeof report.score).toBe('number');
      expect(report.score).toBeGreaterThanOrEqual(0);
      expect(report.score).toBeLessThanOrEqual(100);
    });
  });

  describe('Performance System Integration', () => {
    test('should work together seamlessly', async () => {
      // Start monitoring
      performanceMonitor.startMonitoring();
      
      // Cache some data
      await cacheManager.set('integration-test', { value: 'test' });
      
      // Track navigation
      routePreloader.trackNavigation('/start', '/end');
      
      // Create lazy component
      const LazyComp = smartLazyLoader.createLazyComponent(
        () => Promise.resolve({ default: () => 'Component' })
      );
      
      // Analyze bundle
      await bundleAnalyzer.analyzeBundlePerformance();
      
      // Verify all systems are operational
      expect(performanceMonitor.isMonitoring()).toBe(true);
      expect(await cacheManager.get('integration-test')).toEqual({ value: 'test' });
      expect(routePreloader.getNavigationPatterns()).toHaveProperty('/start');
      expect(LazyComp).toBeDefined();
      expect(bundleAnalyzer.getMetrics()).toBeDefined();
    });

    test('should handle errors without breaking other systems', async () => {
      // Simulate error in one system
      const originalConsoleError = console.error;
      console.error = vi.fn();

      try {
        // This should not break other systems
        routePreloader.trackNavigation(null as any, undefined as any);
        
        // Other systems should still work
        await cacheManager.set('error-test', 'data');
        performanceMonitor.recordMetric('test-metric', 100);
        
        expect(await cacheManager.get('error-test')).toBe('data');
        expect(performanceMonitor.getAllMetrics()).toHaveProperty('test-metric');
      } finally {
        console.error = originalConsoleError;
      }
    });

    test('should provide comprehensive system status', () => {
      // Get status from all systems
      const monitoringStatus = performanceMonitor.isMonitoring();
      const cacheStats = cacheManager.getStats();
      const lazyStats = smartLazyLoader.getStats();
      const navigationPatterns = routePreloader.getNavigationPatterns();
      
      // All systems should provide meaningful status
      expect(typeof monitoringStatus).toBe('boolean');
      expect(cacheStats).toHaveProperty('hitRate');
      expect(lazyStats).toHaveProperty('total');
      expect(typeof navigationPatterns).toBe('object');
    });
  });
});
