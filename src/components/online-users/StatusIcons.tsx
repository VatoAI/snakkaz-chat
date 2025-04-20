
import { Circle, Clock, Loader2 } from "lucide-react";
import { UserStatus } from "@/types/presence";
import { cn } from "@/lib/utils";

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

export const statusColors = {
  online: "text-green-500",
  busy: "text-yellow-500",
  brb: "text-blue-500",
  offline: "text-gray-500"
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
      statusColors[status],
      className
    )} />
  );
};
