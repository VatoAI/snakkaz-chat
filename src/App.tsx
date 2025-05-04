import React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProfileProvider } from './hooks/useProfile';
import { ThemeProvider } from './hooks/useTheme';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import GroupChatPage from './pages/GroupChatPage';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { SyncDashboard } from './components/sync/SyncDashboard';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MobileNavigation } from './components/MobileNavigation';
import { useTheme } from '@/hooks/useTheme';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { Button } from '@/components/ui/button';
import { QrCode, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSearchParams } from 'react-router-dom';

// Simple FriendRequestsPage component
const FriendRequestsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-cybergold-300">Venneforespørsler</h1>
      <p className="text-cybergold-200">Ingen ventende venneforespørsler.</p>
    </div>
  );
};

// Define a FallbackComponent that matches the required props
const ErrorFallback: React.FC<FallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => (
  <div className="error-container">
    <h2>Oops, noe gikk galt</h2>
    <p>{error.message}</p>
    <button onClick={resetErrorBoundary}>Prøv igjen</button>
  </div>
);

const App: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { theme, setTheme } = useTheme();
  const [showInviteDialog, setShowInviteDialog] = React.useState(false);
  const [inviteCode, setInviteCode] = React.useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('invite');
    if (code) {
      setInviteCode(code);
      setShowInviteDialog(true);
    }
  }, [searchParams]);

  const handleError = (error: Error, info: { componentStack: string }) => {
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Component stack:", info.componentStack);
  };

  return (
    <AuthProvider>
      <ProfileProvider>
        <ThemeProvider>
          <div className="flex flex-col h-screen bg-cyberdark-950 text-cybergold-200">
            {/* Top Navigation */}
            <header className="bg-cyberdark-900 border-b border-cyberdark-700 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">Snakkaz Chat</h1>
                {isMobile && (
                  <Button variant="ghost" size="icon" className="ml-2">
                    <Users className="h-5 w-5" />
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <ThemeSwitcher />
              </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onError={(error, info) => {
                  console.error("Error caught by ErrorBoundary:", error);
                  console.error("Component stack:", info.componentStack);
                  // Additional error handling logic here
                }}
              >
                <Router>
                  <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/group-chat/:id?" element={<GroupChatPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/friend-requests" element={<FriendRequestsPage />} />
                    <Route path="/sync" element={<SyncDashboard />} />
                  </Routes>
                </Router>
              </ErrorBoundary>
            </div>

            {/* Mobile Navigation */}
            {isMobile && <MobileNavigation />}

            <Toaster />
          </div>
        </ThemeProvider>
      </ProfileProvider>

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
        </DialogContent>
      </Dialog>
    </AuthProvider>
  );
};

export default App;
