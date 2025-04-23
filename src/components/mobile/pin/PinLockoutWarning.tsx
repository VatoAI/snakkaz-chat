
import { AlertTriangle } from "lucide-react";

interface PinLockoutWarningProps {
  lockoutTimer: number;
}

export const PinLockoutWarning = ({ lockoutTimer }: PinLockoutWarningProps) => {
  return (
    <div className="text-cyberred-400 text-center p-4 bg-cyberred-900/20 rounded-md border border-cyberred-500/20 flex items-center justify-center gap-2">
      <AlertTriangle className="h-4 w-4" />
      Låst i {Math.ceil(lockoutTimer / 60)} minutter
    </div>
  );
};
