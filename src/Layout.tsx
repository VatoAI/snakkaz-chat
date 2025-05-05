
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useIsMobile } from "./hooks/use-mobile";
import MobileLayout from "./components/mobile/MobileLayout";
import { AppHeader } from "./components/chat/header/AppHeader";
import AppNavigation from "./components/nav/AppNavigation";

const Layout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // If mobile and user is logged in, use mobile-optimized layout
  if (isMobile && user) {
    return (
      <MobileLayout>
        <Outlet />
      </MobileLayout>
    );
  }

  return (
    <div className="min-h-screen bg-cyberdark-950 flex flex-col">
      <AppHeader 
        variant="default" // Changed from "main" to "default"
        context="direct-message" // Added context prop to match type
        title="SnakkaZ" // Added required title prop
        showNavigation={false}
        showLogo={true}
        showUserNav={!!user}
        showThemeToggle={true}
        showDownloadButton={true}
      >
        <div className="hidden lg:block">
          <AppNavigation 
            variant="horizontal" 
            activeIndicator={true} 
            compact={false}
          />
        </div>
      </AppHeader>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-cyberdark-800 bg-cyberdark-900 py-4">
        <div className="container text-center text-xs text-cyberdark-400">
          © {new Date().getFullYear()} SnakkaZ — Sikker kommunikasjon
        </div>
      </footer>
    </div>
  );
};

export default Layout;
