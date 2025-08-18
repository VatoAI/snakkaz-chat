import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/authentication';
import { LoadingProvider, Loading } from './core/ui/loading';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeProvider';
import { PerformanceMonitorProvider } from './core/hooks/usePerformanceMonitor';

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
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Notifications = React.lazy(() => import('./pages/Notifications'));
const MainApp = React.lazy(() => import('./components/layout/MainApp'));
const FreshChat = React.lazy(() => import('./features/chat/components/FreshChat'));

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
                    <Route path="/" element={<Navigate to="/app" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Main App with nested routes */}
                    <Route path="/app/*" element={
                      <ProtectedRoute>
                        <MainApp />
                      </ProtectedRoute>
                    }>
                      <Route index element={<Dashboard />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="chat" element={<FreshChat />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="notifications" element={<Notifications />} />
                    </Route>

                    {/* Demo/Public Chat */}
                    <Route path="/demo" element={<FreshChat />} />

                    <Route path="*" element={<Navigate to="/app" replace />} />
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
