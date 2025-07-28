
import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserStatus } from "@/types/presence";
import { statusIcons, statusLabels } from "./StatusIcons";
import { statusColors } from "@/constants/colors";
import { cn } from "@/lib/utils";

interface StatusDropdownProps {
  currentStatus: UserStatus;
  onStatusChange: (status: UserStatus) => void;
}

export const StatusDropdown = ({ currentStatus, onStatusChange }: StatusDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const StatusIcon = statusIcons[currentStatus];
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-400 hover:bg-cyberdark-700"
        >
          <StatusIcon className={cn(
            "w-4 h-4 mr-2",
            statusColors[currentStatus].primary
          )} />
          {statusLabels[currentStatus]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-cyberdark-800 border-cybergold-500/30">
        {Object.entries(statusLabels).map(([status, label]) => (
          <DropdownMenuItem
            key={status}
            onClick={() => {
              onStatusChange(status as UserStatus);
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
                  statusColors[status as UserStatus].primary
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
