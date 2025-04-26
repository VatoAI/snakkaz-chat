import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserStatus } from "@/types/presence";
import { statusIcons, statusLabels, statusColors } from "./StatusIcons";
import { cn } from "@/lib/utils";
import { useGlobalPresence } from "@/contexts/PresenceContext";

interface StatusDropdownProps {
  customOnStatusChange?: (status: UserStatus) => void;
  showLabel?: boolean;
  size?: 'default' | 'sm';
  className?: string;
}

export const StatusDropdown = ({ 
  customOnStatusChange, 
  showLabel = true, 
  size = 'sm',
  className 
}: StatusDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentStatus, setCurrentStatus } = useGlobalPresence();
  const StatusIcon = statusIcons[currentStatus];
  
  const handleStatusChange = async (status: UserStatus) => {
    // Update global presence first
    await setCurrentStatus(status);
    
    // Call custom handler if provided
    if (customOnStatusChange) {
      customOnStatusChange(status);
    }
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={size}
          className={cn(
            "bg-cyberdark-800 border-cybergold-500/30 text-cybergold-400 hover:bg-cyberdark-700",
            showLabel ? "" : "px-2",
            className
          )}
        >
          <StatusIcon className={cn(
            "w-4 h-4",
            showLabel && "mr-2",
            statusColors[currentStatus]
          )} />
          {showLabel && statusLabels[currentStatus]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-cyberdark-800 border-cybergold-500/30">
        {Object.entries(statusLabels).map(([status, label]) => (
          <DropdownMenuItem
            key={status}
            onClick={() => {
              handleStatusChange(status as UserStatus);
              setIsOpen(false);
            }}
            className={cn(
              "flex items-center gap-2 text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-700 cursor-pointer",
              currentStatus === status && "bg-cyberdark-700"
            )}
          >
            {(() => {
              const Icon = statusIcons[status as UserStatus];
              return (
                <Icon className={cn(
                  "w-4 h-4",
                  statusColors[status as UserStatus]
                )} />
              );
            })()}
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
