import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppEncryptionProvider } from './contexts/AppEncryptionContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { MessageReplyProvider } from './contexts/MessageReplyContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import InfoPage from './pages/Info';
import DownloadPage from './pages/Download'; 
import AuthPage from './pages/auth/AuthPage';
import { SecuritySettingsPage } from './components/security/SecuritySettingsPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Toaster } from './components/ui/toaster';
import { secureSupabase } from './integrations/supabase/secure-client';
import { supabase } from './integrations/supabase/client';
import { useEffect, useState } from 'react';
import GroupChatPage from './pages/GroupChatPage';
import AdminPanel from './pages/AdminPanel';
import CreateGroupPage from './pages/CreateGroupPage';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('Forbereder...');

  // Logger sikkerhetstiltak og setter opp sikker Supabase klient
  useEffect(() => {
    try {
      // Simuler ladeprosess for bedre brukeropplevelse
      const stages = [
        'Forbereder applikasjonen...',
        'Konfigurerer sikkerhet...',
        'Kobler til tjenester...',
        'Nesten ferdig...'
      ];
      
      let stageIndex = 0;
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + (Math.random() * 15);
          
          // Oppdater ladeteksten basert på fremdrift
          if (newProgress > 25 && stageIndex === 0) {
            setLoadingStage(stages[1]);
            stageIndex = 1;
          } else if (newProgress > 50 && stageIndex === 1) {
            setLoadingStage(stages[2]);
            stageIndex = 2;
          } else if (newProgress > 75 && stageIndex === 2) {
            setLoadingStage(stages[3]);
            stageIndex = 3;
          }
          
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 500);

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
          
          // Uansett om det er feil eller ikke, marker som initialisert og fullfør ladeprosessen
          clearInterval(progressInterval);
          setLoadingProgress(100);
          
          // Kort forsinkelse før app vises, for en jevnere overgang
          setTimeout(() => {
            setIsInitialized(true);
          }, 500);
          
        } catch (err) {
          console.error('Uventet feil ved Supabase-tilkobling:', err);
          setInitError('Kunne ikke initialisere appen. Vennligst prøv igjen senere.');
          clearInterval(progressInterval);
          setIsInitialized(true); // Merk som initialisert for å vise feilmelding
        }
      };
      
      testConnection();
      
      return () => clearInterval(progressInterval);
    } catch (err) {
      console.error('App initialization error:', err);
      setInitError('Det oppstod en feil ved oppstart av appen.');
      setIsInitialized(true);
    }
  }, []);

  // Vis en forbedret laster mens appen initialiseres
  if (!isInitialized) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-cyberdark-950 text-cybergold-400 p-4">
        <div className="flex flex-col items-center max-w-md w-full">
          <img 
            src="/snakkaz-logo.png" 
            alt="Snakkaz" 
            className="w-24 h-24 mb-6 animate-pulse" 
          />
          
          <h1 className="text-2xl font-bold mb-1 text-center">Starter Snakkaz Chat</h1>
          <p className="text-sm text-cybergold-500 mb-6 text-center">{loadingStage}</p>
          
          <div className="w-full h-2 bg-cyberdark-800 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-cybergold-600 to-cybergold-400 transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          
          <p className="text-xs text-cybergold-600">{Math.round(loadingProgress)}%</p>
          
          {/* Sikkerhetsstatusindikator */}
          <div className="mt-8 flex items-center text-xs text-cybergold-600">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            <span>Sikker tilkobling etableres</span>
          </div>
        </div>
        
        <div className="fixed bottom-4 text-xs text-cybergold-700">
          © {new Date().getFullYear()} Snakkaz Chat - Sikker kommunikasjon
        </div>
      </div>
    );
  }

  // Vis en forbedret feilmelding hvis det oppstod en feil
  if (initError) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-cyberdark-950 text-cybergold-400 p-4">
        <div className="flex flex-col items-center max-w-md w-full">
          <img src="/snakkaz-logo.png" alt="Snakkaz" className="w-20 h-20 mb-6 opacity-70" />
          
          <div className="p-6 bg-cyberdark-900 border border-red-500/30 rounded-lg w-full">
            <h1 className="text-xl font-bold mb-4 text-red-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Kunne ikke starte Snakkaz Chat
            </h1>
            <p className="text-cybergold-500 mb-6 text-sm">{initError}</p>
            
            <div className="flex justify-between">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-cybergold-600 text-black rounded-md hover:bg-cybergold-500 transition flex items-center text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Prøv igjen
              </button>
              
              <a 
                href="https://snakkaz.no/support" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-transparent border border-cybergold-600/40 text-cybergold-500 rounded-md hover:bg-cyberdark-800 transition text-sm"
              >
                Kontakt support
              </a>
            </div>
          </div>
          
          <div className="mt-6 text-xs text-cybergold-600 text-center">
            Prøv å sjekke internettforbindelsen din eller oppdater nettleseren.
          </div>
        </div>
      </div>
    );
  }

  // Normal app rendering
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppEncryptionProvider>
          <NotificationProvider>
            <MessageReplyProvider>
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
                    <Route path="group-chat/:id?" element={
                      <ProtectedRoute>
                        <GroupChatPage />
                      </ProtectedRoute>
                    } />
                    <Route path="create-group" element={
                      <ProtectedRoute>
                        <CreateGroupPage />
                      </ProtectedRoute>
                    } />
                    <Route path="profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="security-settings" element={
                      <ProtectedRoute>
                        <SecuritySettingsPage />
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
            </MessageReplyProvider>
          </NotificationProvider>
        </AppEncryptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
