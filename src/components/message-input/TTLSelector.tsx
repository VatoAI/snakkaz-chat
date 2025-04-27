
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TTLSelectorProps {
  ttl: number | null;
  setTtl: (ttl: number | null) => void;
  isLoading: boolean;
  isRecording: boolean;
}

export const TTLSelector = ({ ttl, setTtl, isLoading, isRecording }: TTLSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // TTL options ordered from shortest to longest
  const ttlOptions = [
    { value: 300, label: "5 minutter" },
    { value: 1800, label: "30 minutter" },
    { value: 3600, label: "1 time" },
    { value: 86400, label: "24 timer (standard)" },
    { value: 604800, label: "7 dager" },
  ];
  
  // Find the current TTL option label
  const currentTtlLabel = ttlOptions.find(option => option.value === ttl)?.label || "24 timer (standard)";
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button 
              type="button"
              variant="outline" 
              size="icon"
              className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-700"
              disabled={isLoading || isRecording}
            >
              <Clock className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent className="bg-cyberdark-800 border-cybergold-500/30">
          <p className="text-xs">Velg hvor lenge meldingen skal eksistere: {currentTtlLabel}</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="bg-cyberdark-800 border-cybergold-500/30">
        {ttlOptions.map((option) => (
          <DropdownMenuItem 
            key={option.value}
            className={`text-cybergold-300 hover:bg-cyberdark-700 ${ttl === option.value ? 'bg-cyberdark-700' : ''}`} 
            onClick={() => setTtl(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
