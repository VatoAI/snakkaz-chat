/**
 * Enhanced App Component with Full Supabase Authentication
 * Integrates the new auth system with existing routing
 */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/hooks/useAuth';

// Core Pages
const Index = lazy(() => import('@/pages/Index'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));

// Chat Pages
const SnakkaZChatBeta = lazy(() => import('@/pages/SnakkaZChatBeta'));
const BasicChatPage = lazy(() => import('@/pages/BasicChatPage'));

// User Pages
const ProfilePage = lazy(() => import('@/pages/ProfilePageNew'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-cyberdark-950 flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-2 border-cyberblue-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-cyberblue-400 text-sm">Loading SnakkaZ...</p>
    </div>
  </div>
);

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo = '/login' }) => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!authenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, redirectTo = '/chat' }) => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (authenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

// Main App Component
export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cyberdark-950">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            
            {/* Auth Routes - Only accessible when not logged in */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes - Only accessible when logged in */}
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <SnakkaZChatBeta />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/basic-chat" 
              element={
                <ProtectedRoute>
                  <BasicChatPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

        {/* Toast notifications */}
        <Toaster />
      </div>
    </Router>
  );
}
