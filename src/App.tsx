import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Toaster } from "@/components/ui/toaster";

// Sider
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Chat from "@/pages/Chat";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import GroupChatPage from "@/pages/GroupChatPage";

// Beskyttet rute komponent
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Vis en enkel lasteskjerm mens autentisering sjekkes
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-cyberdark-950">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cybergold-500 mb-4"></div>
          <p className="text-cybergold-400">Laster inn...</p>
        </div>
      </div>
    );
  }

  // Redirect til login hvis ikke autentisert
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

// Offentlige ruter som bare er tilgjengelige for ikke-autentiserte brukere
const PublicOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  
  // Vis en enkel lasteskjerm mens autentisering sjekkes
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-cyberdark-950">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cybergold-500 mb-4"></div>
          <p className="text-cybergold-400">Laster inn...</p>
        </div>
      </div>
    );
  }

  // Redirect til chat hvis allerede autentisert
  if (user) {
    return <Navigate to="/chat" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Offentlige ruter (bare tilgjengelig når ikke logget inn) */}
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

        {/* Beskyttede ruter (krever innlogging) */}
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
        
        {/* Redirect til hovedsiden for alle andre stier */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <Toaster />
    </AuthProvider>
  );
}

export default App;
