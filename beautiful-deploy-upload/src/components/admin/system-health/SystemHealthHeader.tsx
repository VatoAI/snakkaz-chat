
import { Server, RefreshCcw, Loader2 } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SystemHealthHeaderProps {
  isRefreshing: boolean;
  lastUpdated: Date;
  onRefresh: () => void;
}

export const SystemHealthHeader = ({ 
  isRefreshing, 
  lastUpdated, 
  onRefresh 
}: SystemHealthHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle className="text-cyberblue-300 flex items-center">
          <Server className="mr-2" size={20} />
          System Status
        </CardTitle>
        <CardDescription className="text-xs text-gray-500">
          Sist oppdatert: {lastUpdated.toLocaleTimeString()} ({lastUpdated.toLocaleDateString()})
        </CardDescription>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-300"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw size={16} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Oppdater status</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
