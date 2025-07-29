import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import './index.css';

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

// Perfect Liquid Dream Loading Component - Clean Matrix Style
const AuroraLoader: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
    <div className="text-center">
      {/* Clean Matrix Animation - No ugly squares */}
      <div className="mb-8 relative">
        <div className="text-green-400 font-mono text-sm mb-4 space-y-1">
          <div className="animate-pulse opacity-80">
            {'> Initializing quantum encryption...'}
          </div>
          <div className="animate-pulse delay-300 opacity-70">
            {'> Loading neural networks...'}
          </div>
          <div className="animate-pulse delay-500 opacity-60">
            {'> Establishing secure connection...'}
          </div>
        </div>

        {/* Elegant progress bar instead of ugly squares */}
        <div className="w-64 mx-auto bg-slate-800 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-white mb-3 font-display">SnakkaZ</h1>
      <p className="text-purple-300 text-sm animate-pulse">Krypterer forbindelse...</p>
    </div>
  </div>
);

// Lazy load components
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const SimpleChatBeta = React.lazy(() => import('./pages/SimpleChatBeta'));

const App: React.FC = () => {
  const { isMobile } = useDeviceDetection();

  console.log('App rendered, device:', isMobile ? 'mobile' : 'desktop');

  return (
    <div className="liquid-dream-app">
      <Router>
        <AuthProvider>
          <Suspense fallback={<AuroraLoader />}>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <SimpleChatBeta />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </div>
  );
};

export default App;
