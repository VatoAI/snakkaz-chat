
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Settings, 
  Info, 
  Trash, 
  RefreshCcw, 
  Loader2, 
  Server,
  BarChart4,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";

interface AdminSystemHealthProps {
  healthStatus: Record<string, string>;
  triggerCleanup: () => Promise<void>;
}

export const AdminSystemHealth = ({ healthStatus, triggerCleanup }: AdminSystemHealthProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [systemLoad, setSystemLoad] = useState(Math.floor(Math.random() * 60) + 20); // Simulate system load

  useEffect(() => {
    // Simulate changing system load
    const interval = setInterval(() => {
      setSystemLoad(prev => {
        const change = Math.floor(Math.random() * 20) - 10;
        const newValue = prev + change;
        return Math.max(10, Math.min(95, newValue));
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    if (!status) return "gray";
    if (status.includes("error")) return "text-red-400";
    if (status.includes("warning")) return "text-yellow-400";
    return "text-green-400";
  };

  const getStatusPercentage = (status: string) => {
    if (!status) return 50;
    if (status.includes("error")) return 30;
    if (status.includes("warning")) return 70;
    return 100;
  };

  const getStatusIcon = (status: string) => {
    if (!status) return <Server className="h-4 w-4 text-gray-400" />;
    if (status.includes("error")) return <XCircle className="h-4 w-4 text-red-400" />;
    if (status.includes("warning")) return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    return <CheckCircle className="h-4 w-4 text-green-400" />;
  };

  const handleCleanup = async () => {
    setIsLoading(true);
    try {
      await triggerCleanup();
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <BarChart4 className="h-4 w-4 mr-2 text-cyberblue-400" />
              <span className="text-sm text-gray-300">System Load</span>
            </div>
            <span className={`text-sm ${systemLoad > 80 ? 'text-red-400' : systemLoad > 60 ? 'text-yellow-400' : 'text-green-400'}`}>
              {systemLoad}%
            </span>
          </div>
          <Progress 
            value={systemLoad} 
            className="h-2"
            color={systemLoad > 80 ? 'red' : systemLoad > 60 ? 'yellow' : 'green'}
          />
        </div>

        <div className="pt-2">
          {Object.entries(healthStatus).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(healthStatus).map(([id, status]) => (
                <div key={id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(status)}
                      <span className="text-sm text-gray-400 ml-2">
                        {id.includes("signaling") 
                          ? "Signaling Service" 
                          : id.includes("presence") 
                            ? "Presence Service"
                            : id.substring(0, 12) + "..."}
                      </span>
                    </div>
                    <span className={`text-sm ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </div>
                  <Progress 
                    value={getStatusPercentage(status)} 
                    className="h-1.5"
                    color={status.includes("error") ? "red" : status.includes("warning") ? "yellow" : "green"}
                  />
                </div>
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
                <Progress 
                  value={100} 
                  className="h-1.5"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Ingen helsedata tilgjengelig
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                className="flex-1 bg-cyberdark-800 hover:bg-cyberdark-700 border border-gray-700"
                onClick={handleCleanup}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2" size={16} className="animate-spin" />
                ) : (
                  <Trash className="mr-2" size={16} />
                )}
                Kjør Opprydning
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Fjerner gamle signaldata og tilstedeværelse</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-400"
              >
                <Settings size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Systemminnstillinger</p>
            </TooltipContent>
          </Tooltip>
        </div>
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
