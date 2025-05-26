
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock } from "lucide-react";

export const MessageListHeader = () => {
  return (
    <Alert className="mb-4 bg-cyberdark-800/50 border-cybergold-500/30">
      <AlertDescription className="text-xs text-cybergold-300 flex items-center">
        <Clock className="h-3 w-3 mr-1" /> 
        Alle meldinger slettes automatisk etter 24 timer.
      </AlertDescription>
    </Alert>
  );
};
