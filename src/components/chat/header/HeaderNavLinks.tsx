
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Globe, MessageSquare, Users, Volume, VolumeX, Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { UserStatus } from "@/types/presence";

interface HeaderNavLinksProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentStatus?: UserStatus;
}

export const HeaderNavLinks = ({ activeTab, onTabChange, currentStatus = 'online' }: HeaderNavLinksProps) => {
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

  return (
    <TooltipProvider>
      <nav className="flex gap-1 items-center">
        {links.map((link, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={isMobile ? "sm" : "icon"}
                className={`${link.color} ${link.hoverColor} transition-all duration-300
                          ${activeTab === link.value ? 'bg-cyberdark-800 shadow-neon-blue' : ''}
                          ${isMobile ? 'w-10 h-10 p-0' : ''}`}
                onClick={link.onClick}
              >
                <link.icon className={isMobile ? "h-5 w-5" : "h-4 w-4"} />
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
