// filepath: /workspaces/snakkaz-chat/src/App.tsx
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from './hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { Toaster } from "@/components/ui/toaster";
import { RootErrorBoundary } from './components/error/RootErrorBoundary';
import { setupGlobalErrorHandlers } from './utils/error/errorHandling';
import { bootstrapSecurityFeatures } from '@/services/security/securityIntegration';
import { applyEmergencyDevCsp } from '@/services/security/emergencyDevCsp';
import { lcpOptimizer } from '@/services/performance/lcpOptimizer';
import { ENV } from './utils/env/environmentFix';
// Import MCP WebRTC Provider
import MCPWebRTCProvider from './providers/MCPWebRTCProvider';
// PWA and Mobile Components
import PWAHead from './components/mobile/PWAHead';
import MobileOptimization from './components/mobile/MobileOptimization';
import MobileLaunchBanner from './components/mobile/MobileLaunchBanner';
// DEAKTIVERT: Supabase preview (forårsaker konflikter og 404-feil)
// import { initializePreview, shouldShowPreviewNotice, getPreviewDisplayInfo } from '@/utils/supabase/preview-fix';

// Lazy load components with route-based chunking for optimal performance
const Login = lazy(() => import("@/pages/Login"));
const ProfessionalLogin = lazy(() => import("@/pages/ProfessionalLogin"));
const Register = lazy(() => import("@/pages/Register"));
const EmailConfirmation = lazy(() => import("@/pages/EmailConfirmation"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Info = lazy(() => import("@/pages/Info"));
// const InfoNew = lazy(() => import("@/pages/InfoNew"));
// E2EE Test Page
const E2EETestPage = lazy(() => import("@/pages/E2EETestPage"));

// Core chat functionality - separate chunk for main feature
const Chat = lazy(() => import("@/pages/BasicChatPage"));
const ChatPageNew = lazy(() => import("@/pages/ChatPageNew"));

// WebRTC Testing
const WebRTCTest = lazy(() => import("@/components/test/WebRTCImplementationTest"));
const BasicChatPage = lazy(() => import("@/pages/BasicChatPage"));
const ProfessionalChatPage = lazy(() => import("@/pages/ProfessionalChatPage"));
const DemoModePage = lazy(() => import("@/pages/DemoModePage"));

// CloudMCP Demo page (public)
const CloudMCPDemo = lazy(() => import("@/pages/CloudMCPDemo"));

// AI features - separate chunk (lazy load on demand)
const AIChatPage = lazy(() => import("@/features/chat/components/common/AIChatPage"));

// PWA Demo page
const PWADemo = lazy(() => import("@/pages/PWADemo"));

// Mobile test pages
const MobileTestPage = lazy(() => import("@/pages/MobileTestPage"));
// Improved mobile test page
const ImprovedMobileTest = lazy(() => import("@/pages/ImprovedMobileTest"));
// Final mobile test page with Claude-inspired structure
const FinalMobileTest = lazy(() => import("@/pages/FinalMobileTest"));

// Complete mobile test page with header + navigation
const CompleteMobileTest = lazy(() => import("@/pages/CompleteMobileTest"));

// MCP WebRTC test page
const MCPWebRTCTestPage = lazy(() => import("@/pages/MCPWebRTCTestPage"));

// LiquidGlass demo page
const LiquidGlassDemo = lazy(() => import("@/pages/LiquidGlassDemo").then(module => ({ default: module.LiquidGlassDemo })));

// SnakkaZ Chat Beta - Full featured chat system
const SnakkaZChatBeta = lazy(() => import("@/pages/SnakkaZChatBeta"));

// SnakkaZ Beta Landing page
const SnakkaZBetaLanding = lazy(() => import("@/pages/SnakkaZBetaLanding"));

// Group functionality - separate chunk
const CreateGroupPage = lazy(() => import("@/pages/CreateGroupPage"));
const GroupChatPage = lazy(() => import("@/features/chat/components/group/DynamicGroupChatPage"));

// Social features - separate chunk
const FriendsPage = lazy(() => import("@/pages/FriendsPage"));
const FindFriends = lazy(() => import("@/pages/FindFriends"));

// User management - separate chunk (lazy loaded with dynamic wrappers)
const ProfilePageNew = lazy(() => import("@/pages/ProfilePageNew"));
// CloudMCP style pages  
const ProfilePageCloudMCP = lazy(() => import("@/pages/ProfilePageCloudMCP"));
const ChatPageCloudMCP = lazy(() => import("@/pages/ChatPageCloudMCP"));
// Design overview page
const DesignOverview = lazy(() => import("@/pages/DesignOverviewPage"));
const SettingsPage = lazy(() => import("@/components/dynamic/DynamicSettings"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const Mail = lazy(() => import("@/components/dynamic/DynamicMail"));
const MCPDashboard = lazy(() => import("@/pages/MCPDashboard"));
const MemoryDashboard = lazy(() => import("@/components/dynamic/DynamicMemoryDashboard"));

// Subscription features - separate chunk
const Subscription = lazy(() => import("@/pages/Subscription"));

// Admin features - separate chunk (hidden/security sensitive)
const AdminSecurityPanel = lazy(() => import("@/pages/admin/AdminSecurityPanel"));

// Invite system demo
const InviteSystemDemo = lazy(() => import("@/pages/InviteSystemDemo"));

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
const SimpleFallbackError = ({ resetApp }: { resetApp: () => void }) => (
  <div className="flex flex-col items-center justify-center h-screen bg-cyberdark-950">
    <h2 className="text-2xl font-bold text-cybergold-500 mb-4">Oops, something went wrong</h2>
    <p className="text-white mb-6">We're sorry for the inconvenience. Please try again.</p>
    <button 
      onClick={resetApp} 
      className="px-4 py-2 bg-cybergold-600 text-white rounded hover:bg-cybergold-500 transition-colors"
    >
      Restart App
    </button>
  </div>
);

// Super simplified error boundary for production - CLASS COMPONENT (ikke hooks)
class SuperSimpleErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log('🛡️ SuperSimpleErrorBoundary caught error:', error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🛡️ Error caught by SuperSimpleErrorBoundary:', error, errorInfo);
  }

  resetApp = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <SimpleFallbackError resetApp={this.resetApp} />;
    }

    return this.props.children;
  }
}

// A basic auth check component
const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Smart redirect component that handles routing based on auth state
const AuthAwareRedirect = ({ fallback = "/beta" }: { fallback?: string }) => {
  const { user, loading } = useAuth();
  
  // Show loading while checking auth
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // If user is logged in, check if they're a beta user
  if (user) {
    const isBetaUser = localStorage.getItem('snakkaz_beta_user') === 'true';
    
    if (isBetaUser) {
      return <Navigate to="/beta-chat" replace />;
    } else {
      return <Navigate to="/basic-chat" replace />;
    }
  }
  
  // If not logged in, go to beta landing page by default
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
  
  // Handle localhost and IP addresses
  if (hostname === 'localhost' || hostname.startsWith('127.') || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
    console.log(`🏠 Snakkaz Chat: Running on development/local server (${hostname})`);
    return null;
  }
  
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
  // User ID for MCP and WebRTC
  const [userId, setUserId] = useState<string>('');
  
  // Sett bruker-ID fra authentication
  useEffect(() => {
    // Hent bruker-ID fra supabase auth
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: string, session: any) => {
        if (session?.user?.id) {
          setUserId(session.user.id);
        } else {
          setUserId('');
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  // Initialize security features and Supabase preview environment
  useEffect(() => {
    const initApp = async () => {
      try {
        // Apply emergency CSP fix first (for development Google Fonts)
        if (process.env.NODE_ENV === 'development') {
          const { applyEmergencyDevCsp } = await import('@/services/security/emergencyDevCsp');
          applyEmergencyDevCsp();
        }
        
        // Hent bruker-ID for MCP og WebRTC
        const randomId = `user-${Math.random().toString(36).substring(2, 9)}`;
        setUserId(randomId);
        
        // Initialize security features
        await bootstrapSecurityFeatures();
        console.log('Security features initialized');
        
        // DEAKTIVERT: Preview environment (forårsaker konflikter)
        // const previewStatus = await initializePreview();
        // setIsPreviewEnv(shouldShowPreviewNotice());
        
        // Force production environment
        setIsPreviewEnv(false);
        
        console.log('Running in PRODUCTION environment - preview disabled');
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
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AuthProvider>
          <SubdomainRouter />
          {isPreviewEnv && <PreviewBanner />}
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<ProfessionalLogin />} />
              <Route path="/register" element={<Register />} />
              <Route path="/email-confirmation" element={<EmailConfirmation />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/info" element={<Info />} />
              
              {/* Design overview page - shows all design systems */}
              <Route path="/design-overview" element={<DesignOverview />} />
              
              {/* CloudMCP Demo - public showcase of quantum interface */}
              <Route path="/cloudmcp-demo" element={<CloudMCPDemo />} />
              
              {/* <Route path="/info-new" element={<InfoNew />} /> */}
              
              {/* Demo Mode - Shows professional design without auth */}
              <Route path="/demo" element={<DemoModePage />} />
              
              {/* Mobile test page - no auth required for testing */}
              <Route path="/mobile-test" element={<MobileTestPage />} />
              <Route path="/complete-mobile-test" element={<CompleteMobileTest />} />
              <Route path="/improved-mobile-test" element={<ImprovedMobileTest />} />
              <Route path="/final-mobile-test" element={<FinalMobileTest />} />
              <Route path="/final-mobile-test" element={<FinalMobileTest />} />
              
              {/* E2EE Test Page - for testing kryptering */}
              <Route path="/e2ee-test" element={<E2EETestPage />} />
              
              {/* LiquidGlass demo - no auth required for testing */}
              <Route path="/liquid-glass-demo" element={<LiquidGlassDemo />} />
              
              {/* SnakkaZ Beta Landing - no auth required */}
              <Route path="/beta" element={<SnakkaZBetaLanding />} />
              
              {/* MCP WebRTC Test Page - for testing MCP and WebRTC integration */}
              <Route path="/mcp-webrtc-test" element={<MCPWebRTCTestPage />} />
              
              {/* CloudMCP Style Pages - Liquid Glass design */}
              <Route path="/cloudmcp-profile" element={<ProfilePageCloudMCP />} />
              <Route path="/cloudmcp-chat" element={<ChatPageCloudMCP />} />
              
              {/* SnakkaZ Chat Beta - Full featured chat system */}
              <Route 
                path="/beta-chat" 
                element={
                  <RequireAuth>
                    <SnakkaZChatBeta />
                  </RequireAuth>
                } 
              />
              
              {/* Protected routes that need authentication - Updated to use CloudMCP design */}
              <Route 
                path="/basic-chat" 
                element={
                  <RequireAuth>
                    <ChatPageCloudMCP />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/chat" 
                element={
                  <RequireAuth>
                    <Navigate to="/cloudmcp-chat" replace />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/chat/*" 
                element={
                  <RequireAuth>
                    <Navigate to="/cloudmcp-chat" replace />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/friends" 
                element={
                  <RequireAuth>
                    <FriendsPage />
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
                    <ProfilePageCloudMCP />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/profile-new" 
                element={
                  <RequireAuth>
                    <ProfilePageNew />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <RequireAuth>
                    <DashboardPage />
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
              <Route 
                path="/chat-new" 
                element={
                  <RequireAuth>
                    <ChatPageNew />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/invite-system-demo" 
                element={
                  <RequireAuth>
                    <InviteSystemDemo />
                  </RequireAuth>
                } 
              />
              {/* Invite System Demo - no auth required for testing */}
              <Route path="/invite-demo" element={<InviteSystemDemo />} />
              
              {/* PWA Demo - no auth required for testing */}
              <Route path="/pwa-demo" element={<PWADemo />} />
            </Routes>
          </Suspense>
          <Toaster />
          <DeveloperTools />
        </AuthProvider>
        
        {/* PWA and Mobile Components */}
        
        {/* MCPWebRTCProvider - bruker autentisert brukers ID */}
        <MCPWebRTCProvider userId={userId}>
          <PWAHead />
          <MobileOptimization>
            <MobileLaunchBanner />
          </MobileOptimization>
        </MCPWebRTCProvider>
      </BrowserRouter>
    </SuperSimpleErrorBoundary>
  );
}
