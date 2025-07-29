import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import SnakkaZChatBeta from './pages/SnakkaZChatBeta';
import AdminDashboard from './pages/AdminDashboard';

// Import MCP WebRTC Provider
import MCPWebRTCProvider from './providers/MCPWebRTCProvider';

// Import unified loading - COMMENTED OUT TO USE PERFECT LIQUID DREAM
// import './styles/MASTER-DESIGN-SYSTEM.css';

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
  // Clean Liquid Dream Loading Component
const AuroraLoader: React.FC = () => (
  }

// Clean Liquid Dream Loading Component
const AuroraLoader: React.FC = () => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, var(--snakkaz-dark) 0%, var(--snakkaz-surface) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-body)',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* Liquid Dream Background Effect */}
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `
        radial-gradient(circle at 20% 50%, rgba(100, 181, 246, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(77, 208, 225, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(129, 199, 132, 0.1) 0%, transparent 50%)
      `,
      animation: 'liquidDream 20s ease-in-out infinite',
      zIndex: -1
    }} />

    {/* Main Loading Container */}
    <div style={{
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--backdrop-blur)',
      WebkitBackdropFilter: 'var(--backdrop-blur)',
      borderRadius: '24px',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--glass-shadow)',
      padding: '3rem',
      textAlign: 'center',
      animation: 'fadeInUp 1s ease-out'
    }}>
      {/* Loading Spinner */}
      <div style={{
        width: '60px',
        height: '60px',
        border: '4px solid rgba(100, 181, 246, 0.2)',
        borderTop: '4px solid var(--snakkaz-primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 2rem'
      }} />

      {/* Brand Name */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '3rem',
        fontWeight: '900',
        background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '1rem'
      }}>
        SNAKKAZ
      </h1>

      {/* Loading Message */}
      <p style={{
        fontSize: '1.1rem',
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '300',
        marginBottom: '1.5rem'
      }}>
        Laster chat-systemet...
      </p>

      {/* Loading Dots */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem'
      }}>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--snakkaz-primary)',
              animation: `loadingDots 1.4s ease-in-out infinite ${i * 0.16}s`
            }}
          />
        ))}
      </div>
    </div>

    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes liquidDream {
        0%, 100% { transform: scale(1) rotate(0deg); }
        33% { transform: scale(1.1) rotate(1deg); }
        66% { transform: scale(0.9) rotate(-1deg); }
      }
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes loadingDots {
        0%, 80%, 100% { 
          transform: scale(0.8);
          opacity: 0.5;
        }
        40% { 
          transform: scale(1.2);
          opacity: 1;
        }
      }
    `}</style>
  </div>
);

// Main App Component
);
);

// Main App Component
const App: React.FC = () => {
  console.log('🌊 SnakkaZ Norwegian Aurora System - Starting...');

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
            🌊 Aurora System
          </div>

          <MCPWebRTCProvider>
            <Suspense fallback={<AuroraLoader />}>
              <Routes>
                {/* Main routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Chat routes */}
                <Route path="/beta" element={<SnakkaZChatBeta />} />
                <Route path="/chat" element={<SnakkaZChatBeta />} />

                {/* Admin routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/dashboard" element={<AdminDashboard />} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Suspense>
          </MCPWebRTCProvider>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;