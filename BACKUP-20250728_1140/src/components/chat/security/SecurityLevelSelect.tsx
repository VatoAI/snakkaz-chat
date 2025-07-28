
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldAlert, Shield, CheckCircle2 } from "lucide-react";
import { SecurityLevel } from "@/types/security";

interface SecurityLevelSelectProps {
  value: SecurityLevel;
  onValueChange: (value: SecurityLevel) => void;
  disabled?: boolean;
}

export const SecurityLevelSelect = ({
  value,
  onValueChange,
  disabled = false
}: SecurityLevelSelectProps) => {
  let Icon;
  let color;
  
  switch (value) {
    case 'p2p_e2ee':
      Icon = ShieldCheck;
      color = 'text-green-400';
      break;
    case 'server_e2ee':
      Icon = ShieldAlert;
      color = 'text-blue-400';
      break;
    case 'standard':
      Icon = Shield;
      color = 'text-amber-400';
      break;
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          disabled={disabled}
          className={`h-8 w-8 ${color} hover:bg-cyberdark-800`}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className={value === 'p2p_e2ee' ? 'bg-cyberdark-700' : ''}
          onClick={() => onValueChange('p2p_e2ee')}
        >
          <ShieldCheck className="mr-2 h-4 w-4 text-green-400" />
          <span>P2P End-to-End Kryptert</span>
          {value === 'p2p_e2ee' && (
            <CheckCircle2 className="ml-auto h-4 w-4" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={value === 'server_e2ee' ? 'bg-cyberdark-700' : ''}
          onClick={() => onValueChange('server_e2ee')}
        >
          <ShieldAlert className="mr-2 h-4 w-4 text-blue-400" />
          <span>Server End-to-End Kryptert</span>
          {value === 'server_e2ee' && (
            <CheckCircle2 className="ml-auto h-4 w-4" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={value === 'standard' ? 'bg-cyberdark-700' : ''}
          onClick={() => onValueChange('standard')}
        >
          <Shield className="mr-2 h-4 w-4 text-amber-400" />
          <span>Standard Kryptering</span>
          {value === 'standard' && (
            <CheckCircle2 className="ml-auto h-4 w-4" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
