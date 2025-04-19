
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
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
    <div className="bg-cyberdark-950 min-h-screen text-white">
      <Router>
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
      </Router>
    </div>
  );
}

export default App;
