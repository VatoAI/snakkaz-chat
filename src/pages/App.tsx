
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth.tsx";

// Layouts
import Layout from "./Layout";

// Pages
import Index from "./Index";
import Chat from "./Chat";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import Settings from "./Settings";
import Security from "./Security";
import Groups from "./Groups";
import Info from "./Info";
import Admin from "./Admin";
import NotFound from "./NotFound";
import ChatPage from "./chat/ChatPage";
import SafeChatPage from "./chat/SafeChatPage";
import Download from "./Download"; // Fix the import path

// Auth components
import AuthPage from "./auth/AuthPage";

// Import Toaster component
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Authentication routes */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          
          {/* Main app layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="chat" element={<Chat />} />
            <Route path="chat/:id" element={<ChatPage />} />
            <Route path="safechat/:id" element={<SafeChatPage />} />
            <Route path="groups" element={<Groups />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="security" element={<Security />} />
            <Route path="info" element={<Info />} />
            <Route path="admin" element={<Admin />} />
            <Route path="download" element={<Download />} />
          </Route>
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Add Toaster for notifications */}
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
