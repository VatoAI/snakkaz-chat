// filepath: /workspaces/snakkaz-chat/src/App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Import MASTER design system - KUN EN!
import './styles/MASTER-DESIGN-SYSTEM.css';

// Import unified loading
import { UnifiedLoadingScreen } from '@/components/ui/UnifiedLoadingScreen';

// Import MCP WebRTC Provider
import MCPWebRTCProvider from './providers/MCPWebRTCProvider';

// Direct imports - no lazy loading for now
import Login from './pages/Login';
import Register from './pages/Register';
import SnakkaZChatBeta from './pages/SnakkaZChatBeta';

// Error Boundary Component with Premium Design
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
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card-cyber" style={{
          margin: '2rem',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h2 className="text-cyber-heading">Oops! Something went wrong</h2>
          <p className="text-cyber-body">
            Please refresh the page or contact support if the problem persists.
          </p>
          <button
            className="btn-cyber-primary"
            onClick={() => window.location.reload()}
            style={{ marginTop: '1rem' }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Direct import for debugging - will fix lazy loading later
import SnakkaZChatBeta from "@/pages/SnakkaZChatBeta";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

// Dynamic Authentication Component
const AuthenticatedApp: React.FC = () => {
  console.log('🔐 AuthenticatedApp: Rendering authenticated routes');

  return (
    <MCPWebRTCProvider>
      <PWAComponent />
      <DigitalVokter />
      <MobileLaunchBanner />
      <MobileOptimization>
        <div></div>
      </MobileOptimization>

      <Routes>
        <Route path="/" element={<Navigate to="/beta" replace />} />
        <Route path="/beta" element={<SnakkaZChatBeta />} />
        {/* <Route path="/profile" element={<Profile />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </MCPWebRTCProvider>
  );
};

// Main App Component
const App: React.FC = () => {
  const { user, loading } = useAuth();

  console.log('🔍 App Debug: user =', user?.email, 'loading =', loading);

  // Show premium loading spinner while authentication is loading
  if (loading) {
    console.log('🔄 App: Showing loading spinner because loading =', loading);
    return <LoadingSpinner />;
  }

  console.log('🎯 App: Rendering main app structure - user is:', user ? 'authenticated' : 'not authenticated');

  return (
    <ErrorBoundary>
      <PWAHead />
      {/* Emergency Debug Panel - Remove after fixing */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        background: 'rgba(255, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 9999,
        fontSize: '12px'
      }}>
        DEBUG: App Rendering | User: {user ? 'Logged In' : 'Not Logged In'} | Loading: {loading ? 'Yes' : 'No'}
      </div>
      <Router>
        <div className="App" style={{
          minHeight: '100vh',
          background: '#080811',
          color: 'rgba(255, 255, 255, 0.9)'
        }}>
          <Suspense fallback={<LoadingSpinner />}>
            {user ? (
              <>
                <div>🎯 User authenticated: {user.email}</div>
                <AuthenticatedApp />
              </>
            ) : (
              <>
                <div>🚪 User not authenticated, showing auth routes</div>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </>
            )}
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
