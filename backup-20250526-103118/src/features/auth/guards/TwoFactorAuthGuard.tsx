/**
 * Two Factor Auth Guard Component
 * 
 * This component verifies if a route requires 2FA verification before allowing access.
 * It works together with the regular AuthGuard to ensure complete authentication.
 * 
 * Del av STRATEGISK UTVIKLINGSPLAN - FASE 1: Sikkerhet
 */

import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { requires2FAVerification } from '../helpers/verify2FARequired';
import { TOTPVerification } from '../two-factor/TOTPVerification';
import { Loader2 } from 'lucide-react';

export const TwoFactorAuthGuard: React.FC = () => {
  const { user, session, loading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [show2FAVerification, setShow2FAVerification] = useState(false);
  
  useEffect(() => {
    // Only check 2FA requirement after auth has loaded
    if (!loading && user) {
      // Check if 2FA verification is required
      const requires2FA = requires2FAVerification(user, session);
      
      // If 2FA is required, show the verification screen
      setShow2FAVerification(requires2FA);
      
      // Small delay to prevent flickering
      const timer = setTimeout(() => {
        setIsChecking(false);
      }, 500);
      
      return () => clearTimeout(timer);
    } else if (!loading) {
      setIsChecking(false);
    }
  }, [user, session, loading]);
  
  // Show loading spinner while checking
  if (isChecking || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cyberdark-950">
        <div className="text-center space-y-4">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-cybergold-500" />
          <p className="text-cybergold-400 text-lg">Verifiserer sikker tilgang...</p>
        </div>
      </div>
    );
  }
  
  // If 2FA verification is required, show the verification screen
  if (show2FAVerification && user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cyberdark-950 p-4">
        <div className="w-full max-w-md">
          <TOTPVerification 
            secret={user.user_metadata?.totp_secret}
            onVerificationSuccess={() => setShow2FAVerification(false)}
            // No cancel option - user must verify 2FA or log out
          />
        </div>
      </div>
    );
  }
  
  // If user is authenticated and 2FA is verified (or not required), render the protected route
  return <Outlet />;
};

export default TwoFactorAuthGuard;
