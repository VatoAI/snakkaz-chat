import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import MainNav from './components/MainNav';
import UserNav from './components/UserNav';

// Import sider
import Login from './Login';
import Register from './Register';
import ChatPage from './chat/ChatPage';
import AIChatPage from './chat/AIChatPage'; // Legger til AI-chat side
import Profile from './Profile';
import Settings from './Settings';
import Security from './Security';
import NotFound from './NotFound';
import Groups from './Groups';
import Info from './Info';
// ...andre importer...

const Layout: React.FC = () => {
  const { user, loading } = useAuth();

  // Vis en laster mens autentiseringsstatus sjekkes
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Laster...</div>;
  }

  // Struktur for innloggede brukere
  const AuthenticatedLayout = (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="container mx-auto flex justify-between items-center p-4">
          <MainNav />
          <UserNav />
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/chat" />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/ai-chat" element={<AIChatPage />} /> {/* Ny rute for AI-chat */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/security" element={<Security />} />
          <Route path="/info" element={<Info />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );

  // Struktur for uinnloggede brukere
  const UnauthenticatedLayout = (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/info" element={<Info />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );

  return user ? AuthenticatedLayout : UnauthenticatedLayout;
};

export default Layout;