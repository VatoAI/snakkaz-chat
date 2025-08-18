import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 🎯 Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import SettingsPageNew from './pages/SettingsPageNew';
import ContactsPage from './pages/ContactsPage';
import EnhancedDashboardPage from './pages/EnhancedDashboardPage';
import EnhancedProfilePage from './pages/EnhancedProfilePage';

const SnakkaZApp: React.FC = () => {
  console.log('🇳🇴 SnakkaZ App initialized - Premium Norwegian Chat with MCP Enhancement');

  return (
    <Router future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <div className="snakkaz-app">
        <Routes>
          {/* 🔓 Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 🔒 Protected Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<EnhancedDashboardPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/profile" element={<EnhancedProfilePage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/settings" element={<SettingsPageNew />} />

          {/* Legacy routes for compatibility */}
          <Route path="/old-profile" element={<ProfilePage />} />

          {/* 🔄 Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default SnakkaZApp;
