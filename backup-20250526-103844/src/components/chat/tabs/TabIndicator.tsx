
import { cn } from "@/lib/utils";

interface TabIndicatorProps {
  isActive: boolean;
}

export const TabIndicator = ({ isActive }: TabIndicatorProps) => {
  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300",
        isActive
          ? "bg-gradient-to-r from-cybergold-500 to-cyberblue-500 scale-x-100 opacity-100"
          : "bg-transparent scale-x-0 opacity-0"
      )}
    />
  );
};
