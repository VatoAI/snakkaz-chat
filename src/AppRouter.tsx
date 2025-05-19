/**
 * App Router Configuration
 * 
 * Main router configuration for the Snakkaz Chat application
 * Optimized with code splitting and lazy loading
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import { ChatProvider } from './contexts/ChatContext';

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const SecureChatPage = lazy(() => import('./pages/SecureChatPage'));
const ChatSettingsPage = lazy(() => import('./pages/ChatSettingsPage'));
const SecureMessageViewer = lazy(() => import('./components/chat/SecureMessageViewer'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Layout components (not lazy loaded as they're critical for app structure)
import AppLayout from './components/layout/AppLayout';
import AuthGuard from './components/auth/AuthGuard';

// Loading fallback
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="text-center">
      <div className="spinner-border h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="mt-3">Laster inn...</p>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route element={<AuthGuard />}>
                <Route element={<AppLayout />}>
                  {/* Main app routes */}
                  <Route path="/" element={<Navigate to="/secure-chat" replace />} />
                  
                  {/* Secure Chat */}
                  <Route path="/secure-chat" element={
                    <ChatProvider>
                      <SecureChatPage />
                    </ChatProvider>
                  } />
                  <Route path="/secure-chat/:groupId" element={
                    <ChatProvider>
                      <SecureChatPage />
                    </ChatProvider>
                  } />
                  
                  {/* Settings */}
                  <Route path="/settings" element={<ChatSettingsPage />} />
                </Route>
              </Route>
              
              {/* Public routes */}
              <Route path="/s/:encryptedData" element={<SecureMessageViewer />} />
              
              {/* Not found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default AppRouter;
