/**
 * App Router Configuration
 * 
 * Main router configuration for the Snakkaz Chat application
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import { ChatProvider } from './services/encryption/ChatContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import SecureChatPage from './pages/SecureChatPage';
import ChatSettingsPage from './pages/ChatSettingsPage';
import SecureMessageViewer from './services/encryption/SecureMessageViewer';
import NotFoundPage from './pages/NotFoundPage';

// Layout components
import AppLayout from './components/layout/AppLayout';
import AuthGuard from './components/auth/AuthGuard';

const AppRouter = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
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
          
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default AppRouter;
