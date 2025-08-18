/**
 * SnakkaZ Chat Performance Monitoring
 * Complete metrics tracking for production readiness
 */

// Performance metrics interface
interface PerformanceMetric {
  name: string;
  value: number;
  id: string;
  url: string;
  timestamp: number;
  device: "mobile" | "desktop";
  connection?: string;
}

// Chat-specific performance metrics
interface ChatMetrics {
  messageRenderTime: number;
  webSocketLatency: number;
  typingIndicatorDelay: number;
  glassmorphismFPS: number;
  memoryUsage: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private chatMetrics: Partial<ChatMetrics> = {};
  private observer?: PerformanceObserver;

  constructor(private analyticsEndpoint: string = "/api/analytics") {
    this.initializeWebVitals();
    this.initializeChatMetrics();
    this.setupPerformanceObserver();
  }

  private initializeWebVitals() {
    // Custom implementation of core web vitals without external dependency
    this.initializeCustomVitals();
  }

  private initializeCustomVitals() {
    // Basic performance metrics implementation
    if (typeof window === "undefined") return;

    // First Contentful Paint (FCP)
    if ("PerformanceObserver" in window) {
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === "first-contentful-paint") {
              this.sendCustomMetric("FCP", entry.startTime);
            }
          }
        });
        fcpObserver.observe({ entryTypes: ["paint"] });
      } catch (e) {
        console.warn("FCP observer not supported");
      }
    }

    // Navigation timing
    window.addEventListener("load", () => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        // Time to First Byte
        const ttfb = navigation.responseStart - navigation.requestStart;
        this.sendCustomMetric("TTFB", ttfb);

        // Load Complete
        const loadComplete =
          navigation.loadEventEnd - navigation.loadEventStart;
        this.sendCustomMetric("load-complete", loadComplete);

        // DOM Interactive
        const domInteractive =
          navigation.domInteractive - navigation.fetchStart;
        this.sendCustomMetric("dom-interactive", domInteractive);
      }
    });

    // Basic FID approximation using event listeners
    ["click", "keydown", "touchstart"].forEach((eventType) => {
      document.addEventListener(eventType, this.measureInputDelay.bind(this), {
        once: true,
        passive: true,
      });
    });
  }

  private measureInputDelay(event: Event) {
    const eventTime = event.timeStamp;
    const processingTime = performance.now();
    const delay = processingTime - eventTime;

    if (delay > 0) {
      this.sendCustomMetric("FID-approx", delay);
    }
  }

  private initializeChatMetrics() {
    // Custom chat performance tracking
    this.trackMessageRenderTime();
    this.trackWebSocketLatency();
    this.trackMemoryUsage();
  }

  private setupPerformanceObserver() {
    if ("PerformanceObserver" in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "measure" && entry.name.startsWith("chat-")) {
            this.sendCustomMetric(entry.name, entry.duration);
          }
        }
      });

      try {
        this.observer.observe({
          entryTypes: ["measure", "navigation", "resource"],
        });
      } catch (e) {
        console.warn("Performance Observer not fully supported:", e);
      }
    }
  }

  sendMetric(metric: any) {
    const enrichedMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      id: metric.id,
      url: window.location.href,
      timestamp: Date.now(),
      device: this.getDeviceType(),
      connection: this.getConnectionType(),
    };

    this.metrics.push(enrichedMetric);
    this.sendToAnalytics(enrichedMetric);
  }

  sendCustomMetric(name: string, value: number) {
    const metric: PerformanceMetric = {
      name,
      value,
      id: `${name}-${Date.now()}`,
      url: window.location.href,
      timestamp: Date.now(),
      device: this.getDeviceType(),
      connection: this.getConnectionType(),
    };

    this.sendToAnalytics(metric);
  }

  private sendToAnalytics(metric: PerformanceMetric) {
    const body = JSON.stringify(metric);

    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon(this.analyticsEndpoint, body);
    } else {
      // Fallback to fetch
      fetch(this.analyticsEndpoint, {
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      }).catch(console.error);
    }
  }

  private getDeviceType(): "mobile" | "desktop" {
    return window.innerWidth <= 768 ? "mobile" : "desktop";
  }

  private getConnectionType(): string {
    const nav = navigator as any;
    return nav.connection?.effectiveType || "unknown";
  }

  // Chat-specific performance tracking methods
  trackMessageRenderTime() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          const messageElements = Array.from(mutation.addedNodes).filter(
            (node) =>
              node.nodeType === Node.ELEMENT_NODE &&
              (node as Element).classList.contains("message-bubble")
          );

          if (messageElements.length > 0) {
            performance.mark("message-render-start");
            requestAnimationFrame(() => {
              performance.mark("message-render-end");
              performance.measure(
                "chat-message-render",
                "message-render-start",
                "message-render-end"
              );
            });
          }
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return observer;
  }

  trackWebSocketLatency() {
    const originalSend = WebSocket.prototype.send;

    WebSocket.prototype.send = function (
      data: string | ArrayBufferLike | Blob | ArrayBufferView
    ) {
      const timestamp = Date.now();

      try {
        const parsed = typeof data === "string" ? JSON.parse(data) : null;
        if (parsed && parsed.type === "message") {
          parsed.clientTimestamp = timestamp;
          data = JSON.stringify(parsed);
        }
      } catch (e) {
        // Not JSON, continue with original data
      }

      return originalSend.call(this, data);
    };
  }

  trackTypingIndicatorDelay() {
    performance.mark("typing-start");

    return () => {
      performance.mark("typing-end");
      performance.measure("chat-typing-delay", "typing-start", "typing-end");
    };
  }

  trackGlassmorphismFPS() {
    let frameCount = 0;
    let startTime = performance.now();

    const countFrames = () => {
      frameCount++;
      const elapsed = performance.now() - startTime;

      if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        this.sendCustomMetric("chat-glassmorphism-fps", fps);

        frameCount = 0;
        startTime = performance.now();
      }

      requestAnimationFrame(countFrames);
    };

    requestAnimationFrame(countFrames);
  }

  trackMemoryUsage() {
    if ("memory" in performance) {
      const memory = (performance as any).memory;

      setInterval(() => {
        this.sendCustomMetric("chat-memory-used", memory.usedJSHeapSize);
        this.sendCustomMetric("chat-memory-total", memory.totalJSHeapSize);
        this.sendCustomMetric("chat-memory-limit", memory.jsHeapSizeLimit);
      }, 30000); // Every 30 seconds
    }
  }

  // Network performance tracking
  trackNetworkLatency() {
    if ("performance" in window && "getEntriesByType" in performance) {
      const entries = performance.getEntriesByType(
        "navigation"
      ) as PerformanceNavigationTiming[];
      if (entries.length > 0) {
        const navigation = entries[0];
        const latency = navigation.responseStart - navigation.requestStart;
        this.sendCustomMetric("chat-network-latency", latency);
      }
    }
  }

  // Error tracking
  trackError(error: Error, context: string) {
    this.sendCustomMetric(`chat-error-${context}`, 1);

    // Send detailed error info
    fetch("/api/errors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        context,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      }),
    }).catch(console.error);
  }

  // Performance budget validation
  validatePerformanceBudgets() {
    const budgets = {
      FCP: 1200, // First Contentful Paint < 1.2s
      LCP: 2500, // Largest Contentful Paint < 2.5s
      FID: 100, // First Input Delay < 100ms
      CLS: 0.1, // Cumulative Layout Shift < 0.1
      "chat-message-render": 100, // Message render < 100ms
    };

    this.metrics.forEach((metric) => {
      const budget = budgets[metric.name as keyof typeof budgets];
      if (budget && metric.value > budget) {
        console.warn(
          `Performance budget exceeded: ${metric.name} = ${metric.value}ms (budget: ${budget}ms)`
        );
        this.sendCustomMetric(`budget-exceeded-${metric.name}`, metric.value);
      }
    });
  }

  // Real-time monitoring dashboard data
  getRealtimeMetrics(): ChatMetrics & { vitals: PerformanceMetric[] } {
    return {
      messageRenderTime: 0,
      webSocketLatency: 0,
      typingIndicatorDelay: 0,
      glassmorphismFPS: 0,
      memoryUsage: 0,
      ...this.chatMetrics,
      vitals: this.metrics.slice(-10), // Last 10 metrics
    };
  }

  // Cleanup
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export const getPerformanceMonitor = (
  analyticsEndpoint?: string
): PerformanceMonitor => {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor(analyticsEndpoint);
  }
  return performanceMonitor;
};

// Simple function-based API for non-React usage
export const trackPerformance = {
  init: (analyticsEndpoint?: string) =>
    getPerformanceMonitor(analyticsEndpoint),
  trackCustomEvent: (name: string, value: number) => {
    getPerformanceMonitor().sendCustomMetric(name, value);
  },
  trackError: (error: Error, context: string) => {
    getPerformanceMonitor().trackError(error, context);
  },
  validateBudgets: () => {
    getPerformanceMonitor().validatePerformanceBudgets();
  },
  getMetrics: () => {
    return getPerformanceMonitor().getRealtimeMetrics();
  },
};

export type { PerformanceMetric, ChatMetrics };
export default PerformanceMonitor;
