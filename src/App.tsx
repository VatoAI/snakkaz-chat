
import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Toaster } from "@/components/ui/toaster";
import { RootErrorBoundary } from './components/error/RootErrorBoundary';
import { supabase } from '@/lib/supabaseClient';
import { verifySupabaseConfig } from '@/services/encryption/supabasePatch';
import { setupGlobalErrorHandlers } from './utils/error/errorHandling';

// Import dynamically loaded feature pages
import { 
  ProfilePage, 
  SettingsPage, 
  GroupChatPage,
  preloadProfileComponents
} from '@/features/dynamic-features';

// Lazy load components for initial routes
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Chat = lazy(() => import("@/pages/Chat"));

// Loading component
const LoadingSpinner = () => (
  <div className="h-screen flex items-center justify-center bg-cyberdark-950">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cybergold-500 mb-4"></div>
      <p className="text-cybergold-400">Laster inn...</p>
    </div>
  </div>
);

// Error component for the ErrorBoundary
const FallbackErrorComponent = ({ error, resetErrorBoundary }) => (
  <div className="h-screen flex items-center justify-center bg-cyberdark-950">
    <div className="flex flex-col items-center max-w-md p-6 bg-cyberdark-900 rounded-lg shadow-lg">
      <h2 className="text-xl text-cybergold-400 mb-4">Noe gikk galt</h2>
      <p className="text-white mb-4">
        Vi beklager, men det har oppstått en feil. Vennligst prøv igjen eller kontakt support hvis problemet vedvarer.
      </p>
      <div className="bg-cyberdark-800 p-4 rounded mb-4 overflow-auto max-h-36">
        <code className="text-red-400 text-sm">{error.message || 'Ukjent feil'}</code>
      </div>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-cybergold-600 hover:bg-cybergold-700 text-black font-medium rounded"
      >
        Prøv igjen
      </button>
    </div>
  </div>
);

// Protected route component
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show a simple loading screen while authentication is checked
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

// Public routes only available to non-authenticated users
const PublicOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  
  // Show a simple loading screen while authentication is checked
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect to chat if already authenticated
  if (user) {
    return <Navigate to="/chat" replace />;
  }

  return children;
};

function App() {
  // Ensure Supabase config is valid when the app initializes
  useEffect(() => {
    // Set up global error handlers
    setupGlobalErrorHandlers();
    
    // Verify Supabase configuration
    verifySupabaseConfig();
  }, []);

  return (
    <RootErrorBoundary>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes (only available when not logged in) */}
            <Route path="/" element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            } />
            <Route path="/register" element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicOnlyRoute>
                <ForgotPassword />
              </PublicOnlyRoute>
            } />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected routes (require login) */}
            <Route path="/chat" element={
              <RequireAuth>
                <Chat />
              </RequireAuth>
            } />
            <Route path="/profile" element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            } />
            <Route path="/settings" element={
              <RequireAuth>
                <SettingsPage />
              </RequireAuth>
            } />
            <Route path="/group/:id" element={
              <RequireAuth>
                <GroupChatPage />
              </RequireAuth>
            } />
            
            {/* Redirect to home page for all other paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        
        <Toaster />
      </AuthProvider>
    </RootErrorBoundary>
  );
}

export default App;
