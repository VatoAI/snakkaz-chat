import { Outlet, useNavigate } from "react-router-dom";
import { MainNav } from "./components/nav/MainNav";
import { UserNav } from "./components/nav/UserNav";
import { useAuth } from "./hooks/useAuth";
import { useIsMobile } from "./hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import MobileLayout from "./components/mobile/MobileLayout";

const Layout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleDownloadClick = () => {
    navigate('/download');
  };

  // Hvis mobil, bruk mobiloptimalisert layout
  if (isMobile && user) {
    return (
      <MobileLayout>
        <Outlet />
      </MobileLayout>
    );
  }

  return (
    <div className="min-h-screen bg-cyberdark-950 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-cyberdark-800 bg-cyberdark-900/95 backdrop-blur supports-[backdrop-filter]:bg-cyberdark-900/75">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Updated logo element */}
            <div className="flex items-center gap-2 mr-4" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <img
                src="/snakkaz-logo.png"
                alt="SnakkaZ Logo"
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-cybergold-400">SnakkaZ</span>
            </div>
            
            <MainNav />
          </div>

          <div className="flex items-center gap-4">
            {/* Tema-velger */}
            <ThemeToggle />
            
            <Button
              variant="outline"
              size="sm"
              className="bg-cybergold-500/10 border-cybergold-500/30 text-cybergold-400 hover:text-cybergold-300"
              onClick={handleDownloadClick}
            >
              <Download className="w-4 h-4 mr-2" />
              <span className={isMobile ? "hidden" : "inline"}>Last ned app</span>
            </Button>
            
            {user && <UserNav />}
          </div>
        </div>
      </header>

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
