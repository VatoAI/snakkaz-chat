/**
 * SnakkaZ Performance Monitor
 * 
 * Implementerer omfattende ytelsesovervåking og analytics for SnakkaZ.
 * Integrerer med Grafana for visualisering av metrics.
 */

import { createClient } from '@supabase/supabase-js';

// Konstanter
const METRICS_INTERVAL = 10000; // 10 sekunder
const LATENCY_THRESHOLD_WARNING = 100; // ms
const LATENCY_THRESHOLD_CRITICAL = 200; // ms
const ERROR_THRESHOLD_WARNING = 0.01; // 1%
const ERROR_THRESHOLD_CRITICAL = 0.05; // 5%

// Typedefinitioner
export interface PerformanceMetrics {
  timestamp: number;
  responseTime: number; // millisekunder
  cpuUsage: number; // prosent
  memoryUsage: number; // MB
  activeUsers: number;
  messagesSent: number;
  messagesReceived: number;
  errorRate: number; // prosent
  encryptionTime: number; // millisekunder
  decryptionTime: number; // millisekunder
  webrtcSuccessRate: number; // prosent
  supabaseFallbackRate: number; // prosent
}

export interface LatencyMeasurement {
  startTime: number;
  endTime?: number;
  operationType: string;
  success: boolean;
  metadata?: Record<string, any>;
}

export type MetricsSeverity = 'info' | 'warning' | 'critical' | 'success';

export interface MetricsAlert {
  timestamp: number;
  severity: MetricsSeverity;
  message: string;
  metric: string;
  value: number;
  threshold: number;
}

export interface PerformanceMonitorOptions {
  enableRealTimeMetrics?: boolean;
  grafanaUrl?: string;
  metricsEndpoint?: string;
  environment?: 'development' | 'staging' | 'production';
}

// Supabase-klient
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_ANON_KEY || ''
);

/**
 * PerformanceMonitor klasse for å overvåke og rapportere ytelse
 */
export class PerformanceMonitor {
  private metricsInterval: NodeJS.Timeout | null = null;
  private latencyMeasurements: Map<string, LatencyMeasurement> = new Map();
  private metrics: {
    current: PerformanceMetrics;
    history: PerformanceMetrics[];
  };
  private alerts: MetricsAlert[] = [];
  private options: Required<PerformanceMonitorOptions>;
  
  constructor(options?: PerformanceMonitorOptions) {
    // Standard opsjoner
    this.options = {
      enableRealTimeMetrics: options?.enableRealTimeMetrics ?? true,
      grafanaUrl: options?.grafanaUrl ?? 'http://localhost:3002',
      metricsEndpoint: options?.metricsEndpoint ?? '/api/metrics',
      environment: options?.environment ?? 'development',
    };
    
    // Initialiser nåværende metrics
    this.metrics = {
      current: this.initializeMetrics(),
      history: []
    };
  }

  /**
   * Initialiserer metrics med standardverdier
   */
  private initializeMetrics(): PerformanceMetrics {
    return {
      timestamp: Date.now(),
      responseTime: 0,
      cpuUsage: 0,
      memoryUsage: 0,
      activeUsers: 0,
      messagesSent: 0,
      messagesReceived: 0,
      errorRate: 0,
      encryptionTime: 0,
      decryptionTime: 0,
      webrtcSuccessRate: 0,
      supabaseFallbackRate: 0
    };
  }

  /**
   * Starter overvåking av ytelse
   */
  startMonitoring(): void {
    // Start periodisk innsamling av metrics
    if (this.options.enableRealTimeMetrics && !this.metricsInterval) {
      this.metricsInterval = setInterval(() => this.collectAndReportMetrics(), METRICS_INTERVAL);
      
      // Registrer navigasjonshendelser for å måle sidelastetider
      this.registerNavigationObserver();
      
      // Registrer ressurshendelser for å overvåke ressurslasting
      this.registerResourceObserver();
      
      console.log(`Performance monitoring started in ${this.options.environment} environment`);
    }
  }

  /**
   * Stopper overvåking av ytelse
   */
  stopMonitoring(): void {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
      console.log('Performance monitoring stopped');
    }
  }

  /**
   * Samler inn og rapporterer metrics
   */
  private async collectAndReportMetrics(): Promise<void> {
    try {
      // Oppdater nåværende metrics
      const currentMetrics = this.updateCurrentMetrics();
      
      // Lagre i historikken (behold bare de siste 100 målingene)
      this.metrics.history.push(currentMetrics);
      if (this.metrics.history.length > 100) {
        this.metrics.history.shift();
      }
      
      // Analyser metrics og generer varsler om nødvendig
      this.analyzeMetrics(currentMetrics);
      
      // Rapporter til server hvis i produksjon eller staging
      if (this.options.environment !== 'development') {
        await this.reportMetricsToServer(currentMetrics);
      }
    } catch (error) {
      console.error('Error collecting metrics:', error);
    }
  }

  /**
   * Oppdaterer nåværende metrics med nye verdier
   */
  private updateCurrentMetrics(): PerformanceMetrics {
    // Beregn gjennomsnittlig responstid
    const latencyMeasurements = Array.from(this.latencyMeasurements.values())
      .filter(m => m.endTime && m.success);
    
    const avgResponseTime = latencyMeasurements.length > 0
      ? latencyMeasurements.reduce((sum, m) => sum + (m.endTime! - m.startTime), 0) / latencyMeasurements.length
      : 0;
    
    // Beregn feilrate
    const totalMeasurements = Array.from(this.latencyMeasurements.values());
    const errorRate = totalMeasurements.length > 0
      ? totalMeasurements.filter(m => !m.success).length / totalMeasurements.length
      : 0;
    
    // Beregn krypterings- og dekrypteringstider
    const encryptionMeasurements = latencyMeasurements.filter(m => m.operationType === 'encryption');
    const decryptionMeasurements = latencyMeasurements.filter(m => m.operationType === 'decryption');
    
    const avgEncryptionTime = encryptionMeasurements.length > 0
      ? encryptionMeasurements.reduce((sum, m) => sum + (m.endTime! - m.startTime), 0) / encryptionMeasurements.length
      : 0;
    
    const avgDecryptionTime = decryptionMeasurements.length > 0
      ? decryptionMeasurements.reduce((sum, m) => sum + (m.endTime! - m.startTime), 0) / decryptionMeasurements.length
      : 0;
    
    // Beregn WebRTC-suksessrate
    const webrtcMeasurements = latencyMeasurements.filter(m => 
      m.operationType === 'webrtc_message' || m.operationType === 'supabase_message'
    );
    
    const webrtcSuccessRate = webrtcMeasurements.length > 0
      ? webrtcMeasurements.filter(m => m.operationType === 'webrtc_message').length / webrtcMeasurements.length
      : 0;
    
    const supabaseFallbackRate = webrtcMeasurements.length > 0
      ? webrtcMeasurements.filter(m => m.operationType === 'supabase_message').length / webrtcMeasurements.length
      : 0;
    
    // Opprett oppdaterte metrics
    const currentMetrics: PerformanceMetrics = {
      timestamp: Date.now(),
      responseTime: avgResponseTime,
      cpuUsage: this.getCPUUsage(),
      memoryUsage: this.getMemoryUsage(),
      activeUsers: this.getActiveUsers(),
      messagesSent: this.metrics.current.messagesSent,
      messagesReceived: this.metrics.current.messagesReceived,
      errorRate: errorRate * 100, // Konverter til prosent
      encryptionTime: avgEncryptionTime,
      decryptionTime: avgDecryptionTime,
      webrtcSuccessRate: webrtcSuccessRate * 100, // Konverter til prosent
      supabaseFallbackRate: supabaseFallbackRate * 100 // Konverter til prosent
    };
    
    // Oppdater nåværende metrics
    this.metrics.current = currentMetrics;
    
    // Nullstill latencymålinger
    this.latencyMeasurements.clear();
    
    return currentMetrics;
  }

  /**
   * Henter CPU-bruk
   */
  private getCPUUsage(): number {
    // I en nettleser kan vi ikke få faktisk CPU-bruk
    // Dette er en simulert verdi for demonstrasjonsformål
    return Math.random() * 20 + 5; // 5-25%
  }

  /**
   * Henter minnebruk
   */
  private getMemoryUsage(): number {
    // Hent minnebruk hvis tilgjengelig
    if (window.performance && window.performance.memory) {
      const memory = (window.performance as any).memory;
      return Math.round(memory.usedJSHeapSize / (1024 * 1024)); // Konverter til MB
    }
    
    // Simulert verdi hvis ikke tilgjengelig
    return Math.random() * 200 + 50; // 50-250 MB
  }

  /**
   * Henter antall aktive brukere
   */
  private getActiveUsers(): number {
    // I en faktisk implementasjon ville dette hentes fra en backend-tjeneste
    // Dette er en simulert verdi for demonstrasjonsformål
    return this.metrics.current.activeUsers || Math.floor(Math.random() * 100) + 10;
  }

  /**
   * Analyserer metrics og genererer varsler om nødvendig
   */
  private analyzeMetrics(metrics: PerformanceMetrics): void {
    // Sjekk responstid
    if (metrics.responseTime > LATENCY_THRESHOLD_CRITICAL) {
      this.addAlert({
        timestamp: Date.now(),
        severity: 'critical',
        message: `Response time critical: ${Math.round(metrics.responseTime)}ms`,
        metric: 'responseTime',
        value: metrics.responseTime,
        threshold: LATENCY_THRESHOLD_CRITICAL
      });
    } else if (metrics.responseTime > LATENCY_THRESHOLD_WARNING) {
      this.addAlert({
        timestamp: Date.now(),
        severity: 'warning',
        message: `Response time high: ${Math.round(metrics.responseTime)}ms`,
        metric: 'responseTime',
        value: metrics.responseTime,
        threshold: LATENCY_THRESHOLD_WARNING
      });
    }
    
    // Sjekk feilrate
    if (metrics.errorRate > ERROR_THRESHOLD_CRITICAL) {
      this.addAlert({
        timestamp: Date.now(),
        severity: 'critical',
        message: `Error rate critical: ${metrics.errorRate.toFixed(2)}%`,
        metric: 'errorRate',
        value: metrics.errorRate,
        threshold: ERROR_THRESHOLD_CRITICAL * 100
      });
    } else if (metrics.errorRate > ERROR_THRESHOLD_WARNING) {
      this.addAlert({
        timestamp: Date.now(),
        severity: 'warning',
        message: `Error rate high: ${metrics.errorRate.toFixed(2)}%`,
        metric: 'errorRate',
        value: metrics.errorRate,
        threshold: ERROR_THRESHOLD_WARNING * 100
      });
    }
    
    // Sjekk WebRTC-suksessrate
    if (metrics.webrtcSuccessRate < 50) {
      this.addAlert({
        timestamp: Date.now(),
        severity: 'warning',
        message: `WebRTC success rate low: ${metrics.webrtcSuccessRate.toFixed(2)}%`,
        metric: 'webrtcSuccessRate',
        value: metrics.webrtcSuccessRate,
        threshold: 50
      });
    }
    
    // Legg til suksessvarsel hvis alt er bra
    if (
      metrics.responseTime < LATENCY_THRESHOLD_WARNING &&
      metrics.errorRate < ERROR_THRESHOLD_WARNING &&
      metrics.webrtcSuccessRate > 80
    ) {
      this.addAlert({
        timestamp: Date.now(),
        severity: 'success',
        message: 'All metrics within healthy ranges',
        metric: 'health',
        value: 100,
        threshold: 100
      });
    }
  }

  /**
   * Legger til et varsel
   */
  private addAlert(alert: MetricsAlert): void {
    this.alerts.push(alert);
    
    // Behold bare de siste 100 varslene
    if (this.alerts.length > 100) {
      this.alerts.shift();
    }
    
    // Logg varselet til konsollen
    const logMethod = alert.severity === 'critical' 
      ? console.error 
      : alert.severity === 'warning' 
        ? console.warn 
        : console.info;
    
    logMethod(`[${alert.severity.toUpperCase()}] ${alert.message}`);
    
    // Send varselet til serveren hvis kritisk
    if (alert.severity === 'critical' && this.options.environment !== 'development') {
      this.reportAlertToServer(alert);
    }
  }

  /**
   * Rapporterer metrics til serveren
   */
  private async reportMetricsToServer(metrics: PerformanceMetrics): Promise<void> {
    try {
      // Send metrics til vår egen API
      const response = await fetch(`${this.options.metricsEndpoint}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...metrics,
          environment: this.options.environment
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to report metrics: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to report metrics:', error);
    }
  }

  /**
   * Rapporterer et varsel til serveren
   */
  private async reportAlertToServer(alert: MetricsAlert): Promise<void> {
    try {
      // Send varselet til Supabase for lagring og varsling
      await supabase
        .from('performance_alerts')
        .insert({
          severity: alert.severity,
          message: alert.message,
          metric: alert.metric,
          value: alert.value,
          threshold: alert.threshold,
          environment: this.options.environment,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to report alert:', error);
    }
  }

  /**
   * Registrerer en navigasjonsobserver for å måle sidelastetider
   */
  private registerNavigationObserver(): void {
    if ('PerformanceObserver' in window) {
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              
              // Registrer navigasjonstid
              this.startLatencyMeasurement('page_load');
              this.endLatencyMeasurement('page_load', true, {
                loadTime: navEntry.loadEventEnd - navEntry.startTime,
                dnsTime: navEntry.domainLookupEnd - navEntry.domainLookupStart,
                connectTime: navEntry.connectEnd - navEntry.connectStart,
                ttfb: navEntry.responseStart - navEntry.requestStart,
                domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.startTime
              });
            }
          }
        });
        
        navigationObserver.observe({ entryTypes: ['navigation'] });
      } catch (e) {
        console.error('Failed to register navigation observer:', e);
      }
    }
  }

  /**
   * Registrerer en ressursobserver for å overvåke ressurslasting
   */
  private registerResourceObserver(): void {
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming;
              
              // Ignorer små ressurser
              if (resourceEntry.transferSize < 1000) continue;
              
              // Registrer ressurslastetid
              const resourceId = `resource_${resourceEntry.name.split('/').pop()}`;
              this.startLatencyMeasurement(resourceId);
              this.endLatencyMeasurement(resourceId, true, {
                resourceType: resourceEntry.initiatorType,
                size: resourceEntry.transferSize,
                loadTime: resourceEntry.responseEnd - resourceEntry.startTime,
                url: resourceEntry.name
              });
            }
          }
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (e) {
        console.error('Failed to register resource observer:', e);
      }
    }
  }

  /**
   * Starter måling av latency
   */
  startLatencyMeasurement(operationId: string, operationType: string = 'generic'): void {
    this.latencyMeasurements.set(operationId, {
      startTime: performance.now(),
      operationType,
      success: false
    });
  }

  /**
   * Avslutter måling av latency
   */
  endLatencyMeasurement(operationId: string, success: boolean = true, metadata?: Record<string, any>): void {
    const measurement = this.latencyMeasurements.get(operationId);
    if (measurement) {
      measurement.endTime = performance.now();
      measurement.success = success;
      if (metadata) {
        measurement.metadata = metadata;
      }
    }
  }

  /**
   * Registrerer at en melding er sendt
   */
  recordMessageSent(transportType: 'webrtc' | 'supabase'): void {
    this.metrics.current.messagesSent++;
    
    // Start latencymåling for meldingen
    const messageId = `${transportType}_message_${Date.now()}`;
    this.startLatencyMeasurement(messageId, `${transportType}_message`);
    
    // Returner ID for bruk med recordMessageDelivered
    return messageId;
  }

  /**
   * Registrerer at en melding er levert
   */
  recordMessageDelivered(messageId: string, success: boolean = true): void {
    this.endLatencyMeasurement(messageId, success);
  }

  /**
   * Registrerer at en melding er mottatt
   */
  recordMessageReceived(transportType: 'webrtc' | 'supabase'): void {
    this.metrics.current.messagesReceived++;
    
    // Registrer mottatt melding
    const messageId = `received_${transportType}_${Date.now()}`;
    this.startLatencyMeasurement(messageId, `${transportType}_received`);
    this.endLatencyMeasurement(messageId, true);
  }

  /**
   * Registrerer krypteringstid
   */
  recordEncryptionTime(operationId: string): void {
    this.startLatencyMeasurement(operationId, 'encryption');
  }

  /**
   * Avslutter måling av krypteringstid
   */
  endEncryptionTime(operationId: string, success: boolean = true): void {
    this.endLatencyMeasurement(operationId, success);
  }

  /**
   * Registrerer dekrypteringstid
   */
  recordDecryptionTime(operationId: string): void {
    this.startLatencyMeasurement(operationId, 'decryption');
  }

  /**
   * Avslutter måling av dekrypteringstid
   */
  endDecryptionTime(operationId: string, success: boolean = true): void {
    this.endLatencyMeasurement(operationId, success);
  }

  /**
   * Henter gjeldende ytelsesmetrikker
   */
  getCurrentMetrics(): PerformanceMetrics {
    return { ...this.metrics.current };
  }

  /**
   * Henter historiske ytelsesmetrikker
   */
  getMetricsHistory(): PerformanceMetrics[] {
    return [...this.metrics.history];
  }

  /**
   * Henter varsler
   */
  getAlerts(severity?: MetricsSeverity, limit: number = 10): MetricsAlert[] {
    let filteredAlerts = severity
      ? this.alerts.filter(alert => alert.severity === severity)
      : this.alerts;
    
    // Sorter etter timestamp (nyeste først) og begrens antallet
    return filteredAlerts
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Genererer en helsestatus for systemet
   */
  getHealthStatus(): { status: string; details: Record<string, any> } {
    const currentMetrics = this.metrics.current;
    
    // Beregn en samlet helsescore
    let healthScore = 100;
    
    // Trekk fra poeng basert på problemer
    if (currentMetrics.responseTime > LATENCY_THRESHOLD_CRITICAL) {
      healthScore -= 30;
    } else if (currentMetrics.responseTime > LATENCY_THRESHOLD_WARNING) {
      healthScore -= 10;
    }
    
    if (currentMetrics.errorRate > ERROR_THRESHOLD_CRITICAL) {
      healthScore -= 30;
    } else if (currentMetrics.errorRate > ERROR_THRESHOLD_WARNING) {
      healthScore -= 10;
    }
    
    if (currentMetrics.webrtcSuccessRate < 50) {
      healthScore -= 20;
    } else if (currentMetrics.webrtcSuccessRate < 80) {
      healthScore -= 5;
    }
    
    // Bestem status basert på helsescore
    let status: string;
    if (healthScore >= 90) {
      status = 'dominating'; // 90-100 (utmerket ytelse)
    } else if (healthScore >= 75) {
      status = 'healthy'; // 75-89 (god ytelse)
    } else if (healthScore >= 50) {
      status = 'degraded'; // 50-74 (redusert ytelse)
    } else {
      status = 'critical'; // 0-49 (kritiske problemer)
    }
    
    return {
      status,
      details: {
        healthScore,
        responseTime: Math.round(currentMetrics.responseTime),
        errorRate: currentMetrics.errorRate.toFixed(2),
        webrtcSuccessRate: currentMetrics.webrtcSuccessRate.toFixed(2),
        activeUsers: currentMetrics.activeUsers,
        environment: this.options.environment
      }
    };
  }
}

/**
 * Eksporter en enkel versjon for integrering med eksisterende tjenester
 */
export const createPerformanceMonitor = (options?: PerformanceMonitorOptions): PerformanceMonitor => {
  return new PerformanceMonitor(options);
};
