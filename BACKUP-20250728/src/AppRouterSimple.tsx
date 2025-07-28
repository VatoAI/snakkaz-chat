/**
 * Complete SnakkaZ Application with Authentication
 * Norwegian Enterprise Chat Platform
 */

import React, { Suspense, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './providers/AuthProvider';

// Import auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// Glass Liquid Chat Component
import SnakkazGlassLiquidChat from './components/SnakkazGlassLiquidChat';

// Loading fallback with glass liquid styling
const LoadingFallback = () => (
  <div className="app-background" style={{ minHeight: '100vh', background: '#0a0a0a' }}>
    <div className="liquid-blob liquid-blob-1"></div>
    <div className="liquid-blob liquid-blob-2"></div>
    <div className="liquid-blob liquid-blob-3"></div>
    <div className="neural-network"></div>
    <div className="noise-overlay"></div>
    
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-white text-lg">Laster SnakkaZ...</p>
      </div>
    </div>
  </div>
);

// Auth Guard Component
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const authContext = useContext(AuthContext);
  const location = useLocation();

  if (!authContext) {
    return <Navigate to="/login" replace />;
  }

  const { user, loading } = authContext;

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Main Chat App Component - Now with proper header and logout
const ChatApp = () => {
  const authContext = useContext(AuthContext);
  
  useEffect(() => {
    console.log('🚀 SnakkaZ Glass Liquid Chat App loaded');
  }, []);

  const handleLogout = async () => {
    if (authContext?.signOut) {
      await authContext.signOut();
    }
  };

  return (
    <div className="app-background" style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Animated Background */}
      <div className="liquid-blob liquid-blob-1"></div>
      <div className="liquid-blob liquid-blob-2"></div>
      <div className="liquid-blob liquid-blob-3"></div>
      <div className="neural-network"></div>
      <div className="noise-overlay"></div>
      
      {/* Top Navigation */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        right: '20px',
        background: 'rgba(102, 126, 234, 0.1)',
        border: '1px solid rgba(102, 126, 234, 0.3)',
        borderRadius: '12px',
        padding: '12px 20px',
        color: 'white',
        backdropFilter: 'blur(20px)',
        fontSize: '14px',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          🇳🇴 SnakkaZ Norwegian Enterprise Chat
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', opacity: 0.8 }}>
            Velkommen, {authContext?.user?.email}
          </span>
          <button 
            onClick={handleLogout}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '6px',
              padding: '6px 12px',
              color: 'white',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Logg ut
          </button>
        </div>
      </div>
      
      {/* Glass Liquid Chat Interface - with margin for header */}
      <div style={{ paddingTop: '80px' }}>
        <SnakkazGlassLiquidChat />
      </div>
    </div>
  );
};

// Home redirect component
const HomeRedirect = () => {
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    return <Navigate to="/login" replace />;
  }

  const { user, loading } = authContext;

  if (loading) {
    return <LoadingFallback />;
  }

  if (user) {
    return <Navigate to="/chat" replace />;
  }

  return <Navigate to="/login" replace />;
};

const AppRouterSimple = () => {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Home route - redirect based on auth */}
            <Route path="/" element={<HomeRedirect />} />
            
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected chat route */}
            <Route 
              path="/chat" 
              element={
                <AuthGuard>
                  <ChatApp />
                </AuthGuard>
              } 
            />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
};

export default AppRouterSimple;