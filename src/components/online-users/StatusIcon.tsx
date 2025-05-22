import { UserStatus } from "@/types/presence";
import { cn } from "@/lib/utils";
import { statusColors } from "@/constants/colors";
import { statusIcons } from "@/constants/statusConfig";

interface StatusIconProps {
  status: UserStatus;
  className?: string;
  size?: number;
  pulseEffect?: boolean;
}

export const StatusIcon = ({ status, className, size = 4, pulseEffect = false }: StatusIconProps) => {
  const Icon = statusIcons[status] || statusIcons.offline;
  const statusColor = statusColors[status] || statusColors.offline;
  
  return (
    <Icon className={cn(
      `w-${size} h-${size}`,
      statusColor.primary,
      pulseEffect && "animate-pulse",
      className
    )} />
  );
};
