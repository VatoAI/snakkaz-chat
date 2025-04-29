import React from 'react';
import { Outlet } from 'react-router-dom';
import { MainNav } from './components/MainNav';
import { UserNav } from './components/UserNav';
import { useAuth } from './hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Layout() {
  const { user, loading } = useAuth();
  
  // If not loading and no user, redirect to login
  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>;
  }

  // Function to detect device type for downloads
  const detectDevice = () => {
    const userAgent = navigator.userAgent;
    if (/android/i.test(userAgent)) {
      return 'android';
    }
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return 'ios';
    }
    if (/Windows/.test(userAgent)) {
      return 'windows';
    }
    if (/Mac/.test(userAgent)) {
      return 'macos';
    }
    if (/Linux/.test(userAgent)) {
      return 'linux';
    }
    return 'desktop'; // default to desktop tab
  };

  const getDownloadLink = () => {
    const device = detectDevice();
    return `/download?platform=${device}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-cyberdark-950 text-cybergold-200">
      <header className="sticky top-0 z-40 border-b border-cyberdark-700 bg-cyberdark-900/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between py-4">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-cybergold-400">Snakkaz</span>
          </Link>
          
          {/* Main Navigation */}
          <MainNav />
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <Link to={getDownloadLink()} 
                  className="hidden md:flex items-center px-4 py-2 bg-cybergold-600/20 
                             text-cybergold-400 rounded-md hover:bg-cybergold-600/30 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              <span>Last ned app</span>
            </Link>
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <Outlet />
      </main>
      <footer className="border-t border-cyberdark-700 py-4">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-cybergold-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} Snakkaz. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-cybergold-500">
            <a href="/info" className="hover:text-cybergold-400 transition-colors">About</a>
            <a href="/info#privacy" className="hover:text-cybergold-400 transition-colors">Privacy</a>
            <a href="/info#terms" className="hover:text-cybergold-400 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}