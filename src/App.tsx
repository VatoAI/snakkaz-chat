import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppEncryptionProvider } from './contexts/AppEncryptionContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import InfoPage from './pages/Info';
import DownloadPage from './pages/Download'; 
import AuthPage from './pages/Auth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Toaster } from './components/ui/toaster';
import { secureSupabase } from './integrations/supabase/secure-client';
import { supabase } from './integrations/supabase/client';
import { useEffect } from 'react';

// Erstatt standard Supabase-klient med den sikre
Object.defineProperty(window, 'supabase', { 
  value: secureSupabase,
  writable: false 
});

function App() {
  // Logger sikkerhetstiltak ved oppstart (kun i utviklingsmodus)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🔒 Snakkaz Chat Enhanced Security:');
      console.log('- Perfect Forward Secrecy aktivert');
      console.log('- Argon2 PIN-sikkerhet implementert');
      console.log('- Sertifikat-pinning aktivert');
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <AppEncryptionProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Navigate to="/chat" replace />} />
                  <Route path="chat" element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  } />
                  <Route path="profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="info" element={<InfoPage />} />
                  <Route path="download" element={<DownloadPage />} />
                </Route>
                <Route path="/auth" element={<AuthPage />} />
              </Routes>
              <Toaster />
            </Router>
          </NotificationProvider>
        </AppEncryptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
