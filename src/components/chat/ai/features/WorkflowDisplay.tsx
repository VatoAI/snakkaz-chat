
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Workflow } from "lucide-react";

interface WorkflowDisplayProps {
  type: string;
  steps: string[];
  currentStep: number;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const WorkflowDisplay = ({ 
  type, 
  steps, 
  currentStep, 
  onPrevStep, 
  onNextStep 
}: WorkflowDisplayProps) => {
  return (
    <Card className="absolute bottom-4 right-4 w-80 p-4 bg-cyberdark-800 border-cybergold-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Workflow className="h-5 w-5 text-cybergold-400" />
        <h3 className="text-sm font-medium text-cybergold-300">
          Workflow: {type}
        </h3>
      </div>
      <div className="space-y-2 mb-4">
        <p className="text-sm text-cybergold-200">
          Steg {currentStep + 1} av {steps.length}:
        </p>
        <p className="text-sm text-white">
          {steps[currentStep]}
        </p>
      </div>
      <div className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevStep}
          disabled={currentStep === 0}
          className="text-cybergold-400 border-cybergold-500/30"
        >
          Forrige
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextStep}
          disabled={currentStep === steps.length - 1}
          className="text-cybergold-400 border-cybergold-500/30"
        >
          Neste
        </Button>
      </div>
    </Card>
  );
};
