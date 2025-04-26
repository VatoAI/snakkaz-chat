
import { Circle, Clock, Loader2 } from "lucide-react";
import { UserStatus } from "@/types/presence";
import { cn } from "@/lib/utils";

// Export the statusColors along with other exports
export const statusColors = {
  online: {
    primary: 'text-emerald-500',
    bg: 'bg-emerald-500',
    border: 'border-emerald-500',
    glow: 'shadow-[0_0_10px_theme(colors.emerald.500)]'
  },
  busy: {
    primary: 'text-amber-500',
    bg: 'bg-amber-500',
    border: 'border-amber-500',
    glow: 'shadow-[0_0_10px_theme(colors.amber.500)]'
  },
  brb: {
    primary: 'text-blue-500',
    bg: 'bg-blue-500',
    border: 'border-blue-500',
    glow: 'shadow-[0_0_10px_theme(colors.blue.500)]'
  },
  offline: {
    primary: 'text-gray-500',
    bg: 'bg-gray-500',
    border: 'border-gray-500',
    glow: 'shadow-[0_0_10px_theme(colors.gray.500)]'
  }
};

export const statusIcons = {
  online: Circle,
  busy: Clock,
  brb: Loader2,
  offline: Circle
};

export const statusLabels = {
  online: "Online",
  busy: "Opptatt",
  brb: "BRB",
  offline: "Offline"
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

