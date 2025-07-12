
import { BarChart4 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SystemLoadIndicatorProps {
  systemLoad: number;
}

export const SystemLoadIndicator = ({ systemLoad }: SystemLoadIndicatorProps) => {
  return (
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
  );
};
