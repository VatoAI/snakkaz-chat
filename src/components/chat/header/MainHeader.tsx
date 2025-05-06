import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AppHeader } from "./AppHeader";
import { HeaderActionButton } from "./HeaderActionButton";
import { useMediaQuery } from "@/hooks/use-media-query";

interface MainHeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  showNavigation?: boolean;
}

export type HeaderVariant = 'default' | 'chat' | 'main';

export const MainHeader = ({ 
  activeTab = "home", 
  onTabChange = () => {}, 
  showNavigation = true 
}: MainHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut, session } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
  
  // Action buttons for desktop header
  const desktopActions = !isMobile && session ? (
    <>
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
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4 mr-2" />
        <span>Logg ut</span>
      </Button>
    </>
  ) : null;

  // Mobile menu toggle button
  const mobileActions = isMobile ? (
    <HeaderActionButton
      icon={mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      label={mobileMenuOpen ? "Lukk meny" : "Åpne meny"}
      onClick={handleToggleMobileMenu}
      className="text-cybergold-300 hover:text-cybergold-200 hover:bg-cyberdark-800"
    />
  ) : null;

  return (
    <>
      <AppHeader
        variant="main"
        showNavigation={showNavigation}
        actions={desktopActions}
      >
        {mobileActions}
      </AppHeader>

      {/* Mobile menu - extracted from the header for cleaner layout */}
      {isMobile && mobileMenuOpen && (
        <div className="absolute top-[53px] left-0 w-full z-50 bg-cyberdark-900/95 border-b border-cyberblue-500/30 shadow-neon-blue animate-fadeIn">
          {session && (
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
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logg ut
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
