
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Settings, Info, Trash } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface AdminSystemHealthProps {
  healthStatus: Record<string, string>;
  triggerCleanup: () => Promise<void>;
}

export const AdminSystemHealth = ({ healthStatus, triggerCleanup }: AdminSystemHealthProps) => {
  const [isLoading, setIsLoading] = useState(false);

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

  const handleCleanup = async () => {
    setIsLoading(true);
    try {
      await triggerCleanup();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-cyberdark-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-cyberblue-300 flex items-center">
          <Info className="mr-2" size={20} />
          System Status
        </CardTitle>
        <CardDescription>Oversikt over systemstatus og helse</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(healthStatus).length > 0 ? (
          Object.entries(healthStatus).map(([id, status]) => (
            <div key={id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  {id.includes("signaling") 
                    ? "Signaling Service" 
                    : id.includes("presence") 
                      ? "Presence Service"
                      : id.substring(0, 8) + "..."}
                </span>
                <span className={`text-sm ${getStatusColor(status)}`}>
                  {status}
                </span>
              </div>
              <Progress 
                value={getStatusPercentage(status)} 
                className="h-1"
              />
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            Ingen helsedata tilgjengelig
          </div>
        )}
        
        <div className="flex gap-2 mt-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={handleCleanup}
                disabled={isLoading}
              >
                <Trash className="mr-2" size={16} />
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
    </Card>
  );
};
