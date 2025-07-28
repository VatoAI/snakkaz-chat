
import { Circle, Clock, Loader2, Moon, EyeOff } from "lucide-react";
import { UserStatus } from "@/types/presence";
import { cn } from "@/lib/utils";
import { statusColors } from "@/constants/colors";

export const statusIcons = {
  online: Circle,
  busy: Clock,
  brb: Loader2,
  away: Moon,
  offline: Circle,
  invisible: EyeOff
};

export const statusLabels = {
  online: "Online",
  busy: "Opptatt",
  brb: "BRB",
  away: "Borte",
  offline: "Offline",
  invisible: "Usynlig"
};

interface StatusIconProps {
  status: UserStatus;
  className?: string;
  size?: number;
}

export const StatusIcon = ({ status, className, size = 4 }: StatusIconProps) => {
  const Icon = statusIcons[status];
  return (
    <Icon className={cn(
      `w-${size} h-${size}`,
      statusColors[status].primary,
      className
    )} />
  );
};
