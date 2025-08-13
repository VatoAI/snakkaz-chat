/**
 * Login Button Component
 * 
 * A modern, animated button component for handling authentication
 * in the Snakkaz Chat application.
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Loader2, LogIn, Shield, Lock, Unlock, AlertTriangle, KeyRound, Eye, CheckCircle } from 'lucide-react';

// CSS Animations for the button
const animations = {
  buttonGlow: `
    @keyframes buttonGlow {
      0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3), 0 0 10px rgba(255, 215, 0, 0.2); }
      50% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.5), 0 0 15px rgba(255, 215, 0, 0.3), 0 0 20px rgba(255, 215, 0, 0.1); }
      100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3), 0 0 10px rgba(255, 215, 0, 0.2); }
    }
  `,
  shineEffect: `
    @keyframes shineEffect {
      from { 
        background-position: -100% 0; 
      }
      to { 
        background-position: 200% 0; 
      }
    }
  `,
  pulse: `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `,
  fadeSlideIn: `
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  secureIconSpin: `
    @keyframes secureIconSpin {
      0% { transform: rotate(0deg); opacity: 0.7; }
      50% { transform: rotate(180deg); opacity: 1; }
      100% { transform: rotate(360deg); opacity: 0.7; }
    }
  `
};

// Login button interface
interface LoginButtonProps {
  onLoginSuccess?: () => void;
  onLoginError?: (error: Error) => void;
  variant?: 'default' | 'outline' | 'ghost' | 'secure';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  fullWidth?: boolean;
  className?: string;
  authMethod?: 'google' | 'email' | 'magic-link' | 'microsoft';
  loginText?: string;
  loadingText?: string;
  errorText?: string;
  secure?: boolean;
  e2ee?: boolean;
}

/**
 * LoginButton component that handles Supabase authentication with enhanced security
 */
export const LoginButton: React.FC<LoginButtonProps> = ({
  onLoginSuccess,
  onLoginError,
  variant = 'default',
  size = 'md',
  showIcon = true,
  fullWidth = false,
  className = '',
  authMethod = 'google',
  loginText = 'Sign In',
  loadingText = 'Logging in...',
  errorText = 'Try Again',
  secure = true,
  e2ee = true
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secureConnection, setSecureConnection] = useState(false);
  const [securityChecked, setSecurityChecked] = useState(false);
  
  // Check connection security on mount
  useEffect(() => {
    const checkConnectionSecurity = async () => {
      // Check if connection is secure (HTTPS)
      const isSecure = window.location.protocol === 'https:';
      setSecureConnection(isSecure);
      setSecurityChecked(true);
    };
    
    checkConnectionSecurity();
  }, []);
  
  // Handle login flow with enhanced security
  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // If not on HTTPS, warn but allow to proceed
      if (!secureConnection && secure) {
        console.warn('Warning: Login attempted on non-secure connection');
      }
      
      let authResponse;
      
      // Handle different authentication methods
      switch (authMethod) {
        case 'google':
          authResponse = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin
            }
          });
          break;
        case 'microsoft':
          authResponse = await supabase.auth.signInWithOAuth({
            provider: 'azure',
            options: {
              redirectTo: window.location.origin
            }
          });
          break;
        case 'magic-link':
          // This would require email input
          // Placeholder for magic link functionality
          console.log('Magic link authentication not yet implemented');
          break;
        case 'email':
          // This would require email and password inputs
          // Placeholder for email/password functionality
          console.log('Email authentication requires additional inputs');
          break;
        default:
          authResponse = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin
            }
          });
      }
      
      if (authResponse?.error) throw authResponse.error;
      
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error during login');
      setError(error.message);
      
      if (onLoginError) {
        onLoginError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Determine size classes
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-2.5 px-6 text-lg'
  }[size];
  
  // Determine variant classes
  const variantClasses = {
    default: `
      bg-gradient-to-r from-cybergold-700 to-cybergold-500 
      hover:from-cybergold-600 hover:to-cybergold-400
      text-cyberdark-900 
      border border-cybergold-500
      shadow-lg shadow-cybergold-900/20
      hover:shadow-cybergold-900/30
      hover:scale-[1.02]
      active:scale-[0.98]
      transition-all duration-300
      after:content-['']
      after:absolute
      after:inset-0
      after:bg-gradient-to-r
      after:from-transparent
      after:via-cybergold-300/30
      after:to-transparent
      after:opacity-0
      hover:after:opacity-100
      after:transition-opacity
      after:duration-1000
      after:animate-[shineEffect_3s_ease-in-out_infinite]
      animate-[buttonGlow_3s_ease-in-out_infinite]
    `,
    outline: `
      bg-transparent
      text-cybergold-500
      border-2 border-cybergold-500/50
      hover:bg-cybergold-900/30
      hover:border-cybergold-500
      hover:text-cybergold-400
      shadow-none
      hover:shadow-inner
      hover:shadow-cybergold-900/10
      transition-all duration-300
    `,
    ghost: `
      bg-transparent 
      text-cybergold-500
      hover:bg-cybergold-900/20
      hover:text-cybergold-400
      border-none
      shadow-none
      transition-all duration-300
    `,
    secure: `
      bg-cyberdark-900
      text-cybergold-500
      border border-cybergold-500
      hover:bg-cyberdark-800
      hover:text-cybergold-400
      shadow-lg shadow-cybergold-900/20
      hover:shadow-cybergold-900/30
      transition-all duration-300
      animate-[secureIconSpin_2s_linear_infinite]
    `
  }[variant];
  
  // Combine all classes
  const buttonClasses = `
    relative
    font-medium
    rounded-md
    overflow-hidden
    flex items-center justify-center
    ${sizeClasses}
    ${variantClasses}
    ${fullWidth ? 'w-full' : ''}
    ${className}
    ${isLoading ? 'opacity-80 cursor-wait' : 'cursor-pointer'}
    ${error ? 'animate-[pulse_2s_ease-in-out]' : ''}
    focus:outline-none focus:ring-2 focus:ring-cybergold-500/50 focus:ring-offset-2 focus:ring-offset-cyberdark-900
  `;
  
  // Add keyframes to document head once
  useEffect(() => {
    const styleId = 'snakkaz-login-animations';
    if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        ${animations.buttonGlow}
        ${animations.shineEffect}
        ${animations.pulse}
        ${animations.fadeSlideIn}
        ${animations.secureIconSpin}
      `;
      document.head.appendChild(style);
    }
    
    return () => {
      if (typeof document !== 'undefined') {
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) {
          existingStyle.parentNode?.removeChild(existingStyle);
        }
      }
    };
  }, []);

  // Security badge to show if connection is secure
  const SecurityBadge = () => {
    if (!securityChecked) return null;
    
    return (
      <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
        {secureConnection ? (
          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle size={12} className="text-cyberdark-900" />
          </div>
        ) : (
          <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
            <AlertTriangle size={12} className="text-cyberdark-900" />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <button 
        className={buttonClasses}
        onClick={handleLogin}
        disabled={isLoading}
        title={`Sign in to Snakkaz Chat${e2ee ? ' (End-to-End Encrypted)' : ''}`}
      >
        <div className="flex items-center justify-center gap-2">
          {showIcon && (
            isLoading ? (
              <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="animate-spin" />
            ) : error ? (
              <AlertTriangle size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="text-red-500" />
            ) : secure ? (
              <KeyRound size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="animate-pulse" />
            ) : (
              <Shield size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
            )
          )}
          
          <span>
            {isLoading ? loadingText : error ? errorText : loginText}
          </span>
          
          {!isLoading && !error && showIcon && (
            <LogIn size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="ml-1" />
          )}
        </div>
        
        {secure && <SecurityBadge />}
      </button>
      
      {error && (
        <div className="text-xs text-red-500 mt-1 animate-[fadeSlideIn_0.3s_ease-in-out]">
          {error}
        </div>
      )}
      
      {e2ee && !error && (
        <div className="text-xs text-cybergold-500/70 mt-1 flex items-center gap-1">
          <Lock size={10} />
          <span>End-to-End Encrypted</span>
        </div>
      )}
    </>
  );
};

// Use Supabase User type
import { User } from '@supabase/supabase-js';

// Export a simple login/logout toggle button
export const AuthButton: React.FC<Omit<LoginButtonProps, 'onLoginSuccess' | 'onLoginError'> & { 
  user: User | null;
  onLogout?: () => void;
}> = ({ user, onLogout, ...props }) => {
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      if (onLogout) onLogout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  return user ? (
    <button 
      className={`
        relative
        font-medium
        rounded-md
        overflow-hidden
        flex items-center justify-center
        bg-cyberdark-800
        text-cybergold-400
        hover:text-cybergold-300
        hover:bg-cyberdark-700
        border border-cyberdark-700
        transition-all duration-200
        ${props.size === 'sm' ? 'py-1.5 px-3 text-sm' : props.size === 'lg' ? 'py-2.5 px-6 text-lg' : 'py-2 px-4 text-base'}
        ${props.fullWidth ? 'w-full' : ''}
        ${props.className || ''}
      `}
      onClick={handleLogout}
      title="Sign out from Snakkaz Chat"
    >
      <div className="flex items-center justify-center gap-2">
        {props.showIcon && <Lock size={props.size === 'sm' ? 14 : props.size === 'lg' ? 20 : 16} />}
        <span>Sign Out</span>
      </div>
    </button>
  ) : (
    <LoginButton {...props} />
  );
};

export default LoginButton;
