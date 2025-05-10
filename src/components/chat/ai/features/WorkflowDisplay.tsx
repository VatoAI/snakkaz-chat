
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WorkflowDisplayProps {
  type: string;
  steps: string[];
  currentStep: number;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const WorkflowDisplay: React.FC<WorkflowDisplayProps> = ({
  type,
  steps,
  currentStep,
  onPrevStep,
  onNextStep
}) => {
  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-cyberdark-900 border border-cybergold-500/40 rounded-lg p-4 shadow-lg max-w-lg w-full">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-cybergold-400">
            {type} ({currentStep + 1}/{steps.length})
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={onPrevStep}
              disabled={currentStep === 0}
              className="p-1 rounded-full hover:bg-cyberdark-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 text-cybergold-400" />
            </button>
            <button
              onClick={onNextStep}
              disabled={currentStep === steps.length - 1}
              className="p-1 rounded-full hover:bg-cyberdark-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 text-cybergold-400" />
            </button>
          </div>
        </div>
        
        <div className="w-full bg-cyberdark-800 h-1 mb-4 rounded-full overflow-hidden">
          <div 
            className="bg-cybergold-500 h-full rounded-full"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        
        <p className="text-cybergold-300">{steps[currentStep]}</p>
      </div>
    </div>
  );
};
