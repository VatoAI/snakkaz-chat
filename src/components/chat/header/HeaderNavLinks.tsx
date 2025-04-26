import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Globe, MessageSquare, Users, Volume, VolumeX, Info, Crown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { UserStatus } from "@/types/presence";

interface HeaderNavLinksProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentStatus?: UserStatus;
  vertical?: boolean; // New prop for vertical layout
}

export const HeaderNavLinks = ({ 
  activeTab, 
  onTabChange, 
  currentStatus = 'online',
  vertical = false
}: HeaderNavLinksProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  useEffect(() => {
    const savedSound = localStorage.getItem('soundEnabled');
    if (savedSound !== null) {
      setIsSoundEnabled(savedSound === 'true');
    }
  }, []);

  const toggleSound = () => {
    const newState = !isSoundEnabled;
    setIsSoundEnabled(newState);
    localStorage.setItem('soundEnabled', String(newState));
  };

  const links = [
    {
      icon: Home,
      label: "Hjem",
      onClick: () => navigate("/"),
      color: "text-cyberblue-300",
      hoverColor: "hover:bg-cyberblue-900/20",
      value: "home"
    },
    {
      icon: Globe,
      label: "Global Chat",
      onClick: () => onTabChange("global"),
      color: "text-cyberblue-400",
      hoverColor: "hover:bg-cyberblue-900/20",
      value: "global"
    },
    {
      icon: MessageSquare,
      label: "Private Chats",
      onClick: () => onTabChange("private"),
      color: "text-cybergold-400",
      hoverColor: "hover:bg-cybergold-900/20",
      value: "private"
    },
    {
      icon: Users,
      label: "Venner",
      onClick: () => onTabChange("friends"),
      color: "text-cyberred-400",
      hoverColor: "hover:bg-cyberred-900/20",
      value: "friends"
    },
    {
      icon: Crown,
      label: "Premium",
      onClick: () => navigate("/profile?tab=premium"),
      color: "text-cybergold-400",
      hoverColor: "hover:bg-cybergold-900/20",
      value: "premium"
    },
    {
      icon: isSoundEnabled ? Volume : VolumeX,
      label: isSoundEnabled ? "Lyd På" : "Lyd Av",
      onClick: toggleSound,
      color: isSoundEnabled ? "text-cybergold-300" : "text-gray-400",
      hoverColor: "hover:bg-cybergold-900/20",
      value: "sound"
    },
    {
      icon: Info,
      label: "Info",
      onClick: () => navigate("/info"),
      color: "text-cyberblue-300",
      hoverColor: "hover:bg-cyberblue-900/20",
      value: "info"
    }
  ];

  // For standard mobile view (not vertical), we'll show fewer buttons
  const displayLinks = (!vertical && isMobile)
    ? links.filter(link => ["global", "private", "friends"].includes(link.value))
    : links;

  // For vertical mobile view, show all links except sound control
  const verticalLinks = vertical 
    ? links.filter(link => link.value !== "sound") 
    : displayLinks;

  if (vertical) {
    return (
      <div className="flex flex-col space-y-1">
        {verticalLinks.map((link, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className={`${link.color} ${link.hoverColor} transition-all duration-300 justify-start
                      ${activeTab === link.value ? 'bg-cyberdark-800 shadow-neon-blue' : ''}
                      w-full text-left`}
            onClick={link.onClick}
          >
            <link.icon className="h-4 w-4 mr-3" />
            {link.label}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <nav className={`flex ${isMobile ? 'gap-1' : 'gap-1.5'} items-center justify-center flex-wrap overflow-x-auto`}>
        {displayLinks.map((link, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={isMobile ? "sm" : "icon"}
                className={`${link.color} ${link.hoverColor} transition-all duration-300
                          ${activeTab === link.value ? 'bg-cyberdark-800' : ''}
                          ${activeTab === link.value ? (
                            link.value === 'global' ? 'shadow-neon-blue' :
                            link.value === 'private' ? 'shadow-neon-gold' :
                            link.value === 'friends' ? 'shadow-neon-red' : 'shadow-neon-blue'
                          ) : ''}
                          ${isMobile ? 'w-10 h-10 min-w-10 p-0' : ''}`}
                onClick={link.onClick}
              >
                <link.icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{link.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </TooltipProvider>
  );
};
