import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppEncryptionProvider } from './contexts/AppEncryptionContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import InfoPage from './pages/Info';
import DownloadPage from './pages/Download'; 
import AuthPage from './pages/auth/AuthPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Toaster } from './components/ui/toaster';
import { secureSupabase } from './integrations/supabase/secure-client';
import { supabase } from './integrations/supabase/client';
import { useEffect, useState } from 'react';
import AIChat from './pages/AIChat'; // Import AI Chat page
import GroupChatPage from './pages/GroupChatPage'; // Import Group Chat page
import AdminPanel from './pages/AdminPanel'; // Import Admin Panel

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Logger sikkerhetstiltak og setter opp sikker Supabase klient
  useEffect(() => {
    try {
      // Erstatt standard Supabase-klient med den sikre
      if (secureSupabase) {
        Object.defineProperty(window, 'supabase', { 
          value: secureSupabase,
          writable: false 
        });
        console.log('Sikker Supabase-klient satt opp');
      } else {
        console.warn('Bruker standard Supabase-klient som fallback');
        Object.defineProperty(window, 'supabase', { 
          value: supabase,
          writable: false 
        });
      }

      // Logg sikkerhetstiltak
      if (import.meta.env.DEV) {
        console.log('🔒 Snakkaz Chat Enhanced Security:');
        console.log('- Perfect Forward Secrecy aktivert');
        console.log('- Argon2 PIN-sikkerhet implementert');
        console.log('- Sertifikat-pinning aktivert');
      }

      // Test Supabase-tilkoblingen
      const testConnection = async () => {
        try {
          const client = secureSupabase || supabase;
          const { error } = await client.auth.getSession();
          
          if (error) {
            console.error('Supabase-tilkoblingsfeil:', error.message);
            setInitError('Kunne ikke koble til Supabase. Sjekk nettverkstilkoblingen din.');
          }
          
          // Uansett om det er feil eller ikke, marker som initialisert
          setIsInitialized(true);
        } catch (err) {
          console.error('Uventet feil ved Supabase-tilkobling:', err);
          setInitError('Kunne ikke initialisere appen. Vennligst prøv igjen senere.');
          setIsInitialized(true); // Merk som initialisert for å vise feilmelding
        }
      };
      
      testConnection();
    } catch (err) {
      console.error('App initialization error:', err);
      setInitError('Det oppstod en feil ved oppstart av appen.');
      setIsInitialized(true);
    }
  }, []);

  // Vis en laster eller feilmelding mens appen initialiseres
  if (!isInitialized) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-cyberdark-950 text-cybergold-400">
        <img src="/snakkaz-logo.png" alt="Snakkaz" className="w-16 h-16 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Laster Snakkaz Chat...</h1>
        <div className="w-32 h-1 bg-cyberdark-800 rounded-full overflow-hidden">
          <div className="h-full bg-cybergold-500 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Vis feilmelding hvis det oppstod en feil
  if (initError) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-cyberdark-950 text-cybergold-400">
        <img src="/snakkaz-logo.png" alt="Snakkaz" className="w-16 h-16 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Kunne ikke starte Snakkaz Chat</h1>
        <p className="text-cybergold-500 mb-4">{initError}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-cybergold-600 text-black rounded hover:bg-cybergold-500 transition"
        >
          Prøv igjen
        </button>
      </div>
    );
  }

  // Normal app rendering
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppEncryptionProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  } />
                  <Route path="chat" element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  } />
                  <Route path="ai-chat" element={
                    <ProtectedRoute>
                      <AIChat />
                    </ProtectedRoute>
                  } />
                  <Route path="group-chat/:id?" element={
                    <ProtectedRoute>
                      <GroupChatPage />
                    </ProtectedRoute>
                  } />
                  <Route path="profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="admin" element={
                    <ProtectedRoute>
                      <AdminPanel />
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
