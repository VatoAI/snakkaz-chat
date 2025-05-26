/**
 * Performance Monitoring Service for Snakkaz Chat
 * 
 * Dette verktøyet brukes for å spore og analysere ytelsen i appen,
 * identifisere flaskehalser, og gi innsikt i brukeropplevelsen.
 */
import * as Sentry from '@sentry/react';

// Typer av ytelsesmålinger
export enum PerformanceMetricType {
  NAVIGATION = 'navigation',       // Sidenavigering
  API_CALL = 'api_call',           // API-kall
  RENDER = 'render',               // Komponentrendering
  INTERACTION = 'interaction',     // Brukerinteraksjoner
  RESOURCE = 'resource',           // Ressurslasting
  CUSTOM = 'custom',               // Tilpassede målinger
}

// Grensesnitt for en ytelsesmåling
export interface PerformanceMetric {
  type: PerformanceMetricType;
  name: string;
  duration: number;
  timestamp: number;
  context?: Record<string, any>;
}

// Konfigurasjon for ytelsesovervåkeren
interface PerformanceMonitorConfig {
  enabled: boolean;
  sampleRate: number;
  sentryEnabled: boolean;
  consoleEnabled: boolean;
  slowThreshold: {
    navigation: number;  // millisekunder
    apiCall: number;     // millisekunder
    render: number;      // millisekunder
    interaction: number; // millisekunder
  };
}

// Standard konfigurasjon
const defaultConfig: PerformanceMonitorConfig = {
  enabled: import.meta.env.MODE === 'production',
  sampleRate: 0.1,  // 10% av alle målinger
  sentryEnabled: import.meta.env.MODE === 'production',
  consoleEnabled: import.meta.env.MODE !== 'production',
  slowThreshold: {
    navigation: 1000,   // 1 sekund
    apiCall: 500,       // 500 ms
    render: 100,        // 100 ms
    interaction: 100,   // 100 ms
  }
};

/**
 * Ytelsesovervåkingstjeneste
 */
class PerformanceMonitor {
  private config: PerformanceMonitorConfig;
  private metrics: PerformanceMetric[] = [];
  private activeMetrics: Map<string, number> = new Map();

  constructor(config: Partial<PerformanceMonitorConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.setupPerformanceObservers();
  }

  /**
   * Konfigurerer automatiske ytelsesmålere
   */
  private setupPerformanceObservers(): void {
    if (!this.config.enabled || typeof window === 'undefined' || !window.PerformanceObserver) {
      return;
    }

    try {
      // Observer for navigering
      const navObserver = new PerformanceObserver((entries) => {
        entries.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric({
              type: PerformanceMetricType.NAVIGATION,
              name: `Navigation: ${window.location.pathname}`,
              duration: navEntry.loadEventEnd - navEntry.startTime,
              timestamp: Date.now(),
              context: {
                url: window.location.href,
                domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.startTime,
                domInteractive: navEntry.domInteractive - navEntry.startTime,
                firstPaint: navEntry.responseStart - navEntry.startTime,
                redirectCount: navEntry.redirectCount,
                type: navEntry.type,
              }
            });
          }
        });
      });
      navObserver.observe({ type: 'navigation', buffered: true });

      // Observer for ressurser (bilder, scripts, etc.)
      const resourceObserver = new PerformanceObserver((entries) => {
        entries.getEntries().forEach((entry) => {
          // Filtrer vekk mindre viktige ressurser for å redusere datamengden
          if (this.shouldTrackResource(entry as PerformanceResourceTiming)) {
            this.recordMetric({
              type: PerformanceMetricType.RESOURCE,
              name: `Resource: ${(entry as PerformanceResourceTiming).name.split('/').pop()}`,
              duration: entry.duration,
              timestamp: Date.now(),
              context: {
                url: (entry as PerformanceResourceTiming).name,
                initiatorType: (entry as PerformanceResourceTiming).initiatorType,
                size: (entry as PerformanceResourceTiming).transferSize,
                cacheHit: (entry as PerformanceResourceTiming).transferSize === 0 && 
                          (entry as PerformanceResourceTiming).encodedBodySize > 0,
              }
            });
          }
        });
      });
      resourceObserver.observe({ type: 'resource', buffered: true });

      // Long Tasks API for å oppdage treghet i UI
      const longTaskObserver = new PerformanceObserver((entries) => {
        entries.getEntries().forEach((entry) => {
          this.recordMetric({
            type: PerformanceMetricType.CUSTOM,
            name: 'Long Task',
            duration: entry.duration,
            timestamp: Date.now(),
            context: {
              url: window.location.href,
              culprit: entry.name,
            }
          });
        });
      });
      longTaskObserver.observe({ type: 'longtask', buffered: true });

      console.log('Performance observers initialized');
    } catch (error) {
      console.warn('Failed to initialize performance observers:', error);
    }
  }

  /**
   * Avgjør om en ressurs skal spores basert på type, størrelse, etc.
   */
  private shouldTrackResource(resource: PerformanceResourceTiming): boolean {
    // Bare registrer en liten prosentandel av ressurser for å unngå for mye data
    if (Math.random() > this.config.sampleRate) {
      return false;
    }

    // Alltid spor trege ressurser
    if (resource.duration > 1000) {
      return true;
    }

    // Filtrer bort små ressurser som ikke er kritiske
    if (resource.transferSize < 50000) {
      // Spor selv små ressurser hvis de er JS eller CSS
      const url = resource.name.toLowerCase();
      return url.endsWith('.js') || url.endsWith('.css') || url.includes('api');
    }

    return true;
  }

  /**
   * Start en ytelsesmåling
   */
  public startMeasure(name: string, type: PerformanceMetricType = PerformanceMetricType.CUSTOM): string {
    if (!this.config.enabled) return name;
    
    const id = `${name}_${Date.now()}`;
    this.activeMetrics.set(id, performance.now());
    return id;
  }

  /**
   * Avslutt og registrer en ytelsesmåling
   */
  public endMeasure(id: string, context?: Record<string, any>): void {
    if (!this.config.enabled || !this.activeMetrics.has(id)) return;
    
    const startTime = this.activeMetrics.get(id)!;
    const duration = performance.now() - startTime;
    this.activeMetrics.delete(id);
    
    const name = id.split('_')[0];
    
    this.recordMetric({
      type: this.getMetricTypeFromName(name),
      name,
      duration,
      timestamp: Date.now(),
      context,
    });
  }

  /**
   * Bestem metrikk-type basert på navn
   */
  private getMetricTypeFromName(name: string): PerformanceMetricType {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('api') || lowerName.includes('fetch') || lowerName.includes('request')) {
      return PerformanceMetricType.API_CALL;
    }
    if (lowerName.includes('render') || lowerName.includes('component')) {
      return PerformanceMetricType.RENDER;
    }
    if (lowerName.includes('click') || lowerName.includes('input') || lowerName.includes('interaction')) {
      return PerformanceMetricType.INTERACTION;
    }
    return PerformanceMetricType.CUSTOM;
  }

  /**
   * Registrer en ytelsesmåling direkte
   */
  public recordMetric(metric: PerformanceMetric): void {
    if (!this.config.enabled) return;
    
    // Legg til i lokal cache
    this.metrics.push(metric);
    
    // Behold bare siste 100 målinger for minnebruk
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }
    
    // Logg til konsoll i utviklingsmodusen
    if (this.config.consoleEnabled) {
      this.logMetricToConsole(metric);
    }
    
    // Send til Sentry hvis aktivert
    if (this.config.sentryEnabled) {
      this.sendToSentry(metric);
    }
    
    // Sjekk etter treg ytelse
    this.checkForSlowPerformance(metric);
  }

  /**
   * Direkte måling av API-kall
   */
  public measureApiCall(name: string, durationMs: number, context?: Record<string, any>): void {
    this.recordMetric({
      type: PerformanceMetricType.API_CALL,
      name,
      duration: durationMs,
      timestamp: Date.now(),
      context,
    });
  }

  /**
   * Logg en ytelsesmåling til konsollen med farger
   */
  private logMetricToConsole(metric: PerformanceMetric): void {
    const isSlow = this.isMetricSlow(metric);
    
    const style = isSlow 
      ? 'color: #ff5555; font-weight: bold;' 
      : 'color: #8be9fd;';
    
    console.groupCollapsed(
      `%c🔍 Performance: ${metric.name} (${Math.round(metric.duration)}ms)`,
      style
    );
    
    console.log('Type:', metric.type);
    console.log('Duration:', Math.round(metric.duration), 'ms');
    
    if (metric.context) {
      console.log('Context:', metric.context);
    }
    
    console.groupEnd();
  }

  /**
   * Sjekk om en metrikkprestasjon er under grenseverdien for "treg"
   */
  private isMetricSlow(metric: PerformanceMetric): boolean {
    switch (metric.type) {
      case PerformanceMetricType.NAVIGATION:
        return metric.duration > this.config.slowThreshold.navigation;
      case PerformanceMetricType.API_CALL:
        return metric.duration > this.config.slowThreshold.apiCall;
      case PerformanceMetricType.RENDER:
        return metric.duration > this.config.slowThreshold.render;
      case PerformanceMetricType.INTERACTION:
        return metric.duration > this.config.slowThreshold.interaction;
      default:
        return false;
    }
  }

  /**
   * Sjekk ytelsesmålinger for problemer og logg advarsler
   */
  private checkForSlowPerformance(metric: PerformanceMetric): void {
    if (this.isMetricSlow(metric)) {
      console.warn(`Slow performance detected: ${metric.name} took ${Math.round(metric.duration)}ms`);
      
      // Send til Sentry selv om generell Sentry-rapportering er deaktivert
      if (metric.duration > this.config.slowThreshold.navigation * 2) {
        this.sendToSentry(metric, true); // Force send for critical issues
      }
    }
  }

  /**
   * Send metrikk til Sentry
   */
  private sendToSentry(metric: PerformanceMetric, force: boolean = false): void {
    if (!this.config.sentryEnabled && !force) return;
    
    try {
      // For å unngå for mye data, sampler vi målinger
      if (!force && Math.random() > this.config.sampleRate) {
        return;
      }
      
      Sentry.addBreadcrumb({
        category: 'performance',
        message: `${metric.name} (${Math.round(metric.duration)}ms)`,
        data: {
          type: metric.type,
          duration: Math.round(metric.duration),
          ...metric.context
        },
        level: this.isMetricSlow(metric) ? 'warning' : 'info'
      });
      
      // For alvorlig treg ytelse, send som egne hendelser
      if (this.isMetricSlow(metric) && 
          (metric.type === PerformanceMetricType.NAVIGATION || 
           metric.type === PerformanceMetricType.API_CALL)) {
        Sentry.captureMessage(
          `Slow ${metric.type}: ${metric.name} (${Math.round(metric.duration)}ms)`,
          { level: 'warning' }
        );
      }
      
    } catch (error) {
      // Feil i ytelsesovervåking bør ikke krasje appen
      console.error('Failed to send performance metric to Sentry:', error);
    }
  }

  /**
   * Hent alle registrerte ytelsesmålinger
   */
  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Lag en ytelsesrapport
   */
  public getPerformanceReport(): Record<string, any> {
    if (this.metrics.length === 0) {
      return { message: 'No metrics collected' };
    }
    
    const apiCalls = this.metrics.filter(m => m.type === PerformanceMetricType.API_CALL);
    const renders = this.metrics.filter(m => m.type === PerformanceMetricType.RENDER);
    const navigations = this.metrics.filter(m => m.type === PerformanceMetricType.NAVIGATION);
    const interactions = this.metrics.filter(m => m.type === PerformanceMetricType.INTERACTION);
    
    const calculateAverage = (metrics: PerformanceMetric[]) => {
      if (metrics.length === 0) return 0;
      return metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;
    };
    
    return {
      totalMetricsCollected: this.metrics.length,
      apiCalls: {
        count: apiCalls.length,
        averageDuration: calculateAverage(apiCalls),
        slowestCall: apiCalls.length ? 
          apiCalls.sort((a, b) => b.duration - a.duration)[0] : null
      },
      rendering: {
        count: renders.length,
        averageDuration: calculateAverage(renders),
        slowestRender: renders.length ? 
          renders.sort((a, b) => b.duration - a.duration)[0] : null
      },
      navigation: {
        count: navigations.length,
        averageDuration: calculateAverage(navigations),
        details: navigations.map(n => ({
          page: n.name,
          duration: n.duration,
          timestamp: n.timestamp
        }))
      },
      interactions: {
        count: interactions.length,
        averageDuration: calculateAverage(interactions)
      }
    };
  }

  /**
   * Lag en wrapper for API-kall som måler ytelse
   */
  public createApiCallWrapper<T>(
    apiFunction: (...args: any[]) => Promise<T>,
    apiName: string
  ): (...args: any[]) => Promise<T> {
    return async (...args: any[]): Promise<T> => {
      const startTime = performance.now();
      try {
        const result = await apiFunction(...args);
        const duration = performance.now() - startTime;
        
        this.measureApiCall(apiName, duration, {
          success: true,
          args: args.map(arg => typeof arg === 'object' ? '[Object]' : arg).join(', ')
        });
        
        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        
        this.measureApiCall(apiName, duration, {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          args: args.map(arg => typeof arg === 'object' ? '[Object]' : arg).join(', ')
        });
        
        throw error;
      }
    };
  }

  /**
   * React Hook for å måle komponentrendering
   */
  public useComponentPerformance(componentName: string) {
    if (typeof window === 'undefined' || !this.config.enabled) {
      return { startMeasure: () => {}, endMeasure: () => {} };
    }
    
    return {
      startMeasure: () => this.startMeasure(`Render: ${componentName}`, PerformanceMetricType.RENDER),
      endMeasure: (id: string) => this.endMeasure(id)
    };
  }
}

// Eksporter en singleton-instans
export const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;