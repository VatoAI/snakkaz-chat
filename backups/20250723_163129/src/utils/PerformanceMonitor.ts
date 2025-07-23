/**
 * SNAKKAZ PERFORMANCE MONITOR - JUNI 7, 2025
 * Real-time monitoring for norsk tech community
 * Fokus: Hastighet, Stabilitet, Brukeropplevelse
 */

export class SnakkazPerformanceMonitor {
  private metrics: {[key: string]: number} = {};
  private observers: PerformanceObserver[] = [];
  
  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    // Core Web Vitals monitoring
    this.observeLargestContentfulPaint();
    this.observeFirstInputDelay();
    this.observeCumulativeLayoutShift();
    this.observePageLoadMetrics();
    
    // Norwegian UX specific metrics
    this.monitorChatResponseTime();
    this.monitorNavigationSpeed();
    
    console.log('🇳🇴 Snakkaz Performance Monitor: Active for norsk tech community');
  }

  private observeLargestContentfulPaint() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.metrics.lcp = lastEntry.startTime;
        
        // Log if performance is not optimal for Norwegian users
        if (lastEntry.startTime > 2500) {
          console.warn('🚨 LCP > 2.5s - May impact Norwegian user experience');
          this.reportSlowPerformance('LCP', lastEntry.startTime);
        } else {
          console.log(`✅ LCP: ${Math.round(lastEntry.startTime)}ms - Excellent for norsk community`);
        }
      });
      
      // Check if entryType is supported before observing
      if (PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint')) {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(observer);
      }
    } catch (error) {
      console.log('ℹ️ Largest Contentful Paint monitoring not supported in this environment');
    }
  }

  private observeFirstInputDelay() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          // Type assertion for first-input entries
          const fidEntry = entry as any;
          const fid = fidEntry.processingStart - fidEntry.startTime;
          this.metrics.fid = fid;
          
          if (fid > 100) {
            console.warn('🚨 FID > 100ms - Chat responsiveness may be affected');
          } else {
            console.log(`✅ FID: ${Math.round(fid)}ms - Responsive for norsk tech users`);
          }
        }
      });
      
      // Check if entryType is supported before observing
      if (PerformanceObserver.supportedEntryTypes.includes('first-input')) {
        observer.observe({ entryTypes: ['first-input'] });
        this.observers.push(observer);
      }
    } catch (error) {
      console.log('ℹ️ First Input Delay monitoring not supported in this environment');
    }
  }

  private observeCumulativeLayoutShift() {
    let clsValue = 0;
    
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Type assertion for layout-shift entries
          const clsEntry = entry as any;
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value;
          }
        }
        
        this.metrics.cls = clsValue;
        
        if (clsValue > 0.1) {
          console.warn('🚨 CLS > 0.1 - Layout shifts may confuse Norwegian users');
        } else {
          console.log(`✅ CLS: ${clsValue.toFixed(3)} - Stable layout for community`);
        }
      });
      
      // Check if entryType is supported before observing
      if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
        observer.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(observer);
      } else {
        console.log('ℹ️ Layout Shift monitoring not supported - using fallback');
      }
    } catch (error) {
      console.log('ℹ️ Cumulative Layout Shift monitoring not supported in this environment');
    }
  }

  private observePageLoadMetrics() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
      const firstByte = navigation.responseStart - navigation.fetchStart;
      
      this.metrics.loadTime = loadTime;
      this.metrics.domContentLoaded = domContentLoaded;
      this.metrics.ttfb = firstByte;
      
      console.log(`📊 Page Load Metrics for Norwegian Tech Community:`);
      console.log(`   ⚡ Total Load: ${Math.round(loadTime)}ms`);
      console.log(`   🏗️  DOM Ready: ${Math.round(domContentLoaded)}ms`);
      console.log(`   🌐 First Byte: ${Math.round(firstByte)}ms`);
      
      // Report to analytics if needed
      this.reportLoadMetrics({
        loadTime,
        domContentLoaded,
        firstByte,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        location: 'Norway' // Can be enhanced with IP geolocation
      });
    });
  }

  private monitorChatResponseTime() {
    // Monitor WebSocket message round-trip time
    window.addEventListener('chat-message-sent', (event: any) => {
      const startTime = performance.now();
      
      const responseHandler = (responseEvent: any) => {
        if (responseEvent.detail.messageId === event.detail.messageId) {
          const responseTime = performance.now() - startTime;
          this.metrics.chatResponseTime = responseTime;
          
          if (responseTime > 500) {
            console.warn(`🚨 Chat response time: ${Math.round(responseTime)}ms - May affect UX`);
          } else {
            console.log(`💬 Chat response: ${Math.round(responseTime)}ms - Good for community`);
          }
          
          window.removeEventListener('chat-message-received', responseHandler);
        }
      };
      
      window.addEventListener('chat-message-received', responseHandler);
    });
  }

  private monitorNavigationSpeed() {
    // Monitor SPA navigation performance
    let navigationStart = 0;
    
    window.addEventListener('navigation-start', () => {
      navigationStart = performance.now();
    });
    
    window.addEventListener('navigation-complete', () => {
      if (navigationStart > 0) {
        const navigationTime = performance.now() - navigationStart;
        this.metrics.navigationTime = navigationTime;
        
        if (navigationTime > 200) {
          console.warn(`🚨 Navigation time: ${Math.round(navigationTime)}ms - Consider optimization`);
        } else {
          console.log(`🧭 Navigation: ${Math.round(navigationTime)}ms - Smooth for users`);
        }
      }
    });
  }

  private reportSlowPerformance(metric: string, value: number) {
    // Could integrate with analytics service
    console.log(`📈 Performance Alert: ${metric} = ${Math.round(value)}ms`);
    
    // For Norwegian tech community, we want to be extra responsive
    if (typeof window !== 'undefined' && 'navigator' in window) {
      const connection = (navigator as any).connection;
      if (connection) {
        console.log(`📶 Connection: ${connection.effectiveType} (${connection.downlink}Mbps)`);
      }
    }
  }

  private reportLoadMetrics(metrics: any) {
    // Enhanced reporting for Norwegian market analysis
    console.log('📊 Detailed Performance Report for Norwegian Tech Community:');
    console.table(metrics);
    
    // Could send to analytics service here
    // analytics.track('page_performance', metrics);
  }

  public getMetrics() {
    return { ...this.metrics };
  }

  public getPerformanceGrade(): 'A' | 'B' | 'C' | 'D' | 'F' {
    const { lcp, fid, cls, loadTime } = this.metrics;
    
    // More realistic grading for Norwegian tech community
    // Give better scores for fast loading times
    let score = 0;
    let maxScore = 0;
    
    // LCP scoring (weight: 30%)
    if (lcp !== undefined) {
      maxScore += 30;
      if (lcp <= 1000) score += 30;
      else if (lcp <= 2500) score += 25;
      else if (lcp <= 4000) score += 15;
      else if (lcp <= 6000) score += 5;
    }
    
    // FID scoring (weight: 25%)
    if (fid !== undefined) {
      maxScore += 25;
      if (fid <= 50) score += 25;
      else if (fid <= 100) score += 20;
      else if (fid <= 200) score += 15;
      else if (fid <= 300) score += 10;
    }
    
    // CLS scoring (weight: 25%)
    if (cls !== undefined) {
      maxScore += 25;
      if (cls <= 0.05) score += 25;
      else if (cls <= 0.1) score += 20;
      else if (cls <= 0.15) score += 15;
      else if (cls <= 0.25) score += 10;
    }
    
    // Load Time scoring (weight: 20%)
    if (loadTime !== undefined) {
      maxScore += 20;
      if (loadTime <= 500) score += 20;
      else if (loadTime <= 1000) score += 18;
      else if (loadTime <= 2000) score += 15;
      else if (loadTime <= 3000) score += 10;
      else if (loadTime <= 5000) score += 5;
    }
    
    // Calculate percentage
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }

  public generateReport(): string {
    const grade = this.getPerformanceGrade();
    const metrics = this.getMetrics();
    
    return `
🇳🇴 SNAKKAZ PERFORMANCE RAPPORT
===============================
Grade: ${grade} ${grade === 'A' ? '🏆' : grade === 'B' ? '✅' : grade === 'C' ? '⚠️' : '🚨'}

Core Web Vitals:
- LCP: ${Math.round(metrics.lcp || 0)}ms ${(metrics.lcp || 0) <= 2500 ? '✅' : '🚨'}
- FID: ${Math.round(metrics.fid || 0)}ms ${(metrics.fid || 0) <= 100 ? '✅' : '🚨'}  
- CLS: ${(metrics.cls || 0).toFixed(3)} ${(metrics.cls || 0) <= 0.1 ? '✅' : '🚨'}

App Performance:
- Load Time: ${Math.round(metrics.loadTime || 0)}ms
- Chat Response: ${Math.round(metrics.chatResponseTime || 0)}ms
- Navigation: ${Math.round(metrics.navigationTime || 0)}ms

Status: ${grade === 'A' || grade === 'B' ? 'Ready for Norwegian tech community! 🚀' : 'Needs optimization for optimal UX 🔧'}
    `.trim();
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    console.log('🔌 Performance Monitor: Disconnected');
  }
}

// Auto-initialize for Norwegian tech community
if (typeof window !== 'undefined') {
  window.snakkazPerformance = new SnakkazPerformanceMonitor();
  
  // Show performance grade after 5 seconds
  setTimeout(() => {
    const report = window.snakkazPerformance.generateReport();
    console.log(report);
  }, 5000);
}
