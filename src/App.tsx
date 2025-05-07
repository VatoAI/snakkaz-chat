
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load components
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Chat = lazy(() => import("@/pages/Chat"));
const Profile = lazy(() => import("@/pages/Profile"));
const Settings = lazy(() => import("@/pages/Settings"));
const GroupChatPage = lazy(() => import("@/pages/GroupChatPage"));

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
    <ErrorBoundary>
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
