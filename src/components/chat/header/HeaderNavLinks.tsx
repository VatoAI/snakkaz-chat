
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Globe, MessageSquare, Users, Volume, Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface HeaderNavLinksProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const HeaderNavLinks = ({ activeTab, onTabChange }: HeaderNavLinksProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
      icon: Volume,
      label: "Lyd",
      onClick: () => navigate("/sound"),
      color: "text-cybergold-300",
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
