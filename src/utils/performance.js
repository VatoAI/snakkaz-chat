// Performance monitoring utilities for SnakkaZ
import { getEnvironmentConfig } from '../config/environment.js';

class PerformanceMonitor {
  constructor() {
    this.config = getEnvironmentConfig();
    this.metrics = {};
    this.observers = [];
    
    if (this.config.features.debugMode) {
      this.initializeMonitoring();
    }
  }

  initializeMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vitals' in window) {
      this.monitorWebVitals();
    }

    // Monitor resource loading
    if ('PerformanceObserver' in window) {
      this.monitorResourceLoading();
      this.monitorLongTasks();
    }

    // Monitor React renders (if available)
    this.monitorReactRenders();
  }

  monitorWebVitals() {
    // This would typically use the web-vitals library
    console.log('🔍 Performance monitoring initialized');
  }

  monitorResourceLoading() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.duration > 1000) { // Log slow resources
          console.warn(`🐌 Slow resource: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
        }
      });
    });

    observer.observe({ entryTypes: ['resource', 'navigation'] });
    this.observers.push(observer);
  }

  monitorLongTasks() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        console.warn(`⏱️ Long task detected: ${entry.duration.toFixed(2)}ms`);
      });
    });

    observer.observe({ entryTypes: ['longtask'] });
    this.observers.push(observer);
  }

  monitorReactRenders() {
    // React DevTools profiler integration would go here
    if (this.config.isDevelopment) {
      console.log('⚛️ React render monitoring available in DevTools');
    }
  }

  logMetric(name, value, unit = 'ms') {
    this.metrics[name] = { value, unit, timestamp: Date.now() };
    
    if (this.config.features.debugMode) {
      console.log(`📊 Metric: ${name} = ${value}${unit}`);
    }
  }

  getMetrics() {
    return this.metrics;
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Export utilities
export const logPerformance = (name, value, unit) => performanceMonitor.logMetric(name, value, unit);
export const getPerformanceMetrics = () => performanceMonitor.getMetrics();
export const cleanupPerformanceMonitoring = () => performanceMonitor.cleanup();

export default performanceMonitor;
