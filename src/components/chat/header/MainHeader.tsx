import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderNavLinks } from "./HeaderNavLinks";
import { Menu, X, User, LogOut, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { MainNav } from "@/components/nav/MainNav";

interface MainHeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  showNavigation?: boolean;
}

export const MainHeader = ({ 
  activeTab = "home", 
  onTabChange = () => {}, 
  showNavigation = true 
}: MainHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut, session } = useAuth();
  const navigate = useNavigate();
  
  const isMobile = window.innerWidth < 768;

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (tab: string) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  const handleProfile = () => {
    navigate("/profile");
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setMobileMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-cyberdark-900/95 border-b border-cyberblue-500/30 shadow-neon-blue backdrop-blur-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <HeaderLogo />
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cybergold-400 via-white to-cybergold-400 text-transparent bg-clip-text">
            SnakkaZ
          </h1>
        </div>

        {!isMobile && showNavigation && (
          <div className="flex-1 flex justify-center">
            <MainNav />
          </div>
        )}

        {!isMobile && session && (
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="text-cyberblue-300 border-cyberblue-500/40 hover:bg-cyberblue-900/20 hover:text-cyberblue-200"
              onClick={handleProfile}
            >
              <User className="h-4 w-4 mr-2" />
              <span>Profil</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-cyberred-400 hover:bg-cyberred-900/20 hover:text-cyberred-300"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logg ut</span>
            </Button>
          </div>
        )}

        {isMobile && (
          <div className="flex items-center space-x-3">
            <MainNav />
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-cybergold-300 hover:text-cybergold-200 hover:bg-cyberdark-800 h-9 w-9"
              onClick={handleToggleMobileMenu}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        )}
      </div>

      {isMobile && mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-cyberdark-900/95 border-b border-cyberblue-500/30 shadow-neon-blue animate-fadeIn">
          {showNavigation && (
            <div className="px-4 py-3 border-b border-cyberdark-800">
              <HeaderNavLinks 
                activeTab={activeTab} 
                onTabChange={handleNavigation}
                vertical={true}
              />
            </div>
          )}
          
          <div className="py-4 px-6 space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-cyberblue-300 hover:bg-cyberdark-800 hover:text-cyberblue-200"
              onClick={handleProfile}
            >
              <User className="h-4 w-4 mr-2" />
              Min Profil
            </Button>
            <Button 
              variant="destructive" 
              className="w-full justify-start bg-cyberred-600 hover:bg-cyberred-700 text-white"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logg ut
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
