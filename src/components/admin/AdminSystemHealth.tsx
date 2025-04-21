
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Server, RefreshCcw, Loader2, Info, CheckCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useSystemLoad } from "@/hooks/useSystemLoad";
import { SystemLoadIndicator } from "./system-health/SystemLoadIndicator";
import { ServiceStatusIndicator } from "./system-health/ServiceStatusIndicator";
import { CleanupSection } from "./system-health/CleanupSection";

interface AdminSystemHealthProps {
  healthStatus: Record<string, string>;
  triggerCleanup: () => Promise<void>;
}

export const AdminSystemHealth = ({ healthStatus, triggerCleanup }: AdminSystemHealthProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const systemLoad = useSystemLoad();

  const refreshStatus = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  return (
    <Card className="bg-cyberdark-900 border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-cyberblue-300 flex items-center">
            <Server className="mr-2" size={20} />
            System Status
          </CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-300"
                onClick={refreshStatus}
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
        <CardDescription className="text-xs text-gray-500">
          Sist oppdatert: {lastUpdated.toLocaleTimeString()} ({lastUpdated.toLocaleDateString()})
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <SystemLoadIndicator systemLoad={systemLoad} />

        <div className="pt-2">
          {Object.entries(healthStatus).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(healthStatus).map(([id, status]) => (
                <ServiceStatusIndicator key={id} id={id} status={status} />
              ))}

              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-gray-400 ml-2">
                      Database Connection
                    </span>
                  </div>
                  <span className="text-sm text-green-400">
                    Connected
                  </span>
                </div>
                <Progress value={100} className="h-1.5" />
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Ingen helsedata tilgjengelig
            </div>
          )}
        </div>
        
        <CleanupSection onCleanup={triggerCleanup} />
      </CardContent>
      
      <CardFooter className="border-t border-gray-800 pt-4 text-xs text-gray-500">
        <div className="flex items-center">
          <Info size={12} className="mr-1" />
          Systemstatus oppdateres hver 30. sekund
        </div>
      </CardFooter>
    </Card>
  );
};
