import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/authentication';
import { LoadingProvider, Loading } from './core/ui/loading';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeProvider';
import { PerformanceMonitorProvider } from './core/hooks/usePerformanceMonitor';
// CRITICAL: Import order matters! Design system first!
import './styles/design-system.css';
import './index.css';
import './styles/mobile.css';

// Device detection utility
const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent;
      const mobile = width < 768 || /Mobi|Android/i.test(userAgent);
      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile };
};

// Lazy load components - PRODUCTION VERSION
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const LiquidDreamMain = React.lazy(() => import('./pages/LiquidDreamMain'));
const ChatPage = React.lazy(() => import('./pages/ChatPage'));
const DesignProtectionTest = React.lazy(() => import('./components/test/DesignProtectionTest'));

const App: React.FC = () => {
  const { isMobile } = useDeviceDetection();

  console.log('App rendered, device:', isMobile ? 'mobile' : 'desktop');

  return (
    <ThemeProvider>
      <LoadingProvider>
        <PerformanceMonitorProvider
          showDebugPanel={process.env.NODE_ENV === 'development'}
          analyticsEndpoint="/api/analytics"
        >
          <div className="liquid-dream-app">
            <Router>
              <AuthProvider>
                <Suspense fallback={<Loading type="app-startup" />}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/main" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/test" element={<DesignProtectionTest />} />
                    <Route path="/main" element={
                      <ProtectedRoute>
                        <LiquidDreamMain />
                      </ProtectedRoute>
                    } />
                    <Route path="/chat" element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                  </Routes>
                </Suspense>
              </AuthProvider>
            </Router>
          </div>
        </PerformanceMonitorProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
};

export default App;
