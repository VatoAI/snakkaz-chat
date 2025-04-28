import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Chat from "./pages/Chat";
import AuthPage from "./pages/auth/AuthPage";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
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
              </Route>
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
            <Toaster />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
