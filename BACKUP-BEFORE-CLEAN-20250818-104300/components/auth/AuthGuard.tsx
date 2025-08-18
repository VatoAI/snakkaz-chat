/**
 * Auth Guard
 * 
 * Component to protect routes that require authentication
 * Redirects to login if user is not authenticated
 */

import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

const AuthGuard: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    // Only mark as done checking after the auth system has loaded
    if (!loading) {
      // Add a small delay to prevent flicker
      const timer = setTimeout(() => {
        setIsChecking(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [loading]);
  
  // Show loading spinner while checking authentication
  if (isChecking || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cyberdark-950">
        <div className="text-center space-y-4">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-cybergold-500" />
          <p className="text-cybergold-400 text-lg">Laster sikker tilkobling...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login page with return path
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If authenticated, render the child routes
  return <Outlet />;
};

export default AuthGuard;
