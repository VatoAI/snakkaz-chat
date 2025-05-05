
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from 'react-error-boundary';

// Lazy load components
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Chat = lazy(() => import("@/pages/Chat"));
const Profile = lazy(() => import("@/pages/Profile"));
const Settings = lazy(() => import("@/pages/Settings"));
const GroupChatPage = lazy(() => import("@/pages/GroupChatPage"));

// Error fallback component
const ErrorFallback = () => (
  <div className="flex items-center justify-center h-screen bg-cyberdark-950 text-cybergold-400">
    <div className="text-center p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Noe gikk galt</h2>
      <p className="mb-4">Det oppstod en feil under lasting av denne siden.</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-cybergold-600 text-black rounded hover:bg-cybergold-500 transition-colors"
      >
        Last siden på nytt
      </button>
    </div>
  </div>
);

// Loading component
const LoadingSpinner = () => (
  <div className="h-screen flex items-center justify-center bg-cyberdark-950">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cybergold-500 mb-4"></div>
      <p className="text-cybergold-400">Laster inn...</p>
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
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
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
                <Profile />
              </RequireAuth>
            } />
            <Route path="/settings" element={
              <RequireAuth>
                <Settings />
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
    </ErrorBoundary>
  );
}

export default App;
