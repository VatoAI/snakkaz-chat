import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Index from '@/pages/Index';
import Chat from '@/pages/Chat';
import NotFound from '@/pages/NotFound';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import Info from '@/pages/Info';
import Admin from '@/pages/Admin';
import Login from '@/pages/Login';
import "./App.css";

function App() {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gradient-to-b from-cyberdark-950 via-cyberdark-900 to-cyberdark-950">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyberblue-500/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyberred-500/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
        </div>
        
        <Router>
          <div className="relative min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profil" element={<Profile />} />
              <Route path="/info" element={<Info />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </div>
    </NotificationProvider>
  );
}

export default App;
