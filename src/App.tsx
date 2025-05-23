// filepath: /workspaces/snakkaz-chat/src/App.tsx
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Toaster } from "@/components/ui/toaster";
import { RootErrorBoundary } from './components/error/RootErrorBoundary';
import { verifySupabaseConfig } from '@/services/encryption/supabasePatch';
import { setupGlobalErrorHandlers } from './utils/error/errorHandling';
import { bootstrapSecurityFeatures } from '@/services/security/securityIntegration';
import { ENV } from './utils/env/environmentFix';
import { initializePreview, shouldShowPreviewNotice, getPreviewDisplayInfo } from '@/utils/supabase/preview-fix';

// Import dynamically loaded feature pages
const ProfilePage = lazy(() => import("@/pages/Profile"));
const SettingsPage = lazy(() => import("@/pages/Settings"));
const GroupChatPage = lazy(() => import("@/pages/GroupChatPage"));

// Lazy load components for initial routes
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Chat = lazy(() => import("@/pages/OptimizedChat"));
const Subscription = lazy(() => import("@/pages/Subscription"));

// Loading component
const LoadingSpinner = () => (
  <div className="h-screen flex items-center justify-center bg-cyberdark-950">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cybergold-500 mb-4"></div>
      <p className="text-cybergold-400">Laster inn...</p>
    </div>
  </div>
);

// Error fallback component - extremely simplified for better stability
const SimpleFallbackError = ({ resetApp }) => (
  <div className="h-screen flex items-center justify-center bg-black">
    <div className="flex flex-col items-center max-w-md p-6 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl text-yellow-400 mb-4">Noe gikk galt</h2>
      <p className="text-white mb-4">
        Vi beklager, men det har oppstått en feil i Snakkaz Chat.
      </p>
      <button
        onClick={resetApp}
        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-black font-medium rounded"
      >
        Last siden på nytt
      </button>
    </div>
  </div>
);

// Super simplified error boundary for production
function SuperSimpleErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const handleError = () => {
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);
  
  const resetApp = () => {
    window.location.reload();
  };
  
  if (hasError) {
    return <SimpleFallbackError resetApp={resetApp} />;
  }
  
  return children;
}

// A basic auth check component
const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Preload components function
const preloadComponents = () => {
  try {
    // Preload important components in the background
    import("@/pages/Profile");
    import("@/pages/Settings");
  } catch (e) {
    // Silently ignore any preloading errors
  }
};

// Import the PreviewBanner component
import { PreviewBanner } from '@/components/preview/PreviewIndicator';
import { DeveloperTools } from '@/components/preview/DeveloperTools';

export default function App() {
  // Track if we're in a preview environment
  const [isPreviewEnv, setIsPreviewEnv] = useState(false);
  
  // Initialize security features and Supabase preview environment
  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize security features
        await bootstrapSecurityFeatures();
        console.log('Security features initialized');
        
        // Verify Supabase configuration
        verifySupabaseConfig();
        
        // Initialize preview environment if applicable
        const previewStatus = await initializePreview();
        setIsPreviewEnv(shouldShowPreviewNotice());
        
        if (previewStatus.enabled) {
          console.log('Running in Supabase preview environment:', previewStatus.branch);
        }
      } catch (error) {
        console.error('Failed to initialize application:', error);
      }
    };
    
    initApp();
  }, []);
  
  // Try to preload some components
  useEffect(() => {
    preloadComponents();
  }, []);
  
  return (
    <SuperSimpleErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          {isPreviewEnv && <PreviewBanner />}
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route 
                path="/chat/*" 
                element={
                  <RequireAuth>
                    <Chat />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <RequireAuth>
                    <ProfilePage />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <RequireAuth>
                    <SettingsPage />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/group/:id" 
                element={
                  <RequireAuth>
                    <GroupChatPage />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/subscription" 
                element={
                  <RequireAuth>
                    <Subscription />
                  </RequireAuth>
                } 
              />
              <Route path="/" element={<Navigate to="/chat" replace />} />
              <Route path="*" element={<Navigate to="/chat" replace />} />
            </Routes>
          </Suspense>
          <Toaster />
          <DeveloperTools />
        </AuthProvider>
      </BrowserRouter>
    </SuperSimpleErrorBoundary>
  );
}
