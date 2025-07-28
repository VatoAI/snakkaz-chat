// filepath: /workspaces/snakkaz-chat/src/App.tsx
import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Import REVOLUTIONARY design system
import './styles/snakkaz-premium-2025.css';
import './index.css';

// PWA and Mobile Components
import PWAHead from './components/mobile/PWAHead';
import MobileOptimization from './components/mobile/MobileOptimization';
import MobileLaunchBanner from './components/mobile/MobileLaunchBanner';

// FASE 6 PWA Excellence - PWA Manager Integration
import PWAComponent from './components/PWAComponent';
import DigitalVokter from './components/DigitalVokter';

// Import MCP WebRTC Provider
import MCPWebRTCProvider from './providers/MCPWebRTCProvider';

// 🚀 REVOLUTIONARY SNAKKAZ LOADING ANIMATION
const LoadingSpinner = () => {
    // Inject premium CSS animations only once
    React.useEffect(() => {
        const styleId = 'snakkaz-premium-loading';
        if (document.getElementById(styleId)) return;

        const styleSheet = document.createElement("style");
        styleSheet.id = styleId;
        styleSheet.type = "text/css";
        styleSheet.innerText = `
      .snakkaz-loading-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--cyber-void);
        overflow: hidden;
      }
      
      .snakkaz-loading-backdrop {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: radial-gradient(circle at center, 
          rgba(255, 204, 0, 0.1) 0%, 
          transparent 70%);
        animation: snakkaz-backdrop-pulse 4s ease-in-out infinite;
      }
      
      .snakkaz-spinner-wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
      }
      
      .snakkaz-spinner-main {
        position: relative;
        width: 120px;
        height: 120px;
      }
      
      .snakkaz-spinner-ring {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 3px solid transparent;
        border-radius: 50%;
      }
      
      .snakkaz-spinner-ring:nth-child(1) {
        border-top-color: #FFCC00;
        animation: snakkaz-spin 2s linear infinite;
        box-shadow: 0 0 20px rgba(255, 204, 0, 0.4);
      }
      
      .snakkaz-spinner-ring:nth-child(2) {
        border-right-color: #00D4FF;
        animation: snakkaz-spin 3s linear infinite reverse;
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
      }
      
      .snakkaz-spinner-ring:nth-child(3) {
        border-bottom-color: #C77DFF;
        animation: snakkaz-spin 4s linear infinite;
        box-shadow: 0 0 20px rgba(199, 125, 255, 0.4);
      }
      
      .snakkaz-loading-text {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }
      
      .snakkaz-title {
        font-family: 'Inter', sans-serif;
        font-weight: 800;
        font-size: 2.5rem;
        background: linear-gradient(135deg, #FFCC00, #00D4FF, #C77DFF);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 30px rgba(255, 204, 0, 0.3);
        animation: snakkaz-glow 2s ease-in-out infinite;
      }
      
      .snakkaz-loading-dots {
        display: flex;
        gap: 0.5rem;
      }
      
      .snakkaz-loading-dots span {
        width: 8px;
        height: 8px;
        background: #FFCC00;
        border-radius: 50%;
        animation: snakkaz-dot-bounce 1.4s ease-in-out infinite;
        box-shadow: 0 0 15px rgba(255, 204, 0, 0.5);
      }
      
      .snakkaz-loading-dots span:nth-child(1) { animation-delay: 0s; }
      .snakkaz-loading-dots span:nth-child(2) { animation-delay: 0.2s; }
      .snakkaz-loading-dots span:nth-child(3) { animation-delay: 0.4s; }
      
      @keyframes snakkaz-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes snakkaz-backdrop-pulse {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
      }
      
      @keyframes snakkaz-glow {
        0%, 100% { 
          text-shadow: 0 0 30px rgba(255, 204, 0, 0.3);
        }
        50% { 
          text-shadow: 0 0 50px rgba(255, 204, 0, 0.6);
        }
      }
      
      @keyframes snakkaz-dot-bounce {
        0%, 80%, 100% { 
          transform: scale(0.8); 
          opacity: 0.5; 
        }
        40% { 
          transform: scale(1.2); 
          opacity: 1; 
        }
      }
      
      @media (max-width: 768px) {
        .snakkaz-spinner-main {
          width: 80px;
          height: 80px;
        }
        .snakkaz-title {
          font-size: 1.8rem;
        }
      }
    `;
        document.head.appendChild(styleSheet);
    }, []);

    return (
        <div className="snakkaz-loading-container">
            <div className="snakkaz-loading-backdrop">
                <div className="snakkaz-spinner-wrapper">
                    <div className="snakkaz-spinner-main">
                        <div className="snakkaz-spinner-ring"></div>
                        <div className="snakkaz-spinner-ring"></div>
                        <div className="snakkaz-spinner-ring"></div>
                    </div>
                    <div className="snakkaz-loading-text">
                        <div className="snakkaz-title">SnakkaZ</div>
                        <div className="snakkaz-loading-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

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

// Lazy load components with route-based chunking for optimal performance
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const SnakkaZChatBeta = lazy(() => import("@/pages/SnakkaZChatBeta"));
const Profile = lazy(() => import("@/pages/Profile"));
const Groups = lazy(() => import("@/pages/Groups"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Dynamic Authentication Component
const AuthenticatedApp: React.FC = () => {
    return (
        <MCPWebRTCProvider>
            <PWAComponent />
            <DigitalVokter />
            <MobileLaunchBanner />
            <MobileOptimization />

            <Routes>
                <Route path="/" element={<Navigate to="/beta" replace />} />
                <Route path="/beta" element={<SnakkaZChatBeta />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </MCPWebRTCProvider>
    );
};

// Main App Component
const App: React.FC = () => {
    const { user, loading } = useAuth();

    // Show premium loading spinner while authentication is loading
    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <ErrorBoundary>
            <PWAHead />
            <Router>
                <div className="App">
                    <Suspense fallback={<LoadingSpinner />}>
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
