import { Request, Response, NextFunction } from 'express';

interface Metrics {
  requestCount: number;
  errorCount: number;
  averageResponseTime: number;
  activeUsers: number;
  messagesSent: number;
  responseTimes: number[];
  errorsByType: Record<string, number>;
  endpointHits: Record<string, number>;
  lastUpdated: Date;
}

class MonitoringService {
  private metrics: Metrics = {
    requestCount: 0,
    errorCount: 0,
    averageResponseTime: 0,
    activeUsers: 0,
    messagesSent: 0,
    responseTimes: [],
    errorsByType: {},
    endpointHits: {},
    lastUpdated: new Date(),
  };

  private activeConnections = new Set<string>();
  private readonly MAX_RESPONSE_TIMES = 1000; // Keep last 1000 response times

  // Middleware to track requests
  trackRequest = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const endpoint = `${req.method} ${req.route?.path || req.path}`;

    // Track endpoint hits
    this.metrics.endpointHits[endpoint] = (this.metrics.endpointHits[endpoint] || 0) + 1;
    this.metrics.requestCount++;

    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      
      // Track response times
      this.metrics.responseTimes.push(responseTime);
      if (this.metrics.responseTimes.length > this.MAX_RESPONSE_TIMES) {
        this.metrics.responseTimes = this.metrics.responseTimes.slice(-this.MAX_RESPONSE_TIMES);
      }

      // Update average response time
      this.updateAverageResponseTime();

      // Track errors
      if (res.statusCode >= 400) {
        this.metrics.errorCount++;
        const errorType = this.getErrorType(res.statusCode);
        this.metrics.errorsByType[errorType] = (this.metrics.errorsByType[errorType] || 0) + 1;
      }

      this.metrics.lastUpdated = new Date();
    });

    next();
  };

  // Track user connections
  addActiveUser(userId: string) {
    this.activeConnections.add(userId);
    this.metrics.activeUsers = this.activeConnections.size;
  }

  removeActiveUser(userId: string) {
    this.activeConnections.delete(userId);
    this.metrics.activeUsers = this.activeConnections.size;
  }

  // Track messages
  incrementMessageCount() {
    this.metrics.messagesSent++;
  }

  // Get current metrics
  getMetrics(): Metrics {
    return { ...this.metrics };
  }

  // Get health status
  getHealthStatus() {
    const recentErrors = this.getRecentErrors();
    const avgResponseTime = this.metrics.averageResponseTime;

    return {
      status: this.determineHealthStatus(recentErrors, avgResponseTime),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      timestamp: new Date().toISOString(),
      metrics: {
        totalRequests: this.metrics.requestCount,
        totalErrors: this.metrics.errorCount,
        errorRate: this.metrics.requestCount > 0 ? (this.metrics.errorCount / this.metrics.requestCount) * 100 : 0,
        averageResponseTime: avgResponseTime,
        activeUsers: this.metrics.activeUsers,
        messagesSent: this.metrics.messagesSent,
      },
    };
  }

  // Get detailed analytics
  getAnalytics() {
    return {
      ...this.getMetrics(),
      healthStatus: this.getHealthStatus(),
      topEndpoints: this.getTopEndpoints(),
      errorBreakdown: this.metrics.errorsByType,
      performanceMetrics: {
        p95ResponseTime: this.getPercentileResponseTime(95),
        p99ResponseTime: this.getPercentileResponseTime(99),
        slowestEndpoints: this.getSlowestEndpoints(),
      },
    };
  }

  // Reset metrics (useful for testing or daily resets)
  resetMetrics() {
    this.metrics = {
      requestCount: 0,
      errorCount: 0,
      averageResponseTime: 0,
      activeUsers: this.activeConnections.size,
      messagesSent: 0,
      responseTimes: [],
      errorsByType: {},
      endpointHits: {},
      lastUpdated: new Date(),
    };
  }

  private updateAverageResponseTime() {
    if (this.metrics.responseTimes.length > 0) {
      const sum = this.metrics.responseTimes.reduce((a, b) => a + b, 0);
      this.metrics.averageResponseTime = sum / this.metrics.responseTimes.length;
    }
  }

  private getErrorType(statusCode: number): string {
    if (statusCode >= 400 && statusCode < 500) return '4xx Client Error';
    if (statusCode >= 500) return '5xx Server Error';
    return 'Other Error';
  }

  private getRecentErrors(): number {
    // Count errors in the last 5 minutes
    // This is a simplified version - in production, you'd want to track error timestamps
    return this.metrics.errorCount;
  }

  private determineHealthStatus(recentErrors: number, avgResponseTime: number): string {
    if (recentErrors > 10 || avgResponseTime > 5000) return 'critical';
    if (recentErrors > 5 || avgResponseTime > 2000) return 'warning';
    return 'healthy';
  }

  private getTopEndpoints(limit: number = 10) {
    return Object.entries(this.metrics.endpointHits)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([endpoint, hits]) => ({ endpoint, hits }));
  }

  private getPercentileResponseTime(percentile: number): number {
    if (this.metrics.responseTimes.length === 0) return 0;
    
    const sorted = [...this.metrics.responseTimes].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  private getSlowestEndpoints() {
    // This would require tracking response times per endpoint
    // For now, return empty array
    return [];
  }
}

export const monitoringService = new MonitoringService();

// Health check endpoint middleware
export const healthCheck = (_req: Request, res: Response) => {
  const health = monitoringService.getHealthStatus();
  const statusCode = health.status === 'healthy' ? 200 : 
                    health.status === 'warning' ? 200 : 503;
  
  res.status(statusCode).json(health);
};

// Analytics endpoint middleware
export const analytics = (_req: Request, res: Response) => {
  const analyticsData = monitoringService.getAnalytics();
  res.json(analyticsData);
};
