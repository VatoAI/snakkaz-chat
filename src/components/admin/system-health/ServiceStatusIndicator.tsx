
import { Server, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ServiceStatusIndicatorProps {
  id: string;
  status: string;
}

export const ServiceStatusIndicator = ({ id, status }: ServiceStatusIndicatorProps) => {
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

  return (
    <div className="space-y-2">
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
  );
};
