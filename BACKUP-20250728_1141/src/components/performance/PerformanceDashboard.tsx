/**
 * FASE 3 Performance Enhancement: Comprehensive Performance Dashboard
 * 
 * Real-time performance monitoring and optimization dashboard for developers
 * and advanced users. Provides insights into bundle sizes, cache performance,
 * load times, and optimization recommendations.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { performanceMonitor } from '@/utils/performance/performance-monitor';
import { cacheManager, useAdvancedCache } from '@/utils/performance/advanced-cache';
import { bundleAnalyzer, useBundleAnalysis } from '@/utils/performance/bundle-analyzer';
import { smartLazyLoader, useSmartLazyStats } from '@/utils/performance/smart-lazy-loader';

interface PerformanceDashboardProps {
  onClose: () => void;
}

export default function PerformanceDashboard({ onClose }: PerformanceDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'cache' | 'bundle' | 'lazy' | 'recommendations'>('overview');
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Hook into performance systems
  const cacheStats = useAdvancedCache().stats;
  const bundleAnalysis = useBundleAnalysis();
  const lazyStats = useSmartLazyStats();

  // Update performance data
  const refreshData = useCallback(async () => {
    try {
      const webVitals = performanceMonitor.getWebVitals();
      const metrics = performanceMonitor.getAllMetrics();
      const errors = performanceMonitor.getErrors();
      
      setPerformanceData({
        webVitals,
        metrics,
        errors,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Failed to refresh performance data:', error);
    }
  }, []);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [refreshData]);

  if (isMinimized) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.9)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '8px',
          padding: '8px 12px',
          color: 'white',
          fontSize: '12px',
          cursor: 'pointer',
          zIndex: 1001,
          backdropFilter: 'blur(10px)'
        }}
        onClick={() => setIsMinimized(false)}
      >
        📊 Performance Monitor (klikk for å utvide)
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        width: '420px',
        maxHeight: '500px',
        background: 'rgba(0, 0, 0, 0.95)',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        borderRadius: '12px',
        color: 'white',
        fontSize: '12px',
        zIndex: 1001,
        backdropFilter: 'blur(20px)',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 215, 0, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>📊</span>
          <span style={{ fontWeight: 'bold', color: '#FFD700' }}>Performance Dashboard</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsMinimized(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFD700',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            title="Minimize"
          >
            ⏷
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFD700',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
          background: 'rgba(0, 0, 0, 0.3)'
        }}
      >
        {[
          { id: 'overview', label: 'Oversikt', icon: '📈' },
          { id: 'cache', label: 'Cache', icon: '💾' },
          { id: 'bundle', label: 'Bundle', icon: '📦' },
          { id: 'lazy', label: 'Lazy Load', icon: '⚡' },
          { id: 'recommendations', label: 'Anbefalinger', icon: '💡' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1,
              padding: '8px 4px',
              background: activeTab === tab.id ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
              border: 'none',
              color: activeTab === tab.id ? '#FFD700' : '#ccc',
              cursor: 'pointer',
              fontSize: '10px',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
          >
            <div>{tab.icon}</div>
            <div>{tab.label}</div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '16px', maxHeight: '350px', overflowY: 'auto' }}>
        {activeTab === 'overview' && (
          <OverviewTab performanceData={performanceData} onRefresh={refreshData} />
        )}
        {activeTab === 'cache' && (
          <CacheTab stats={cacheStats} />
        )}
        {activeTab === 'bundle' && (
          <BundleTab analysis={bundleAnalysis} />
        )}
        {activeTab === 'lazy' && (
          <LazyLoadTab stats={lazyStats} />
        )}
        {activeTab === 'recommendations' && (
          <RecommendationsTab bundleAnalysis={bundleAnalysis} cacheStats={cacheStats} />
        )}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ performanceData, onRefresh }: any) {
  const webVitals = performanceData?.webVitals || {};
  
  return (
    <div style={{ space: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, color: '#FFD700' }}>Web Vitals</h3>
        <button
          onClick={onRefresh}
          style={{
            background: 'rgba(255, 215, 0, 0.2)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '4px',
            color: '#FFD700',
            padding: '4px 8px',
            fontSize: '10px',
            cursor: 'pointer'
          }}
        >
          🔄 Oppdater
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        {[
          { label: 'FCP', value: webVitals.FCP, unit: 'ms', good: 1800 },
          { label: 'LCP', value: webVitals.LCP, unit: 'ms', good: 2500 },
          { label: 'FID', value: webVitals.FID, unit: 'ms', good: 100 },
          { label: 'CLS', value: webVitals.CLS, unit: '', good: 0.1 }
        ].map(metric => (
          <div
            key={metric.label}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '8px',
              borderRadius: '6px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '10px', opacity: 0.7 }}>{metric.label}</div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: 'bold',
              color: metric.value <= metric.good ? '#4ade80' : metric.value <= metric.good * 2 ? '#fbbf24' : '#f87171'
            }}>
              {metric.value ? `${Math.round(metric.value)}${metric.unit}` : 'N/A'}
            </div>
          </div>
        ))}
      </div>

      {/* System Info */}
      <div style={{ marginTop: '12px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#FFD700', fontSize: '11px' }}>System</h4>
        <div style={{ fontSize: '10px', lineHeight: '1.4', opacity: 0.8 }}>
          <div>Minne: {navigator.deviceMemory || 'Ukjent'}GB</div>
          <div>Tilkobling: {(navigator as any).connection?.effectiveType || 'Ukjent'}</div>
          <div>Sist oppdatert: {performanceData?.timestamp ? new Date(performanceData.timestamp).toLocaleTimeString() : 'Aldri'}</div>
        </div>
      </div>
    </div>
  );
}

// Cache Tab Component
function CacheTab({ stats }: any) {
  return (
    <div>
      <h3 style={{ margin: '0 0 12px 0', color: '#FFD700' }}>Cache Performance</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px', borderRadius: '6px' }}>
          <div style={{ fontSize: '10px', opacity: 0.7 }}>Hit Rate</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#4ade80' }}>
            {stats.hitRate.toFixed(1)}%
          </div>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px', borderRadius: '6px' }}>
          <div style={{ fontSize: '10px', opacity: 0.7 }}>Memory Usage</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#60a5fa' }}>
            {(stats.memoryUsage / 1024 / 1024).toFixed(1)}MB
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '4px' }}>Requests</div>
        <div style={{ fontSize: '11px' }}>
          <div>Total: {stats.totalRequests}</div>
          <div>Hits: {stats.totalHits}</div>
          <div>Misses: {stats.totalMisses}</div>
        </div>
      </div>

      {stats.largestEntries && stats.largestEntries.length > 0 && (
        <div>
          <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '4px' }}>Largest Entries</div>
          {stats.largestEntries.slice(0, 3).map((entry: any, index: number) => (
            <div key={index} style={{ fontSize: '10px', marginBottom: '2px' }}>
              <span style={{ opacity: 0.7 }}>{entry.key.slice(0, 20)}...</span>
              <span style={{ float: 'right', color: '#fbbf24' }}>
                {(entry.size / 1024).toFixed(1)}KB
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Bundle Tab Component
function BundleTab({ analysis }: any) {
  if (analysis.loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ color: '#FFD700' }}>Analyserer bundle...</div>
      </div>
    );
  }

  if (!analysis.analysis) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ opacity: 0.7 }}>Ingen bundle-data tilgjengelig</div>
      </div>
    );
  }

  const { metrics, score, violations } = analysis.analysis;

  return (
    <div>
      <h3 style={{ margin: '0 0 12px 0', color: '#FFD700' }}>Bundle Analysis</h3>
      
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: score >= 80 ? '#4ade80' : score >= 60 ? '#fbbf24' : '#f87171' }}>
          {score}/100
        </div>
        <div style={{ fontSize: '10px', opacity: 0.7 }}>Performance Score</div>
      </div>

      {metrics && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>Total Size</div>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
              {Math.round(metrics.totalSize / 1024)}KB
            </div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>Gzipped</div>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
              {Math.round(metrics.gzippedSize / 1024)}KB
            </div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>Chunks</div>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
              {metrics.chunkCount}
            </div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>Load Time</div>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
              {Math.round(metrics.loadTime)}ms
            </div>
          </div>
        </div>
      )}

      {violations && violations.length > 0 && (
        <div>
          <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '4px' }}>Budget Violations</div>
          {violations.slice(0, 3).map((violation: any, index: number) => (
            <div 
              key={index} 
              style={{ 
                fontSize: '10px', 
                marginBottom: '2px',
                color: violation.severity === 'error' ? '#f87171' : '#fbbf24'
              }}
            >
              {violation.metric}: {violation.current}/{violation.budget}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Lazy Load Tab Component
function LazyLoadTab({ stats }: any) {
  return (
    <div>
      <h3 style={{ margin: '0 0 12px 0', color: '#FFD700' }}>Lazy Loading</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px', borderRadius: '6px' }}>
          <div style={{ fontSize: '10px', opacity: 0.7 }}>Components</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
            {stats.loaded}/{stats.total}
          </div>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px', borderRadius: '6px' }}>
          <div style={{ fontSize: '10px', opacity: 0.7 }}>Success Rate</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#4ade80' }}>
            {stats.loadSuccess.toFixed(1)}%
          </div>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px', borderRadius: '6px' }}>
          <div style={{ fontSize: '10px', opacity: 0.7 }}>Errors</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: stats.errors > 0 ? '#f87171' : '#4ade80' }}>
            {stats.errors}
          </div>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px', borderRadius: '6px' }}>
          <div style={{ fontSize: '10px', opacity: 0.7 }}>Preloading</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#60a5fa' }}>
            {stats.preloading}
          </div>
        </div>
      </div>

      <div style={{ fontSize: '10px', opacity: 0.8 }}>
        <div>Total komponenter: {stats.total}</div>
        <div>Lastet: {stats.loaded}</div>
        <div>Forbelaster: {stats.preloading}</div>
        <div>Feil: {stats.errors}</div>
      </div>
    </div>
  );
}

// Recommendations Tab Component
function RecommendationsTab({ bundleAnalysis, cacheStats }: any) {
  const recommendations = bundleAnalysis?.recommendations || [];
  
  // Generate cache recommendations
  const cacheRecommendations = [];
  if (cacheStats.hitRate < 80) {
    cacheRecommendations.push({
      type: 'cache',
      priority: 'high',
      description: `Cache hit rate (${cacheStats.hitRate.toFixed(1)}%) er under optimal nivå`,
      implementation: 'Juster cache-strategier og TTL-verdier'
    });
  }

  const allRecommendations = [...recommendations, ...cacheRecommendations];

  return (
    <div>
      <h3 style={{ margin: '0 0 12px 0', color: '#FFD700' }}>Anbefalinger</h3>
      
      {allRecommendations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', opacity: 0.7 }}>
          <div>🎉 Ingen anbefalinger</div>
          <div style={{ fontSize: '10px', marginTop: '4px' }}>
            Ytelsen er optimal!
          </div>
        </div>
      ) : (
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {allRecommendations.slice(0, 5).map((rec: any, index: number) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '8px',
                borderRadius: '6px',
                marginBottom: '8px',
                borderLeft: `3px solid ${
                  rec.priority === 'high' ? '#f87171' :
                  rec.priority === 'medium' ? '#fbbf24' : '#4ade80'
                }`
              }}
            >
              <div style={{ 
                fontSize: '10px', 
                fontWeight: 'bold',
                color: rec.priority === 'high' ? '#f87171' : rec.priority === 'medium' ? '#fbbf24' : '#4ade80',
                marginBottom: '2px'
              }}>
                {rec.priority.toUpperCase()} - {rec.type}
              </div>
              <div style={{ fontSize: '10px', marginBottom: '4px' }}>
                {rec.description}
              </div>
              <div style={{ fontSize: '9px', opacity: 0.7 }}>
                {rec.implementation}
              </div>
              {rec.estimatedSavings && (
                <div style={{ fontSize: '9px', color: '#4ade80', marginTop: '2px' }}>
                  💾 {rec.estimatedSavings.size ? `${Math.round(rec.estimatedSavings.size / 1024)}KB` : ''}
                  {rec.estimatedSavings.loadTime ? ` ⚡ ${rec.estimatedSavings.loadTime}ms` : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
