import React, { Suspense, lazy, useEffect } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProfileProvider } from './hooks/useProfile';
import { ThemeProvider } from './hooks/useTheme';
import { AppEncryptionProvider } from './contexts/AppEncryptionContext';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useTheme } from '@/hooks/useTheme';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSearchParams } from 'react-router-dom';
import { AppHeader } from './components/chat/header/AppHeader';
import AppNavigation from './components/nav/AppNavigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Lazy loaded components for better performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Chat = lazy(() => import('./pages/Chat'));
const GroupChatPage = lazy(() => import('./pages/GroupChatPage'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const SyncDashboard = lazy(() => import('./components/sync/SyncDashboard').then(module => ({ default: module.SyncDashboard })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex h-full w-full items-center justify-center bg-cyberdark-950">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-cybergold-400" />
      <p className="text-cybergold-300">Laster inn...</p>
    </div>
  </div>
);

// Define a FallbackComponent for error handling
const ErrorFallback: React.FC<FallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => (
  <div className="flex flex-col items-center justify-center h-full p-6 bg-cyberdark-950 text-cybergold-200">
    <div className="w-full max-w-md p-6 rounded-lg border border-red-800 bg-cyberdark-900">
      <h2 className="text-xl font-bold mb-4 text-red-500">Oops, noe gikk galt</h2>
      <div className="bg-cyberdark-800 p-4 rounded mb-4 overflow-auto max-h-40">
        <p className="text-red-400 font-mono text-sm">{error.message}</p>
      </div>
      <p className="mb-4 text-cybergold-400">Vi beklager feilen. Prøv å laste siden på nytt.</p>
      <Button 
        onClick={resetErrorBoundary}
        className="bg-cybergold-600 hover:bg-cybergold-500 text-black"
      >
        Prøv igjen
      </Button>
    </div>
  </div>
);

// Simple FriendRequestsPage component
const FriendRequestsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-cybergold-300">Venneforespørsler</h1>
      <p className="text-cybergold-200">Ingen ventende venneforespørsler.</p>
    </div>
  );
};

// Authentication guard component
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <LoadingFallback />;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Group invite dialog component
const GroupInviteDialog: React.FC = () => {
  const [showInviteDialog, setShowInviteDialog] = React.useState(false);
  const [inviteCode, setInviteCode] = React.useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  
  useEffect(() => {
    const code = searchParams.get('invite');
    if (code) {
      setInviteCode(code);
      setShowInviteDialog(true);
      
      // Clear the invite code from URL to prevent reuse
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('invite');
      setSearchParams(newParams);
    }
  }, [searchParams, setSearchParams]);
  
  const handleJoinGroup = async () => {
    if (!inviteCode.trim()) {
      toast({
        variant: "destructive",
        title: "Manglende kode",
        description: "Vennligst skriv inn en gyldig invitasjonskode.",
      });
      return;
    }
    
    try {
      // TODO: Implement group joining logic here
      toast({
        title: "Gruppe tilsluttet",
        description: "Du har blitt med i gruppen.",
      });
      setShowInviteDialog(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Kunne ikke bli med i gruppe",
        description: "Det oppstod en feil. Sjekk at koden er korrekt.",
      });
    }
  };
  
  return (
    <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
      <DialogContent className="sm:max-w-[425px] bg-cyberdark-900 border-cybergold-500/30">
        <DialogHeader>
          <DialogTitle className="text-cybergold-300">Bli med i gruppe</DialogTitle>
          <DialogDescription className="text-cybergold-500">
            Skriv inn koden du fikk tilsendt for å bli med i gruppen.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="inviteCode" className="text-right text-cybergold-300">
              Kode
            </Label>
            <Input
              type="text"
              id="inviteCode"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="col-span-3 bg-cyberdark-800 text-cybergold-200 border-cyberdark-700 focus:border-cybergold-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowInviteDialog(false)}
            className="border-cyberdark-700 hover:bg-cyberdark-800"
          >
            Avbryt
          </Button>
          <Button 
            onClick={handleJoinGroup}
            className="bg-cybergold-600 text-black hover:bg-cybergold-500"
          >
            Bli med
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main app component
const App: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { theme } = useTheme();

  // Set appropriate theme class on the document element
  useEffect(() => {
    if (theme) {
      document.documentElement.classList.remove('light', 'dark', 'system');
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>
          <ThemeProvider>
            <AppEncryptionProvider>
              <div className="flex flex-col h-screen bg-cyberdark-950 text-cybergold-200">
                <AppHeader 
                  variant={isMobile ? "mobile" : "main"}
                  title="Snakkaz Chat"
                  showLogo={!isMobile}
                  showNavigation={!isMobile}
                  showUserNav={true}
                  showThemeToggle={true}
                />

                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden">
                  <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onError={(error, info) => {
                      console.error("Error caught by ErrorBoundary:", error);
                      console.error("Component stack:", info.componentStack);
                    }}
                  >
                    <Suspense fallback={<LoadingFallback />}>
                      <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        
                        {/* Protected routes */}
                        <Route path="/chat" element={
                          <RequireAuth>
                            <Chat />
                          </RequireAuth>
                        } />
                        <Route path="/group-chat/:id?" element={
                          <RequireAuth>
                            <GroupChatPage />
                          </RequireAuth>
                        } />
                        <Route path="/profile" element={
                          <RequireAuth>
                            <Profile />
                          </RequireAuth>
                        } />
                        <Route path="/settings/*" element={
                          <RequireAuth>
                            <Settings />
                          </RequireAuth>
                        } />
                        <Route path="/friend-requests" element={
                          <RequireAuth>
                            <FriendRequestsPage />
                          </RequireAuth>
                        } />
                        <Route path="/sync" element={
                          <RequireAuth>
                            <SyncDashboard />
                          </RequireAuth>
                        } />
                        
                        {/* Fallback route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </Suspense>
                  </ErrorBoundary>
                </div>

                {/* Mobile Navigation */}
                {isMobile && (
                  <AppNavigation 
                    variant="bottom"
                    showLabels={true}
                    activeIndicator={true}
                    className="z-50 border-t border-cyberdark-700 bg-cyberdark-900"
                  />
                )}

                {/* Group invite dialog */}
                <GroupInviteDialog />

                {/* Toast notifications */}
                <Toaster />
              </div>
            </AppEncryptionProvider>
          </ThemeProvider>
        </ProfileProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
