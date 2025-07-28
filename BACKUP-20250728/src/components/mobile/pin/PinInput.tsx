
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface PinInputProps {
  code: string;
  showNumber: boolean;
  animateError: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleVisibility: () => void;
}

export const PinInput = ({
  code,
  showNumber,
  animateError,
  onChange,
  onToggleVisibility
}: PinInputProps) => {
  return (
    <div className="relative">
      <Input
        pattern="[0-9]*"
        type={showNumber ? "text" : "password"}
        maxLength={4}
        autoFocus
        value={code}
        onChange={onChange}
        inputMode="numeric"
        placeholder="0000"
        className={`text-center text-2xl tracking-widest py-6 bg-cyberdark-800 border-cybergold-500/30
                  ${animateError ? 'border-cyberred-500 animate-shake' : ''}`}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onToggleVisibility}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cyberblue-400"
      >
        {showNumber ? (
          <X className="h-4 w-4" />
        ) : (
          <span className="text-xs">Vis</span>
        )}
      </Button>
    </div>
  );
};
