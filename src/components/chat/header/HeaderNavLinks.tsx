
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, Users, MessageSquare } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

export const HeaderNavLinks = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const links = [
    {
      icon: Globe,
      label: "Global Chat",
      onClick: () => navigate("/chat"),
      color: "text-cyberblue-300",
      hoverColor: "hover:bg-cyberblue-900/20",
    },
    {
      icon: MessageSquare,
      label: "Private Chats",
      onClick: () => navigate("/chat"),
      color: "text-cybergold-400",
      hoverColor: "hover:bg-cyberdark-800/50",
    },
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
