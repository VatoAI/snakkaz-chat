// filepath: /workspaces/snakkaz-chat/src/App.tsx
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Toaster } from "@/components/ui/toaster";
import { RootErrorBoundary } from './components/error/RootErrorBoundary';
import { verifySupabaseConfig } from '@/services/encryption/supabasePatch';
import { setupGlobalErrorHandlers } from './utils/error/errorHandling';
import { bootstrapSecurityFeatures } from '@/services/security/securityIntegration';
import { ENV } from './utils/env/environmentFix';
import { initializePreview, shouldShowPreviewNotice, getPreviewDisplayInfo } from '@/utils/supabase/preview-fix';

// Fix React state synchronization issues
import './utils/reactStateFix';

// Lazy load components with route-based chunking for optimal performance
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const EmailConfirmation = lazy(() => import("@/pages/EmailConfirmation"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Info = lazy(() => import("@/pages/Info"));

// Core chat functionality - separate chunk for main feature
const Chat = lazy(() => import("@/pages/BasicChatPage"));
const BasicChatPage = lazy(() => import("@/pages/BasicChatPage"));

// AI features - separate chunk (lazy load on demand)
const AIChatPage = lazy(() => import("@/features/chat/components/common/AIChatPage"));

// Group functionality - separate chunk
const CreateGroupPage = lazy(() => import("@/pages/CreateGroupPage"));
const GroupChatPage = lazy(() => import("@/features/chat/components/group/DynamicGroupChatPage"));

// Social features - separate chunk
const Friends = lazy(() => import("@/pages/Friends"));
const FindFriends = lazy(() => import("@/pages/FindFriends"));

// User management - separate chunk (lazy loaded with dynamic wrappers)
const ProfilePage = lazy(() => import("@/components/dynamic/DynamicProfile"));
const SettingsPage = lazy(() => import("@/components/dynamic/DynamicSettings"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Mail = lazy(() => import("@/components/dynamic/DynamicMail"));
const MCPDashboard = lazy(() => import("@/pages/MCPDashboard"));
const MemoryDashboard = lazy(() => import("@/components/dynamic/DynamicMemoryDashboard"));

// Subscription features - separate chunk
const Subscription = lazy(() => import("@/pages/Subscription"));

// Admin features - separate chunk (hidden/security sensitive)
const AdminSecurityPanel = lazy(() => import("@/pages/admin/AdminSecurityPanel"));

// Loading component
const LoadingSpinner = () => (
  <div className="h-screen flex items-center justify-center bg-cyberdark-950">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cybergold-500 mb-4"></div>
      <p className="text-cybergold-400">Laster inn...</p>
    </div>
  </div>
);

// Error fallback component - extremely simplified for better stability
const SimpleFallbackError = ({ resetApp }) => (
  <div className="h-screen flex items-center justify-center bg-black">
    <div className="flex flex-col items-center max-w-md p-6 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl text-yellow-400 mb-4">Noe gikk galt</h2>
      <p className="text-white mb-4">
        Vi beklager, men det har oppstått en feil i Snakkaz Chat.
      </p>
      <button
        onClick={resetApp}
        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-black font-medium rounded"
      >
        Last siden på nytt
      </button>
    </div>
  </div>
);

// Super simplified error boundary for production
function SuperSimpleErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const handleError = () => {
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);
  
  const resetApp = () => {
    window.location.reload();
  };
  
  if (hasError) {
    return <SimpleFallbackError resetApp={resetApp} />;
  }
  
  return children;
}

// A basic auth check component
const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Smart redirect component that handles routing based on auth state
const AuthAwareRedirect = ({ fallback = "/login" }: { fallback?: string }) => {
  const { user, loading } = useAuth();
  
  // Show loading while checking auth
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // If user is logged in, go to basic chat (proven working)
  if (user) {
    return <Navigate to="/basic-chat" replace />;
  }
  
  // If not logged in, go to login
  return <Navigate to={fallback} replace />;
};

// Intelligent preloading function with user behavior analysis
const preloadComponents = () => {
  try {
    // Schedule preloading after initial app load
    setTimeout(() => {
      // Preload commonly accessed components after 2 seconds
      import("@/pages/Profile");
      import("@/pages/Settings");
    }, 2000);
    
    // Preload social features after 4 seconds if user is authenticated
    setTimeout(() => {
      if (localStorage.getItem('sb-xkrjfnrrngwovrhcotpj-auth-token')) {
        import("@/pages/Friends");
        import("@/pages/FindFriends");
      }
    }, 4000);
    
    // Preload AI features after 6 seconds for premium users
    setTimeout(() => {
      const userProfile = localStorage.getItem('snakkaz_user_profile');
      if (userProfile && JSON.parse(userProfile)?.isPremium) {
        import("@/features/chat/components/common/AIChatPage");
      }
    }, 6000);
    
    // Preload group features after 8 seconds
    setTimeout(() => {
      import("@/pages/CreateGroupPage");
      import("@/features/chat/components/group/GroupChatPage");
    }, 8000);
  } catch (e) {
    // Silently ignore any preloading errors
  }
};

// Import the PreviewBanner component
import { PreviewBanner } from '@/components/preview/PreviewIndicator';
import { DeveloperTools } from '@/components/preview/DeveloperTools';

// Subdomain detection utility with enhanced debugging
const detectSubdomain = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // Check if we're on a subdomain
  if (parts.length > 2) {
    const subdomain = parts[0];
    const allowedSubdomains = ['dash', 'business', 'docs', 'analytics', 'mcp', 'help'];
    
    if (allowedSubdomains.includes(subdomain)) {
      console.log(`🌐 Snakkaz Chat: Detected subdomain "${subdomain}" - configuring app...`);
      return subdomain;
    } else {
      console.log(`⚠️ Snakkaz Chat: Unknown subdomain "${subdomain}" detected`);
    }
  } else {
    console.log(`🏠 Snakkaz Chat: Running on main domain (${hostname})`);
  }
  
  return null;
};

// Subdomain router component with enhanced functionality
const SubdomainRouter = () => {
  const subdomain = detectSubdomain();
  
  useEffect(() => {
    if (subdomain) {
      // Store subdomain context for the app
      sessionStorage.setItem('snakkaz_subdomain', subdomain);
      sessionStorage.setItem('snakkaz_subdomain_timestamp', new Date().toISOString());
      
      // Set document title and log configuration
      switch (subdomain) {
        case 'dash':
          document.title = 'Snakkaz Chat - Dashboard';
          console.log('📊 Dashboard mode activated');
          break;
        case 'business':
          document.title = 'Snakkaz Chat - Business';
          console.log('💼 Business mode activated');
          break;
        case 'docs':
          document.title = 'Snakkaz Chat - Documentation';
          console.log('📚 Documentation mode activated');
          break;
        case 'analytics':
          document.title = 'Snakkaz Chat - Analytics';
          console.log('📈 Analytics mode activated');
          break;
        case 'mcp':
          document.title = 'Snakkaz Chat - MCP';
          console.log('🔗 MCP mode activated');
          break;
        case 'help':
          document.title = 'Snakkaz Chat - Help';
          console.log('❓ Help mode activated');
          break;
      }
      
      // Store subdomain-specific settings
      sessionStorage.setItem('snakkaz_app_mode', subdomain);
    } else {
      // Main domain configuration
      document.title = 'Snakkaz Chat';
      sessionStorage.setItem('snakkaz_app_mode', 'main');
      console.log('🏠 Main app mode activated');
    }
  }, [subdomain]);

  // Handle MCP subdomain routing
  if (subdomain === 'mcp') {
    return <MCPDashboard />;
  }
  
  return null; // This component only handles side effects for other subdomains
};

export default function App() {
  // Track if we're in a preview environment
  const [isPreviewEnv, setIsPreviewEnv] = useState(false);
  
  // Initialize security features and Supabase preview environment
  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize security features
        await bootstrapSecurityFeatures();
        console.log('Security features initialized');
        
        // Verify Supabase configuration
        verifySupabaseConfig();
        
        // Initialize preview environment if applicable
        const previewStatus = await initializePreview();
        setIsPreviewEnv(shouldShowPreviewNotice());
        
        if (previewStatus.enabled) {
          console.log('Running in Supabase preview environment:', previewStatus.branch);
        }
      } catch (error) {
        console.error('Failed to initialize application:', error);
      }
    };
    
    initApp();
  }, []);
  
  // Try to preload some components
  useEffect(() => {
    preloadComponents();
  }, []);
  
  return (
    <SuperSimpleErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <SubdomainRouter />
          {isPreviewEnv && <PreviewBanner />}
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/email-confirmation" element={<EmailConfirmation />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/info" element={<Info />} />
              
              {/* Protected routes that need authentication */}
              <Route 
                path="/basic-chat" 
                element={
                  <RequireAuth>
                    <BasicChatPage />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/chat" 
                element={
                  <RequireAuth>
                    <Navigate to="/basic-chat" replace />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/chat/*" 
                element={
                  <RequireAuth>
                    <Navigate to="/basic-chat" replace />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/friends" 
                element={
                  <RequireAuth>
                    <Friends />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/find-friends" 
                element={
                  <RequireAuth>
                    <FindFriends />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/group-chat" 
                element={
                  <RequireAuth>
                    <GroupChatPage />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/ai-chat" 
                element={
                  <RequireAuth>
                    <AIChatPage />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/create-group" 
                element={
                  <RequireAuth>
                    <CreateGroupPage />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <RequireAuth>
                    <ProfilePage />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/mail" 
                element={
                  <RequireAuth>
                    <Mail />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <RequireAuth>
                    <SettingsPage />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/group/:id" 
                element={
                  <RequireAuth>
                    <GroupChatPage />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/subscription" 
                element={
                  <RequireAuth>
                    <Subscription />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/memory" 
                element={
                  <RequireAuth>
                    <MemoryDashboard />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <RequireAuth>
                    <div className="min-h-screen bg-cyberdark-950 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl text-cybergold-400 mb-4">Admin Panel</h1>
                        <p className="text-cybergold-300">Admin-funksjonalitet kommer snart</p>
                      </div>
                    </div>
                  </RequireAuth>
                } 
              />
              
              {/* Hidden security panel - only accessible by direct URL */}
              <Route 
                path="/admin/security" 
                element={<AdminSecurityPanel />} 
              />
              
              {/* Default redirects - smart routing based on auth state */}
              <Route path="/" element={
                <AuthAwareRedirect />
              } />
              <Route path="*" element={
                <AuthAwareRedirect fallback="/info" />
              } />
            </Routes>
          </Suspense>
          <Toaster />
          <DeveloperTools />
        </AuthProvider>
      </BrowserRouter>
    </SuperSimpleErrorBoundary>
  );
}
