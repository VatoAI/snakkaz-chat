import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Info from "./pages/Info";
import SafeChatPage from "./pages/chat/SafeChatPage";
import NotFound from "./pages/NotFound";
import SupabaseTest from "./pages/SupabaseTest";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { PresenceProvider } from "./contexts/PresenceContext";
import { Toaster } from "@/components/ui/toaster";
import SupabaseError from "./components/error/SupabaseError";
import { supabase } from "./integrations/supabase/client";
import './App.css';

function App() {
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState<boolean | null>(null);

  // Check if Supabase is properly configured
  useEffect(() => {
    // Short timeout to ensure this runs after initial render
    const timer = setTimeout(() => {
      setIsSupabaseConfigured(supabase !== null);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Show loading state while checking Supabase configuration
  if (isSupabaseConfigured === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  // Show error screen if Supabase is not properly configured
  if (!isSupabaseConfigured) {
    return <SupabaseError />;
  }

  // Render the normal application if Supabase is configured
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <PresenceProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/info" element={<Info />} />
              <Route path="/chat" element={<SafeChatPage />} />
              <Route path="/supabase-test" element={<SupabaseTest />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </PresenceProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
