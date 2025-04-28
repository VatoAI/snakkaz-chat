import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Chat from "./pages/Chat";
import AuthPage from "./pages/auth/AuthPage";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Profile from "./pages/Profile";
import InfoPage from "./pages/Info";
import DownloadPage from "./pages/Download";
import { AppEncryptionProvider } from "./contexts/AppEncryptionContext";

function App() {
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
