// filepath: /workspaces/snakkaz-chat/src/App.tsx
import React, { Suspense, lazy, useEffect } from 'react';

// Import the new SnakkazGlassLiquidChat component
import SnakkazGlassLiquidChat from './components/SnakkazGlassLiquidChat';

// Import MCP WebRTC Provider
import MCPWebRTCProvider from './providers/MCPWebRTCProvider';

// PWA and Mobile Components
import PWAHead from './components/mobile/PWAHead';
import MobileOptimization from './components/mobile/MobileOptimization';
import MobileLaunchBanner from './components/mobile/MobileLaunchBanner';

// FASE 6 PWA Excellence - PWA Manager Integration
import { pwaManager } from './utils/pwa-manager';
import PWAComponent from './components/PWAComponent';
import DigitalVokter from './components/DigitalVokter';

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

// FASE 6 Master Dashboard
const Fase6Demo = lazy(() => import("@/pages/Fase6Demo"));

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

// Import the new SnakkazGlassLiquidChat component
import SnakkazGlassLiquidChat from './components/SnakkazGlassLiquidChat';

import React from 'react';

export default function App() {
  console.log('🚀 SnakkaZ App rendering with Glass Liquid design...');
  
  return (
    <div className="app-background" style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Animated Background Blobs */}
      <div className="liquid-blob liquid-blob-1"></div>
      <div className="liquid-blob liquid-blob-2"></div>
      <div className="liquid-blob liquid-blob-3"></div>
      <div className="neural-network"></div>
      <div className="noise-overlay"></div>
      
      {/* CloudMCP Style Chat Interface */}
      <div className="cloudmcp-chat-container">
        {/* Left Sidebar */}
        <aside className="cloudmcp-sidebar">
          <div className="cloudmcp-header">
            <h1 className="glow-text" style={{ color: 'white', fontSize: '28px', margin: '0 0 20px 0' }}>
              SnakkaZ Glass
            </h1>
            <div className="cloudmcp-search">
              <span className="cloudmcp-search-icon">🔍</span>
              <input 
                type="text" 
                className="cloudmcp-search-input" 
                placeholder="Search conversations..."
              />
            </div>
          </div>
          
          <div className="cloudmcp-chat-list">
            <div className="cloudmcp-chat-item active">
              <div className="cloudmcp-avatar-wrapper">
                <div className="cloudmcp-avatar">GL</div>
                <div className="cloudmcp-online-indicator"></div>
              </div>
              <div className="cloudmcp-chat-info">
                <div className="cloudmcp-chat-name">Glass Liquid Demo</div>
                <div className="cloudmcp-chat-message">Design system active! 🌊</div>
              </div>
              <div className="cloudmcp-chat-meta">
                <div className="cloudmcp-chat-time">now</div>
                <div className="cloudmcp-unread-badge">1</div>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Main Chat Area */}
        <main className="cloudmcp-main-chat">
          <header className="cloudmcp-chat-header">
            <div className="cloudmcp-header-info">
              <div className="cloudmcp-avatar-wrapper">
                <div className="cloudmcp-avatar">GL</div>
                <div className="cloudmcp-online-indicator"></div>
              </div>
              <div className="cloudmcp-header-details">
                <h2>Glass Liquid Design System</h2>
                <div className="cloudmcp-header-status">CloudMCP-inspired interface active</div>
              </div>
            </div>
            <div className="cloudmcp-header-actions">
              <button className="cloudmcp-icon-button">⚡</button>
              <button className="cloudmcp-icon-button">🎨</button>
              <button className="cloudmcp-icon-button">✨</button>
            </div>
          </header>
          
          <div className="cloudmcp-messages">
            <div className="cloudmcp-message received">
              <div className="cloudmcp-message-avatar">
                <div className="liquid-avatar" style={{ width: '32px', height: '32px' }}>
                  <div className="liquid-avatar-glow"></div>
                </div>
              </div>
              <div className="cloudmcp-message-content">
                � Welcome to SnakkaZ Glass Liquid Design System!
                <div className="cloudmcp-message-time">just now</div>
              </div>
            </div>
            
            <div className="cloudmcp-message sent">
              <div className="cloudmcp-message-content">
                Incredible! The CloudMCP-inspired design is beautiful! 😍
                <div className="cloudmcp-message-time">just now</div>
              </div>
            </div>
            
            <div className="cloudmcp-message received">
              <div className="cloudmcp-message-avatar">
                <div className="liquid-avatar" style={{ width: '32px', height: '32px' }}>
                  <div className="liquid-avatar-glow"></div>
                </div>
              </div>
              <div className="cloudmcp-message-content">
                The glass morphism effects, liquid animations, and backdrop filters create an amazing Apple-inspired interface! ✨
                <div className="cloudmcp-message-time">just now</div>
              </div>
            </div>
          </div>
          
          <div className="cloudmcp-input-area">
            <div className="cloudmcp-input-container">
              <textarea 
                className="cloudmcp-input"
                placeholder="Experience the Glass Liquid design... Type something!"
                rows="1"
              />
              <div className="cloudmcp-input-actions">
                <button className="cloudmcp-icon-button">📎</button>
                <button className="cloudmcp-icon-button">😊</button>
                <button className="cloudmcp-send-button">
                  <span style={{ fontSize: '20px' }}>✈️</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Status Banner */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'rgba(102, 126, 234, 0.1)',
        border: '1px solid rgba(102, 126, 234, 0.3)',
        borderRadius: '12px',
        padding: '12px 20px',
        color: 'white',
        backdropFilter: 'blur(20px)',
        fontSize: '14px'
      }}>
        🎨 Glass Liquid Design Active
      </div>

      {/* FASE 6 PWA Excellence Components */}
      <PWAComponent 
        showInstallPrompt={true}
        showOfflineIndicator={true}
        showUpdateNotification={true}
        position="bottom-right"
      />
      
      {/* Digital Vokter AI Security */}
      <DigitalVokter />
    </div>
  );
}
