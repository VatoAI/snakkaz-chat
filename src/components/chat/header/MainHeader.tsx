import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderNavLinks } from "./HeaderNavLinks";
import { Menu, X, User, LogOut, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
  
  // Check if the screen is mobile based on width
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
    <header className="sticky top-0 z-50 w-full bg-cyberdark-900 border-b border-cyberblue-900/30 shadow-md backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo og titel */}
        <div className="flex items-center space-x-3">
          <HeaderLogo />
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cybergold-400 via-white to-cybergold-400 text-transparent bg-clip-text">
            SnakkaZ
          </h1>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && showNavigation && (
          <div className="flex-1 flex justify-center">
            <HeaderNavLinks 
              activeTab={activeTab} 
              onTabChange={onTabChange} 
            />
          </div>
        )}

        {/* Desktop User Menu */}
        {!isMobile && session && (
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="text-cyberblue-400 border-cyberblue-800/40 hover:bg-cyberblue-900/20 hover:text-cyberblue-300"
              onClick={handleProfile}
            >
              <User className="h-4 w-4 mr-2" />
              <span>Profil</span>
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              className="bg-cyberred-600 hover:bg-cyberred-700 text-white"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logg ut</span>
            </Button>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobile && (
          <div className="flex items-center space-x-3">
            {/* Notifications icon */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-cyberblue-400 hover:text-cyberblue-300 h-9 w-9"
            >
              <Bell className="h-5 w-5" />
            </Button>
            
            {/* Hamburger menu */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-cybergold-400 hover:text-cybergold-300 h-9 w-9"
              onClick={handleToggleMobileMenu}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        )}
      </div>

      {/* Mobile menu dropdown */}
      {isMobile && mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-cyberdark-900/95 border-b border-cyberblue-900/30 shadow-lg animate-fadeIn">
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
              className="w-full justify-start text-cybergold-400 hover:bg-cyberdark-800"
              onClick={handleProfile}
            >
              <User className="h-4 w-4 mr-2" />
              Min Profil
            </Button>
            <Button 
              variant="destructive" 
              className="w-full justify-start bg-cyberred-600 hover:bg-cyberred-700 text-white"
              onClick={handleSignOut}
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