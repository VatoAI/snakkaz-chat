
import React from 'react';
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SecurityLevel } from '@/types/security';

interface SecurityLevelSelectorProps {
  value: SecurityLevel;
  onChange: (value: SecurityLevel) => void;
  disabled?: boolean;
}

export const SecurityLevelSelector = ({ 
  value, 
  onChange,
  disabled = false 
}: SecurityLevelSelectorProps) => {
  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-xs text-cybergold-300">Sikkerhet:</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Velg sikkerhetsnivå for denne samtalen</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Select
        value={value}
        onValueChange={(val) => onChange(val as SecurityLevel)}
        disabled={disabled}
      >
        <SelectTrigger className="w-[180px] h-8 bg-cyberdark-800 border-cybergold-500/30 text-xs">
          <SelectValue placeholder="Velg sikkerhetsnivå" />
        </SelectTrigger>
        <SelectContent className="bg-cyberdark-800 border-cybergold-500/30">
          <SelectItem value="p2p_e2ee" className="flex items-center">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>P2P + E2EE (Høyeste)</span>
            </div>
          </SelectItem>
          <SelectItem value="server_e2ee">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>Server + E2EE (Midlere)</span>
            </div>
          </SelectItem>
          <SelectItem value="standard">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              <span>Standard (Lavest)</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
