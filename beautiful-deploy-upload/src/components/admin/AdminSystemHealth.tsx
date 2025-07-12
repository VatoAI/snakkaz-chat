
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Info } from "lucide-react";
import { useSystemLoad } from "@/hooks/useSystemLoad";
import { useStatusRefresh } from "@/hooks/useStatusRefresh";
import { SystemLoadIndicator } from "./system-health/SystemLoadIndicator";
import { ServiceStatusIndicator } from "./system-health/ServiceStatusIndicator";
import { CleanupSection } from "./system-health/CleanupSection";
import { SystemHealthHeader } from "./system-health/SystemHealthHeader";

interface AdminSystemHealthProps {
  healthStatus: Record<string, string>;
  triggerCleanup: () => Promise<void>;
}

export const AdminSystemHealth = ({ healthStatus, triggerCleanup }: AdminSystemHealthProps) => {
  const { isRefreshing, lastUpdated, refresh } = useStatusRefresh();
  const systemLoad = useSystemLoad();

  return (
    <Card className="bg-cyberdark-900 border-gray-700">
      <CardHeader className="pb-2">
        <SystemHealthHeader 
          isRefreshing={isRefreshing}
          lastUpdated={lastUpdated}
          onRefresh={refresh}
        />
      </CardHeader>

      <CardContent className="space-y-4">
        <SystemLoadIndicator systemLoad={systemLoad} />

        <div className="pt-2">
          {Object.entries(healthStatus).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(healthStatus).map(([id, status]) => (
                <ServiceStatusIndicator key={id} id={id} status={status} />
              ))}
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
