
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface EnhancedSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  loading?: boolean;
}

export function EnhancedSwitch({ checked, onCheckedChange, loading }: EnhancedSwitchProps) {
  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={loading}
        className={cn(
          "relative",
          checked ? "bg-cybergold-400 hover:bg-cybergold-500" : "bg-cyberred-400 hover:bg-cyberred-500",
          loading && "opacity-50 cursor-not-allowed"
        )}
      />
      <span className={cn(
        "text-sm font-medium transition-colors",
        checked ? "text-cybergold-400" : "text-cyberred-400"
      )}>
        {checked ? (
          <span className="flex items-center gap-1">
            <Check className="w-4 h-4" />
            På
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <X className="w-4 h-4" />
            Av
          </span>
        )}
      </span>
    </div>
  );
}
