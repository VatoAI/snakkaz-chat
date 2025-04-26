import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderNavLinks } from "./HeaderNavLinks";
import { Menu, X, User, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface MainHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MainHeader = ({ activeTab, onTabChange }: MainHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

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
    await signOut();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-cyberdark-900 border-b border-cyberdark-800 shadow-md backdrop-blur-md bg-opacity-80">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo og titel */}
        <div className="flex items-center space-x-3">
          <HeaderLogo />
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cybergold-400 via-white to-cybergold-400 text-transparent bg-clip-text">
            SnakkaZ
          </h1>
        </div>

        {/* Desktop: Navigation links */}
        {!isMobile && (
          <div className="flex-1 flex justify-center">
            <HeaderNavLinks 
              activeTab={activeTab} 
              onTabChange={onTabChange} 
            />
          </div>
        )}

        {/* Desktop: User menu */}
        {!isMobile && (
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-cybergold-400 hover:bg-cyberdark-800"
              onClick={handleProfile}
            >
              <User className="h-4 w-4 mr-2" />
              Profil
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-cyberred-400 hover:bg-cyberdark-800"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logg ut
            </Button>
          </div>
        )}

        {/* Mobile: Hamburger menu button */}
        {isMobile && (
          <div className="flex items-center">
            {/* Mobile nav links (condensed version) */}
            <div className="mr-2">
              <HeaderNavLinks 
                activeTab={activeTab} 
                onTabChange={handleNavigation} 
              />
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-cyberblue-400"
              onClick={handleToggleMobileMenu}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        )}
      </div>

      {/* Mobile menu dropdown */}
      {isMobile && mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-cyberdark-900 border-b border-cyberdark-800 shadow-lg animate-fadeIn">
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
              variant="ghost" 
              className="w-full justify-start text-cyberred-400 hover:bg-cyberdark-800"
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