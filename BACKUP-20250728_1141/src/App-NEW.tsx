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

// Error Boundary Component with Master Design
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
                <div className="glass-card" style={{
                    margin: '2rem',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <h2 style={{ color: 'var(--snakkaz-primary)', marginBottom: '1rem' }}>
                        Oops! Something went wrong
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Please refresh the page or contact support if the problem persists.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// Dynamic Authentication Component
const AuthenticatedApp: React.FC = () => {
    return (
        <MCPWebRTCProvider>
            <Routes>
                <Route path="/" element={<Navigate to="/beta" replace />} />
                <Route path="/beta" element={<SnakkaZChatBeta />} />
            </Routes>
        </MCPWebRTCProvider>
    );
};

// Main App Component
const App: React.FC = () => {
    console.log('🚀 App component rendering!');
    const { user, loading } = useAuth();

    console.log('🔍 App state:', { user: !!user, loading });

    // Show unified loading spinner while authentication is loading
    if (loading) {
        console.log('🔄 App: Showing loading screen for auth...');
        return <UnifiedLoadingScreen message="Sjekker autentisering..." />;
    }

    return (
        <ErrorBoundary>
            <Router>
                <div className="App">
                    <Suspense fallback={<UnifiedLoadingScreen />}>
                        {user ? (
                            <AuthenticatedApp />
                        ) : (
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="*" element={<Navigate to="/login" replace />} />
                            </Routes>
                        )}
                    </Suspense>
                </div>
            </Router>
        </ErrorBoundary>
    );
};

export default App;
