/**
 * React Hook for Performance Monitoring
 * Integrates PerformanceMonitor with React lifecycle
 */

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { type PerformanceMetric, type ChatMetrics, getPerformanceMonitor } from '../utils/performanceMonitor';

interface PerformanceContextType {
    metrics: ChatMetrics & { vitals: PerformanceMetric[] };
    trackCustomEvent: (name: string, value: number) => void;
    trackError: (error: Error, context: string) => void;
    trackTypingDelay: () => () => void;
    validateBudgets: () => void;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

// React hook for performance monitoring
export const usePerformanceMonitor = (analyticsEndpoint?: string) => {
    const [monitor] = useState(() => getPerformanceMonitor(analyticsEndpoint));
    const [metrics, setMetrics] = useState<ChatMetrics & { vitals: PerformanceMetric[] }>({
        messageRenderTime: 0,
        webSocketLatency: 0,
        typingIndicatorDelay: 0,
        glassmorphismFPS: 0,
        memoryUsage: 0,
        vitals: [],
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(monitor.getRealtimeMetrics());
        }, 5000); // Update every 5 seconds

        return () => {
            clearInterval(interval);
            monitor.destroy();
        };
    }, [monitor]);

    const trackCustomEvent = useCallback((name: string, value: number) => {
        monitor.sendCustomMetric(name, value);
    }, [monitor]);

    const trackError = useCallback((error: Error, context: string) => {
        monitor.trackError(error, context);
    }, [monitor]);

    const trackTypingDelay = useCallback(() => {
        return monitor.trackTypingIndicatorDelay();
    }, [monitor]);

    return {
        metrics,
        trackCustomEvent,
        trackError,
        trackTypingDelay,
        validateBudgets: () => monitor.validatePerformanceBudgets(),
    };
};

// Performance monitoring provider component
interface PerformanceMonitorProviderProps {
    children: React.ReactNode;
    analyticsEndpoint?: string;
    showDebugPanel?: boolean;
}

export const PerformanceMonitorProvider: React.FC<PerformanceMonitorProviderProps> = ({
    children,
    analyticsEndpoint,
    showDebugPanel = false
}) => {
    const performanceData = usePerformanceMonitor(analyticsEndpoint);

    useEffect(() => {
        // Validate budgets periodically
        const interval = setInterval(performanceData.validateBudgets, 30000);
        return () => clearInterval(interval);
    }, [performanceData.validateBudgets]);

    return (
        <PerformanceContext.Provider value={performanceData}>
            {children}
            {showDebugPanel && process.env.NODE_ENV === 'development' && (
                <PerformanceDebugPanel metrics={performanceData.metrics} />
            )}
        </PerformanceContext.Provider>
    );
};

// Hook to use performance context
export const usePerformanceContext = (): PerformanceContextType => {
    const context = useContext(PerformanceContext);
    if (!context) {
        throw new Error('usePerformanceContext must be used within PerformanceMonitorProvider');
    }
    return context;
};

// Debug panel for development
interface PerformanceDebugPanelProps {
    metrics: ChatMetrics & { vitals: PerformanceMetric[] };
}

const PerformanceDebugPanel: React.FC<PerformanceDebugPanelProps> = ({ metrics }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    background: 'rgba(10, 189, 198, 0.8)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    color: 'white',
                    fontSize: '24px',
                    cursor: 'pointer',
                    zIndex: 10000,
                    boxShadow: '0 4px 20px rgba(10, 189, 198, 0.4)',
                }}
                aria-label="Open Performance Debug Panel"
            >
                📊
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '320px',
            height: '420px',
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(10px)',
            color: '#0abdc6',
            padding: '20px',
            borderRadius: '12px',
            fontSize: '12px',
            overflow: 'auto',
            zIndex: 10000,
            border: '1px solid rgba(10, 189, 198, 0.5)',
            boxShadow: '0 8px 32px rgba(10, 189, 198, 0.2)',
            fontFamily: 'monospace',
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                borderBottom: '1px solid rgba(10, 189, 198, 0.3)',
                paddingBottom: '10px'
            }}>
                <h3 style={{ margin: 0, color: '#0abdc6', fontSize: '14px' }}>Performance Metrics</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff6b6b',
                        fontSize: '16px',
                        cursor: 'pointer',
                        padding: '2px'
                    }}
                    aria-label="Close Performance Debug Panel"
                >
                    ✕
                </button>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <h4 style={{ color: '#4ecdc4', margin: '0 0 8px 0', fontSize: '12px' }}>Core Web Vitals:</h4>
                {metrics.vitals.length > 0 ? (
                    metrics.vitals.slice(-5).map((metric, i) => (
                        <div key={i} style={{
                            marginBottom: '5px',
                            padding: '4px 8px',
                            background: 'rgba(10, 189, 198, 0.1)',
                            borderRadius: '4px',
                            fontSize: '11px'
                        }}>
                            <span style={{ color: '#45b7d1' }}>{metric.name}:</span>{' '}
                            <span style={{ color: '#96ceb4' }}>{Math.round(metric.value)}ms</span>
                            <span style={{ color: '#666', marginLeft: '8px' }}>
                                ({metric.device})
                            </span>
                        </div>
                    ))
                ) : (
                    <div style={{ color: '#666', fontStyle: 'italic' }}>No vitals data yet...</div>
                )}
            </div>

            <div>
                <h4 style={{ color: '#4ecdc4', margin: '0 0 8px 0', fontSize: '12px' }}>Chat Metrics:</h4>
                {Object.entries(metrics)
                    .filter(([key]) => key !== 'vitals')
                    .map(([key, value]) => (
                        <div key={key} style={{
                            marginBottom: '5px',
                            padding: '4px 8px',
                            background: 'rgba(10, 189, 198, 0.1)',
                            borderRadius: '4px',
                            fontSize: '11px'
                        }}>
                            <span style={{ color: '#45b7d1' }}>
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                            </span>{' '}
                            <span style={{ color: '#96ceb4' }}>
                                {typeof value === 'number' ?
                                    (value > 0 ? Math.round(value) : 'N/A') :
                                    String(value)
                                }
                                {typeof value === 'number' && value > 0 &&
                                    (key.includes('Time') || key.includes('Latency') || key.includes('Delay')) ? 'ms' :
                                    key.includes('FPS') ? 'fps' :
                                        key.includes('memory') || key.includes('Memory') ? 'MB' : ''
                                }
                            </span>
                        </div>
                    ))
                }
            </div>

            <div style={{
                marginTop: '15px',
                paddingTop: '10px',
                borderTop: '1px solid rgba(10, 189, 198, 0.3)',
                fontSize: '10px',
                color: '#666'
            }}>
                <div>Device: {typeof window !== 'undefined' ? (window.innerWidth <= 768 ? 'Mobile' : 'Desktop') : 'Unknown'}</div>
                <div>Updated: {new Date().toLocaleTimeString()}</div>
            </div>
        </div>
    );
};

export default usePerformanceMonitor;
