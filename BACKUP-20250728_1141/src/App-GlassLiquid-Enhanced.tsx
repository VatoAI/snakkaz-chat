// SnakkaZ Chat - Enhanced Performance Glass Liquid Design App
// FASE 3 Performance Integration
import React, { Suspense, useEffect, useState } from 'react';
import { PerformanceWrapper } from './components/performance/PerformanceWrapper';
import { useNavigationTracking } from './hooks/useNavigationTracking';
import { performanceMonitor } from './utils/performance/performance-monitor';
import { cacheManager } from './utils/performance/advanced-cache';
import { smartLazyLoader } from './utils/performance/smart-lazy-loader';
import { bundleAnalyzer } from './utils/performance/bundle-analyzer';

// Enhanced lazy loading with intelligent preloading
const SnakkazGlassLiquidChat = smartLazyLoader.createLazyComponent(
  () => import('./components/SnakkazGlassLiquidChat-Interactive'),
  {
    chunkName: 'main-chat',
    priority: 'high',
    preloadDelay: 0,
    networkThreshold: 'medium'
  }
);

// Performance dashboard (lazy loaded)
const PerformanceDashboard = smartLazyLoader.createLazyComponent(
  () => import('./components/performance/PerformanceDashboard'),
  {
    chunkName: 'performance-dashboard',
    priority: 'low',
    preloadDelay: 5000, // Preload after 5 seconds
    networkThreshold: 'fast'
  }
);

// Enhanced loading component with performance indicators
const EnhancedLoader = () => {
  const [loadingState, setLoadingState] = useState('Initialiserer...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stages = [
      { text: 'Laster kjernekomponenter...', duration: 800 },
      { text: 'Optimaliserer ytelse...', duration: 600 },
      { text: 'Forbereder chat-grensesnitt...', duration: 400 },
      { text: 'Ferdig!', duration: 200 }
    ];

    let currentStage = 0;
    let currentProgress = 0;

    const updateProgress = () => {
      if (currentStage < stages.length) {
        setLoadingState(stages[currentStage].text);
        
        const interval = setInterval(() => {
          currentProgress += 25;
          setProgress(currentProgress);
          
          if (currentProgress >= (currentStage + 1) * 25) {
            clearInterval(interval);
            currentStage++;
            if (currentStage < stages.length) {
              setTimeout(updateProgress, 100);
            }
          }
        }, stages[currentStage].duration / 4);
      }
    };

    updateProgress();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-cyberdark-950">
      <div className="text-center space-y-6 p-8">
        {/* Cyber-themed loading animation */}
        <div className="relative">
          <div className="w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-cybergold-500/20 rounded-full"></div>
            <div 
              className="absolute inset-0 border-4 border-transparent border-t-cybergold-500 rounded-full animate-spin"
              style={{ 
                animationDuration: '1s',
                transform: `rotate(${progress * 3.6}deg)`
              }}
            ></div>
          </div>
          
          {/* Progress percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-cybergold-500 font-mono text-sm font-bold">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Loading state text */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">SnakkaZ Chat</h2>
          <p className="text-cybergold-400 font-mono text-sm">
            {loadingState}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-cyberdark-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cybergold-500 to-cyberblue-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Performance hints */}
        <div className="text-xs text-cyberdark-400 max-w-xs">
          <p>🚀 Optimalisert med intelligent lazy loading</p>
          <p>⚡ Avansert caching aktivert</p>
          <p>📊 Ytelsesovervåking kjører</p>
        </div>
      </div>
    </div>
  );
};

// Error boundary with enhanced error reporting
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(new Error(event.message));
      
      // Report error to performance monitor
      performanceMonitor.recordError(event.error || new Error(event.message), {
        context: 'App-GlassLiquid',
        timestamp: Date.now()
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cyberdark-950">
        <div className="text-center space-y-4 p-8 max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white">Noe gikk galt</h1>
          <p className="text-cyberdark-300">
            En uventet feil oppstod. Applikasjonen vil prøve å gjenopprette seg automatisk.
          </p>
          <div className="text-xs text-cyberdark-500 font-mono bg-cyberdark-900 p-3 rounded">
            {error?.message || 'Ukjent feil'}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-cybergold-600 hover:bg-cybergold-500 text-cyberdark-950 rounded-md font-medium transition-colors"
          >
            Last siden på nytt
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default function App() {
  const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false);
  const [appReady, setAppReady] = useState(false);

  // Initialize performance monitoring
  useEffect(() => {
    const initializePerformance = async () => {
      try {
        console.log('🚀 SnakkaZ Glass Liquid App with Enhanced Performance loading...');
        
        // Initialize performance monitor
        performanceMonitor.startMonitoring();
        
        // Initialize cache manager with app-specific config
        await cacheManager.set('app-version', '3.0.0-beta', { 
          ttl: 1440, // 24 hours
          tags: ['app-meta'] 
        });
        
        // Run bundle analysis in background
        setTimeout(() => {
          bundleAnalyzer.analyzeBundlePerformance()
            .then(() => {
              console.log('📊 Bundle analysis completed');
              console.table(bundleAnalyzer.generateReport());
            })
            .catch(err => console.warn('Bundle analysis failed:', err));
        }, 2000);
        
        // Mark app as ready
        setTimeout(() => setAppReady(true), 1000);
        
      } catch (error) {
        console.error('Performance initialization failed:', error);
        setAppReady(true); // Continue loading even if performance features fail
      }
    };

    initializePerformance();

    // Cleanup on unmount
    return () => {
      performanceMonitor.stopMonitoring();
      smartLazyLoader.clearCache();
      cacheManager.destroy();
    };
  }, []);

  // Navigation tracking for intelligent preloading
  useNavigationTracking({
    preloadThreshold: 0.7, // Preload when 70% likely to navigate
    enableIntelligentPreloading: true
  });

  // Performance dashboard toggle (development/debug mode)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        setShowPerformanceDashboard(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!appReady) {
    return <EnhancedLoader />;
  }

  return (
    <ErrorBoundary>
      <PerformanceWrapper>
        <div className="app-background" style={{ minHeight: '100vh', background: '#0a0a0a' }}>
          {/* Animated Background Effects */}
          <div className="liquid-blob liquid-blob-1"></div>
          <div className="liquid-blob liquid-blob-2"></div>
          <div className="liquid-blob liquid-blob-3"></div>
          <div className="neural-network"></div>
          <div className="noise-overlay"></div>
          
          {/* Enhanced Glass Liquid Chat Interface with Performance Wrapper */}
          <Suspense fallback={<EnhancedLoader />}>
            <SnakkazGlassLiquidChat />
          </Suspense>
          
          {/* Enhanced Status Banner with Performance Info */}
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'rgba(102, 126, 234, 0.1)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '12px',
            padding: '12px 20px',
            color: 'white',
            backdropFilter: 'blur(20px)',
            fontSize: '14px',
            zIndex: 1000
          }}>
            <div>🎨 Glass Liquid Design Active</div>
            <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
              ⚡ Performance Enhanced
            </div>
          </div>

          {/* Performance Dashboard Toggle */}
          <button
            onClick={() => setShowPerformanceDashboard(prev => !prev)}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              background: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              color: '#FFD700',
              backdropFilter: 'blur(20px)',
              fontSize: '20px',
              cursor: 'pointer',
              zIndex: 1000,
              transition: 'all 0.3s ease'
            }}
            title="Toggle Performance Dashboard (Ctrl+Shift+P)"
          >
            📊
          </button>

          {/* Performance Dashboard */}
          {showPerformanceDashboard && (
            <Suspense fallback={
              <div style={{
                position: 'fixed',
                bottom: '80px',
                right: '20px',
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '12px'
              }}>
                Laster ytelsesdashboard...
              </div>
            }>
              <PerformanceDashboard onClose={() => setShowPerformanceDashboard(false)} />
            </Suspense>
          )}
        </div>
      </PerformanceWrapper>
    </ErrorBoundary>
  );
}
