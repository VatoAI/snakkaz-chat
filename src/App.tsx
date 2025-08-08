import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { StandardLoading } from './components/common/StandardLoading';
import './index.css';
import './styles/mobile.css'; // EMERGENCY MOBILE FIX
import './styles/cyberpunk-design-system.css'; // CYBERPUNK LIQUID GLASS SYSTEM

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

// Lazy load components
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const SimpleChatBeta = React.lazy(() => import('./pages/SimpleChatBeta'));
const LoadingTestPage = React.lazy(() => import('./pages/LoadingTestPage'));
const SuperpowerDesignPreview = React.lazy(() => import('./pages/SuperpowerDesignPreview'));
const LiquidChatPreview = React.lazy(() => import('./pages/LiquidChatPreview'));
const UnifiedDreamPreview = React.lazy(() => import('./pages/UnifiedDreamPreview'));
const LiquidDreamMain = React.lazy(() => import('./pages/LiquidDreamMain'));
const ChatPage = React.lazy(() => import('./pages/ChatPage'));

const App: React.FC = () => {
  const { isMobile } = useDeviceDetection();

  console.log('App rendered, device:', isMobile ? 'mobile' : 'desktop');

  return (
    <div className="liquid-dream-app">
      <Router>
        <AuthProvider>
          <Suspense fallback={<StandardLoading type="app" />}>
            <Routes>
              <Route path="/" element={<Navigate to="/main" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/main" element={
                <ProtectedRoute>
                  <LiquidDreamMain />
                </ProtectedRoute>
              } />
              <Route path="/loading-test" element={<LoadingTestPage />} />
              <Route path="/superpowers" element={<SuperpowerDesignPreview />} />
              <Route path="/liquid-chat" element={<LiquidChatPreview />} />
              <Route path="/unified-dream" element={<UnifiedDreamPreview />} />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } />
              <Route path="/telegram-chat" element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } />
              <Route path="/simple-chat-beta" element={
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
