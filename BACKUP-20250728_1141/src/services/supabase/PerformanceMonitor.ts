/**
 * Supabase Performance Monitor
 * 
 * Advanced monitoring and analytics for Supabase operations:
 * - Query performance tracking
 * - Realtime connection health
 * - E2EE performance metrics
 * - User behavior analytics
 * - System health monitoring
 */

import { supabase } from '@/integrations/supabase/client';

export interface PerformanceMetric {
  id: string;
  timestamp: number;
  category: 'query' | 'realtime' | 'auth' | 'storage' | 'e2ee';
  operation: string;
  duration: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

export interface SystemHealth {
  database: {
    status: 'healthy' | 'degraded' | 'down';
    avgQueryTime: number;
    errorRate: number;
  };
  realtime: {
    status: 'connected' | 'disconnected' | 'reconnecting';
    connectionCount: number;
    messageLatency: number;
  };
  auth: {
    status: 'active' | 'inactive';
    activeUsers: number;
    sessionDuration: number;
  };
  e2ee: {
    keyExchangeSuccessRate: number;
    encryptionLatency: number;
    decryptionLatency: number;
  };
}

export class SupabasePerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000; // Keep last 1000 metrics
  private isMonitoring = false;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  // Performance tracking
  private realtimeLatencies: number[] = [];
  private e2eeMetrics: { encrypt: number[]; decrypt: number[] } = { encrypt: [], decrypt: [] };

  constructor() {
    // Removed automatic initialization - call startMonitoring() manually
  }

  /**
   * Start performance monitoring
   */
  public startMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    console.log('🔍 Supabase performance monitoring started');

    // Start health checks every 30 seconds
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, 30000);

    // Monitor Supabase client events
    this.monitorSupabaseEvents();
  }

  /**
   * Stop performance monitoring
   */
  public stopMonitoring() {
    this.isMonitoring = false;
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    console.log('🔍 Supabase performance monitoring stopped');
  }

  /**
   * Track database query performance
   */
  public trackQuery<T>(
    queryName: string,
    queryFn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const startTime = performance.now();
    const metricId = crypto.randomUUID();

    return queryFn()
      .then((result) => {
        const duration = performance.now() - startTime;
        
        this.addMetric({
          id: metricId,
          timestamp: Date.now(),
          category: 'query',
          operation: queryName,
          duration,
          success: true,
          metadata: { ...metadata, resultCount: Array.isArray(result) ? result.length : 1 }
        });

        return result;
      })
      .catch((error) => {
        const duration = performance.now() - startTime;
        
        this.addMetric({
          id: metricId,
          timestamp: Date.now(),
          category: 'query',
          operation: queryName,
          duration,
          success: false,
          error: error.message,
          metadata
        });

        throw error;
      });
  }

  /**
   * Track realtime message latency
   */
  public trackRealtimeMessage(sentAt: number, receivedAt: number = Date.now()) {
    const latency = receivedAt - sentAt;
    this.realtimeLatencies.push(latency);
    
    // Keep only last 100 latency measurements
    if (this.realtimeLatencies.length > 100) {
      this.realtimeLatencies = this.realtimeLatencies.slice(-100);
    }

    this.addMetric({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      category: 'realtime',
      operation: 'message_latency',
      duration: latency,
      success: latency < 5000, // Consider >5s as poor performance
      metadata: { sentAt, receivedAt }
    });
  }

  /**
   * Track E2EE operations
   */
  public trackE2EEOperation(
    operation: 'encrypt' | 'decrypt',
    duration: number,
    success: boolean,
    error?: string
  ) {
    this.e2eeMetrics[operation].push(duration);
    
    // Keep only last 50 measurements per operation
    if (this.e2eeMetrics[operation].length > 50) {
      this.e2eeMetrics[operation] = this.e2eeMetrics[operation].slice(-50);
    }

    this.addMetric({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      category: 'e2ee',
      operation,
      duration,
      success,
      error
    });
  }

  /**
   * Get system health overview
   */
  public getSystemHealth(): SystemHealth {
    const now = Date.now();
    const recentMetrics = this.metrics.filter(m => now - m.timestamp < 300000); // Last 5 minutes

    // Database health
    const queryMetrics = recentMetrics.filter(m => m.category === 'query');
    const avgQueryTime = queryMetrics.length > 0 
      ? queryMetrics.reduce((sum, m) => sum + m.duration, 0) / queryMetrics.length 
      : 0;
    const queryErrorRate = queryMetrics.length > 0 
      ? (queryMetrics.filter(m => !m.success).length / queryMetrics.length) * 100 
      : 0;

    // Realtime health
    const avgRealtimeLatency = this.realtimeLatencies.length > 0
      ? this.realtimeLatencies.reduce((sum, l) => sum + l, 0) / this.realtimeLatencies.length
      : 0;

    // E2EE performance
    const encryptTimes = this.e2eeMetrics.encrypt;
    const decryptTimes = this.e2eeMetrics.decrypt;
    
    const avgEncryptTime = encryptTimes.length > 0 
      ? encryptTimes.reduce((sum, t) => sum + t, 0) / encryptTimes.length 
      : 0;
    
    const avgDecryptTime = decryptTimes.length > 0 
      ? decryptTimes.reduce((sum, t) => sum + t, 0) / decryptTimes.length 
      : 0;

    const e2eeMetrics = recentMetrics.filter(m => m.category === 'e2ee');
    const keyExchangeSuccessRate = e2eeMetrics.length > 0
      ? (e2eeMetrics.filter(m => m.success).length / e2eeMetrics.length) * 100
      : 100;

    return {
      database: {
        status: queryErrorRate > 10 ? 'degraded' : (queryErrorRate > 0 ? 'degraded' : 'healthy'),
        avgQueryTime,
        errorRate: queryErrorRate
      },
      realtime: {
        status: avgRealtimeLatency > 5000 ? 'reconnecting' : 'connected',
        connectionCount: 1, // Would need to track actual connections
        messageLatency: avgRealtimeLatency
      },
      auth: {
        status: 'active', // Would need to track actual auth status
        activeUsers: 1, // Would need actual user count
        sessionDuration: 0 // Would need to track session time
      },
      e2ee: {
        keyExchangeSuccessRate,
        encryptionLatency: avgEncryptTime,
        decryptionLatency: avgDecryptTime
      }
    };
  }

  /**
   * Get performance analytics
   */
  public getAnalytics(timeRange: number = 3600000) { // Default: 1 hour
    const now = Date.now();
    const rangeMetrics = this.metrics.filter(m => now - m.timestamp < timeRange);

    const byCategory = {
      query: rangeMetrics.filter(m => m.category === 'query'),
      realtime: rangeMetrics.filter(m => m.category === 'realtime'),
      auth: rangeMetrics.filter(m => m.category === 'auth'),
      storage: rangeMetrics.filter(m => m.category === 'storage'),
      e2ee: rangeMetrics.filter(m => m.category === 'e2ee')
    };

    const analytics = Object.entries(byCategory).map(([category, metrics]) => ({
      category,
      totalOperations: metrics.length,
      successRate: metrics.length > 0 ? (metrics.filter(m => m.success).length / metrics.length) * 100 : 0,
      avgDuration: metrics.length > 0 ? metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length : 0,
      slowestOperation: metrics.length > 0 ? Math.max(...metrics.map(m => m.duration)) : 0,
      fastestOperation: metrics.length > 0 ? Math.min(...metrics.map(m => m.duration)) : 0
    }));

    return {
      timeRange,
      totalMetrics: rangeMetrics.length,
      overallSuccessRate: rangeMetrics.length > 0 
        ? (rangeMetrics.filter(m => m.success).length / rangeMetrics.length) * 100 
        : 0,
      categories: analytics
    };
  }

  /**
   * Get top slow queries
   */
  public getSlowQueries(limit: number = 10) {
    return this.metrics
      .filter(m => m.category === 'query')
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit)
      .map(m => ({
        operation: m.operation,
        duration: m.duration,
        timestamp: m.timestamp,
        success: m.success,
        error: m.error
      }));
  }

  /**
   * Monitor Supabase client events
   */
  private monitorSupabaseEvents() {
    // This would require access to Supabase client internals
    // For now, we'll track through our wrapper methods
  }

  /**
   * Perform health check
   */
  private async performHealthCheck() {
    const startTime = performance.now();
    
    try {
      // Simple query to test database connection
      await supabase.from('profiles').select('count').limit(1);
      
      const duration = performance.now() - startTime;
      this.addMetric({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        category: 'query',
        operation: 'health_check',
        duration,
        success: true
      });
    } catch (error) {
      const duration = performance.now() - startTime;
      this.addMetric({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        category: 'query',
        operation: 'health_check',
        duration,
        success: false,
        error: (error as Error).message
      });
    }
  }

  /**
   * Add metric to collection
   */
  private addMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * Export metrics for analysis
   */
  public exportMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Clear all metrics
   */
  public clearMetrics() {
    this.metrics = [];
    this.realtimeLatencies = [];
    this.e2eeMetrics = { encrypt: [], decrypt: [] };
  }
}

// Export singleton instance
export const performanceMonitor = new SupabasePerformanceMonitor();

// Auto-start monitoring in development
if (process.env.NODE_ENV === 'development') {
  performanceMonitor.startMonitoring();
}
