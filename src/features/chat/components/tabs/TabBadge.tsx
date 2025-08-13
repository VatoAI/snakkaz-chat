
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TabBadgeProps {
  variant: 'global' | 'ai' | 'direct';
  children: React.ReactNode;
}

export const TabBadge = ({ variant, children }: TabBadgeProps) => {
  return (
    <Badge 
      className={cn(
        "ml-2 text-xs font-normal",
        variant === 'global' && "bg-cyberblue-500/20 text-cyberblue-400 hover:bg-cyberblue-500/30",
        variant === 'ai' && "bg-cybergold-500/20 text-cybergold-400 hover:bg-cybergold-500/30",
        variant === 'direct' && "bg-cyberred-500/20 text-cyberred-400 hover:bg-cyberred-500/30"
      )}
    >
      {children}
    </Badge>
  );
};
