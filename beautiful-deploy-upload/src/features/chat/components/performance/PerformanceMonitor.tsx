/**
 * Performance Monitor Component for Snakkaz Chat
 * 
 * This component implements Core Web Vitals monitoring, performance metrics collection,
 * and real-time performance tracking for the chat application.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  Clock, 
  Eye, 
  Download, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Performance metrics interfaces
interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

interface PerformanceMetrics {
  coreWebVitals: CoreWebVitals;
  bundleSize: {
    main: number;
    vendor: number;
    total: number;
  };
  memoryUsage: {
    usedJSSize: number;
    totalJSSize: number;
    usedPercent: number;
  };
  networkMetrics: {
    connectionType: string;
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
  renderMetrics: {
    componentCount: number;
    averageRenderTime: number;
    slowestComponent: string;
    fastestComponent: string;
  };
}

interface PerformanceBudget {
  maxBundleSize: number; // in MB
  maxLCP: number; // in ms
  maxFID: number; // in ms
  maxCLS: number; // score
  maxMemoryUsage: number; // in %
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  showDetails?: boolean;
  performanceBudget?: PerformanceBudget;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

// Default performance budget
const defaultBudget: PerformanceBudget = {
  maxBundleSize: 5, // 5MB
  maxLCP: 2500, // 2.5s
  maxFID: 100, // 100ms
  maxCLS: 0.1, // 0.1 score
  maxMemoryUsage: 70 // 70%
};

export function PerformanceMonitor({
  enabled = true,
  showDetails = false,
  performanceBudget = defaultBudget,
  onMetricsUpdate
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [violations, setViolations] = useState<string[]>([]);
  const { toast } = useToast();

  // Collect Core Web Vitals
  const collectCoreWebVitals = useCallback((): Promise<CoreWebVitals> => {
    return new Promise((resolve) => {
      const vitals: Partial<CoreWebVitals> = {};

      // LCP - Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry?.startTime || 0;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // FID - First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstEntry = entries[0];
          vitals.fid = firstEntry?.processingStart - firstEntry?.startTime || 0;
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // CLS - Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          vitals.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Collect timing metrics
        setTimeout(() => {
          const timing = performance.timing;
          vitals.fcp = timing.responseStart - timing.navigationStart;
          vitals.ttfb = timing.responseStart - timing.requestStart;

          resolve({
            lcp: vitals.lcp || 0,
            fid: vitals.fid || 0,
            cls: vitals.cls || 0,
            fcp: vitals.fcp || 0,
            ttfb: vitals.ttfb || 0
          });

          // Cleanup observers
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
        }, 3000);
      } else {
        // Fallback for browsers without PerformanceObserver
        const timing = performance.timing;
        resolve({
          lcp: timing.loadEventEnd - timing.navigationStart,
          fid: 0,
          cls: 0,
          fcp: timing.responseStart - timing.navigationStart,
          ttfb: timing.responseStart - timing.requestStart
        });
      }
    });
  }, []);

  // Collect bundle size metrics
  const collectBundleMetrics = useCallback(() => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    let mainSize = 0;
    let vendorSize = 0;

    resources.forEach((resource) => {
      if (resource.name.includes('.js')) {
        const size = resource.transferSize || 0;
        if (resource.name.includes('vendor')) {
          vendorSize += size;
        } else {
          mainSize += size;
        }
      }
    });

    return {
      main: Math.round(mainSize / 1024 / 1024 * 100) / 100, // MB
      vendor: Math.round(vendorSize / 1024 / 1024 * 100) / 100, // MB
      total: Math.round((mainSize + vendorSize) / 1024 / 1024 * 100) / 100 // MB
    };
  }, []);

  // Collect memory usage metrics
  const collectMemoryMetrics = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSSize: Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100, // MB
        totalJSSize: Math.round(memory.totalJSHeapSize / 1024 / 1024 * 100) / 100, // MB
        usedPercent: Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100)
      };
    }
    return {
      usedJSSize: 0,
      totalJSSize: 0,
      usedPercent: 0
    };
  }, []);

  // Collect network metrics
  const collectNetworkMetrics = useCallback(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        connectionType: connection?.type || 'unknown',
        effectiveType: connection?.effectiveType || 'unknown',
        downlink: connection?.downlink || 0,
        rtt: connection?.rtt || 0
      };
    }
    return {
      connectionType: 'unknown',
      effectiveType: 'unknown',
      downlink: 0,
      rtt: 0
    };
  }, []);

  // Collect render metrics (simplified)
  const collectRenderMetrics = useCallback(() => {
    const entries = performance.getEntriesByType('measure');
    const componentMeasures = entries.filter(entry => 
      entry.name.includes('React') || entry.name.includes('Component')
    );

    const renderTimes = componentMeasures.map(entry => entry.duration);
    const avgRenderTime = renderTimes.length > 0 
      ? renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length 
      : 0;

    return {
      componentCount: document.querySelectorAll('[data-reactroot] *').length,
      averageRenderTime: Math.round(avgRenderTime * 100) / 100,
      slowestComponent: 'GroupChat', // Placeholder
      fastestComponent: 'Button' // Placeholder
    };
  }, []);

  // Check performance budget violations
  const checkBudgetViolations = useCallback((metrics: PerformanceMetrics) => {
    const violations: string[] = [];

    if (metrics.bundleSize.total > performanceBudget.maxBundleSize) {
      violations.push(`Bundle size exceeds budget: ${metrics.bundleSize.total}MB > ${performanceBudget.maxBundleSize}MB`);
    }

    if (metrics.coreWebVitals.lcp > performanceBudget.maxLCP) {
      violations.push(`LCP exceeds budget: ${metrics.coreWebVitals.lcp}ms > ${performanceBudget.maxLCP}ms`);
    }

    if (metrics.coreWebVitals.fid > performanceBudget.maxFID) {
      violations.push(`FID exceeds budget: ${metrics.coreWebVitals.fid}ms > ${performanceBudget.maxFID}ms`);
    }

    if (metrics.coreWebVitals.cls > performanceBudget.maxCLS) {
      violations.push(`CLS exceeds budget: ${metrics.coreWebVitals.cls} > ${performanceBudget.maxCLS}`);
    }

    if (metrics.memoryUsage.usedPercent > performanceBudget.maxMemoryUsage) {
      violations.push(`Memory usage exceeds budget: ${metrics.memoryUsage.usedPercent}% > ${performanceBudget.maxMemoryUsage}%`);
    }

    return violations;
  }, [performanceBudget]);

  // Collect all performance metrics
  const collectMetrics = useCallback(async () => {
    if (!enabled) return;

    setIsCollecting(true);
    try {
      const [coreWebVitals, bundleSize, memoryUsage, networkMetrics, renderMetrics] = await Promise.all([
        collectCoreWebVitals(),
        Promise.resolve(collectBundleMetrics()),
        Promise.resolve(collectMemoryMetrics()),
        Promise.resolve(collectNetworkMetrics()),
        Promise.resolve(collectRenderMetrics())
      ]);

      const newMetrics: PerformanceMetrics = {
        coreWebVitals,
        bundleSize,
        memoryUsage,
        networkMetrics,
        renderMetrics
      };

      setMetrics(newMetrics);
      setLastUpdate(new Date());

      // Check budget violations
      const budgetViolations = checkBudgetViolations(newMetrics);
      setViolations(budgetViolations);

      // Show warnings for violations
      if (budgetViolations.length > 0) {
        toast({
          title: "Performance Budget Exceeded",
          description: `${budgetViolations.length} metric(s) exceed the performance budget`,
          variant: "destructive",
        });
      }

      // Call callback if provided
      if (onMetricsUpdate) {
        onMetricsUpdate(newMetrics);
      }

    } catch (error) {
      console.error('Failed to collect performance metrics:', error);
      toast({
        title: "Metrics Collection Failed",
        description: "Could not collect performance metrics",
        variant: "destructive",
      });
    } finally {
      setIsCollecting(false);
    }
  }, [enabled, collectCoreWebVitals, collectBundleMetrics, collectMemoryMetrics, collectNetworkMetrics, collectRenderMetrics, checkBudgetViolations, onMetricsUpdate, toast]);

  // Auto-collect metrics on mount and periodically
  useEffect(() => {
    if (!enabled) return;

    // Initial collection after page load
    const timer = setTimeout(() => {
      collectMetrics();
    }, 2000);

    // Periodic collection every 30 seconds
    const interval = setInterval(() => {
      collectMetrics();
    }, 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [enabled, collectMetrics]);

  // Get status color based on metric value
  const getStatusColor = (value: number, threshold: number, invert = false) => {
    const isGood = invert ? value > threshold : value < threshold;
    return isGood ? 'text-green-500' : 'text-red-500';
  };

  // Get status icon based on metric value
  const getStatusIcon = (value: number, threshold: number, invert = false) => {
    const isGood = invert ? value > threshold : value < threshold;
    return isGood ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />;
  };

  if (!enabled) return null;

  return (
    <div className="space-y-4">
      {/* Performance Overview */}
      <Card className="bg-cyberdark-800/50 border-cybergold-500/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-cybergold-400" />
              <CardTitle className="text-lg text-cybergold-200">Performance Monitor</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              {violations.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {violations.length} violations
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={collectMetrics}
                disabled={isCollecting}
                className="text-cybergold-400 hover:text-cybergold-300"
              >
                <RefreshCw className={`h-4 w-4 ${isCollecting ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          {lastUpdate && (
            <CardDescription className="text-cybergold-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </CardDescription>
          )}
        </CardHeader>

        {metrics && (
          <CardContent className="space-y-4">
            {/* Core Web Vitals */}
            <div>
              <h4 className="text-sm font-medium text-cybergold-200 mb-3 flex items-center">
                <Zap className="h-4 w-4 mr-1" />
                Core Web Vitals
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-cyberdark-900/50 p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-cybergold-500">LCP</span>
                    <span className={`text-xs ${getStatusColor(metrics.coreWebVitals.lcp, performanceBudget.maxLCP)}`}>
                      {getStatusIcon(metrics.coreWebVitals.lcp, performanceBudget.maxLCP)}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-white mt-1">
                    {Math.round(metrics.coreWebVitals.lcp)}ms
                  </div>
                </div>
                
                <div className="bg-cyberdark-900/50 p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-cybergold-500">FID</span>
                    <span className={`text-xs ${getStatusColor(metrics.coreWebVitals.fid, performanceBudget.maxFID)}`}>
                      {getStatusIcon(metrics.coreWebVitals.fid, performanceBudget.maxFID)}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-white mt-1">
                    {Math.round(metrics.coreWebVitals.fid)}ms
                  </div>
                </div>
                
                <div className="bg-cyberdark-900/50 p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-cybergold-500">CLS</span>
                    <span className={`text-xs ${getStatusColor(metrics.coreWebVitals.cls, performanceBudget.maxCLS)}`}>
                      {getStatusIcon(metrics.coreWebVitals.cls, performanceBudget.maxCLS)}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-white mt-1">
                    {metrics.coreWebVitals.cls.toFixed(3)}
                  </div>
                </div>
                
                <div className="bg-cyberdark-900/50 p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-cybergold-500">FCP</span>
                    <Clock className="h-3 w-3 text-cybergold-400" />
                  </div>
                  <div className="text-sm font-medium text-white mt-1">
                    {Math.round(metrics.coreWebVitals.fcp)}ms
                  </div>
                </div>
                
                <div className="bg-cyberdark-900/50 p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-cybergold-500">TTFB</span>
                    <Download className="h-3 w-3 text-cybergold-400" />
                  </div>
                  <div className="text-sm font-medium text-white mt-1">
                    {Math.round(metrics.coreWebVitals.ttfb)}ms
                  </div>
                </div>
              </div>
            </div>

            {/* Bundle Size */}
            <div>
              <h4 className="text-sm font-medium text-cybergold-200 mb-3">Bundle Size</h4>
              <div className="bg-cyberdark-900/50 p-3 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-cybergold-500">Total Bundle Size</span>
                  <span className={`text-sm font-medium ${getStatusColor(metrics.bundleSize.total, performanceBudget.maxBundleSize)}`}>
                    {metrics.bundleSize.total}MB
                  </span>
                </div>
                <Progress 
                  value={(metrics.bundleSize.total / performanceBudget.maxBundleSize) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-cybergold-500 mt-1">
                  <span>Main: {metrics.bundleSize.main}MB</span>
                  <span>Vendor: {metrics.bundleSize.vendor}MB</span>
                </div>
              </div>
            </div>

            {/* Memory Usage */}
            <div>
              <h4 className="text-sm font-medium text-cybergold-200 mb-3">Memory Usage</h4>
              <div className="bg-cyberdark-900/50 p-3 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-cybergold-500">JS Heap Usage</span>
                  <span className={`text-sm font-medium ${getStatusColor(metrics.memoryUsage.usedPercent, performanceBudget.maxMemoryUsage)}`}>
                    {metrics.memoryUsage.usedPercent}%
                  </span>
                </div>
                <Progress 
                  value={metrics.memoryUsage.usedPercent} 
                  className="h-2"
                />
                <div className="text-xs text-cybergold-500 mt-1">
                  {metrics.memoryUsage.usedJSSize}MB / {metrics.memoryUsage.totalJSSize}MB
                </div>
              </div>
            </div>

            {showDetails && (
              <>
                {/* Network Info */}
                <div>
                  <h4 className="text-sm font-medium text-cybergold-200 mb-3">Network</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-cyberdark-900/50 p-3 rounded-md">
                      <div className="text-xs text-cybergold-500">Connection</div>
                      <div className="text-sm font-medium text-white mt-1">
                        {metrics.networkMetrics.effectiveType}
                      </div>
                    </div>
                    <div className="bg-cyberdark-900/50 p-3 rounded-md">
                      <div className="text-xs text-cybergold-500">Downlink</div>
                      <div className="text-sm font-medium text-white mt-1">
                        {metrics.networkMetrics.downlink} Mbps
                      </div>
                    </div>
                  </div>
                </div>

                {/* Render Performance */}
                <div>
                  <h4 className="text-sm font-medium text-cybergold-200 mb-3">Render Performance</h4>
                  <div className="bg-cyberdark-900/50 p-3 rounded-md">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-cybergold-500">Components</div>
                        <div className="text-sm font-medium text-white">
                          {metrics.renderMetrics.componentCount}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-cybergold-500">Avg Render Time</div>
                        <div className="text-sm font-medium text-white">
                          {metrics.renderMetrics.averageRenderTime}ms
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Violations */}
            {violations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-400 mb-3 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Performance Budget Violations
                </h4>
                <div className="space-y-2">
                  {violations.map((violation, index) => (
                    <div key={index} className="bg-red-900/20 border border-red-500/30 p-2 rounded-md">
                      <div className="text-xs text-red-400">{violation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
