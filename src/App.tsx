import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDeviceDetection } from './hooks/useDeviceDetection';

// Import desktop pages
import Login from './pages/Login';
import Register from './pages/Register';
import SnakkaZChatBeta from './pages/SnakkaZChatBeta';
import SimpleChatBeta from './pages/SimpleChatBeta';
import AdminDashboard from './pages/AdminDashboard';

// Lazy load mobile components for better performance
const MobileLogin = lazy(() => import('./components/mobile/MobileLogin'));
const MobileRegister = lazy(() => import('./components/mobile/MobileRegister'));
const MobileChat = lazy(() => import('./components/mobile/MobileChat'));

// Import MCP WebRTC Provider
import MCPWebRTCProvider from './providers/MCPWebRTCProvider';

// Import unified loading
import './styles/MASTER-DESIGN-SYSTEM.css';

// Error Boundary Component with Norwegian Aurora Design
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean; error: Error } {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('SnakkaZ Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
          color: 'white',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxWidth: '500px'
          }}>
            <h2 style={{
              fontSize: '2rem',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🌊 System Error
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '1.5rem',
              fontSize: '1.1rem'
            }}>
              SnakkaZ encountered an unexpected error
            </p>
            <button
              style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: '#0a0a0f',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              onClick={() => window.location.reload()}
            >
              🚀 Restart SnakkaZ
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component with Norwegian Aurora theme
const AuroraLoader: React.FC = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* Aurora background effect */}
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(45deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 50%, rgba(120, 119, 198, 0.1) 100%)',
      backgroundSize: '400% 400%',
      animation: 'aurora-wave 8s ease-in-out infinite'
    }} />

    <div style={{
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '2rem',
      textAlign: 'center',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid transparent',
        borderTop: '3px solid #4facfe',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem'
      }} />
      <h2 style={{
        fontSize: '1.5rem',
        marginBottom: '0.5rem',
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: 'Orbitron, monospace'
      }}>
        SNAKKAZ
      </h2>
      <p style={{
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '0.9rem',
        fontFamily: 'Space Grotesk, sans-serif'
      }}>
        Loading Norwegian Aurora System...
      </p>
    </div>

    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes aurora-wave {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
    `}</style>
  </div>
);

// Main App Component
const App: React.FC = () => {
  const { isMobile } = useDeviceDetection();

  console.log('🌊 SnakkaZ Norwegian Aurora System - Starting...');
  console.log('📱 Device Detection:', { isMobile });

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          {/* Norwegian Aurora System Indicator */}
          <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '8px',
            zIndex: 99999,
            fontSize: '11px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            🌊 Aurora System {isMobile ? '📱' : '🖥️'}
          </div>

          <MCPWebRTCProvider>
            <Suspense fallback={<AuroraLoader />}>
              <Routes>
                {/* Main routes - use mobile or desktop based on device */}
                <Route 
                  path="/" 
                  element={isMobile ? <MobileChat /> : <SimpleChatBeta />} 
                />
                <Route
                  path="/login"
                  element={isMobile ? <MobileLogin /> : <Login />}
                />
                <Route
                  path="/register"
                  element={isMobile ? <MobileRegister /> : <Register />}
                />

                {/* Chat routes - stable versions */}
                <Route
                  path="/beta"
                  element={isMobile ? <MobileChat /> : <SimpleChatBeta />}
                />
                <Route
                  path="/chat"
                  element={isMobile ? <MobileChat /> : <SimpleChatBeta />}
                />
                <Route
                  path="/advanced"
                  element={isMobile ? <MobileChat /> : <SnakkaZChatBeta />}
                />

                {/* Admin routes - desktop only for now */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/dashboard" element={<AdminDashboard />} />

                {/* Catch all - redirect to main chat */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </MCPWebRTCProvider>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;