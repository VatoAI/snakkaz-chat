
import { MessageSquare, Shield, Wifi, ShieldCheck } from "lucide-react";
import { SecurityLevel } from "@/types/security";

interface DirectMessageEmptyStateProps {
  usingServerFallback: boolean;
  securityLevel: SecurityLevel;
}

export const DirectMessageEmptyState = ({ 
  usingServerFallback,
  securityLevel
}: DirectMessageEmptyStateProps) => {
  const securityDescriptions = {
    p2p_e2ee: usingServerFallback 
      ? "Ende-til-ende-kryptert, men direkte tilkobling mislyktes. Faller tilbake til server-basert levering med E2EE."
      : "Høyeste sikkerhetsnivå med direkte tilkobling og ende-til-ende-kryptering.",
    server_e2ee: "Meldinger leveres via server med ende-til-ende-kryptering.",
    standard: "Vanlig kryptering for raskere meldingslevering."
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="bg-cyberdark-800 border border-cybergold-500/20 rounded-lg p-8 max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-cybergold-500/10 flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-cybergold-500" />
          </div>
        </div>
        
        <h3 className="text-xl font-medium text-cybergold-300 mb-2">
          Samtale klar
        </h3>
        
        <p className="text-cybergold-400 mb-4">
          Det er ingen meldinger i denne samtalen ennå. 
          Send den første meldingen for å starte samtalen!
        </p>
        
        <div className="bg-cyberdark-900 border border-cybergold-500/20 rounded-md p-3 text-left">
          <h4 className="text-sm font-medium text-cybergold-300 mb-1 flex items-center">
            {securityLevel === 'p2p_e2ee' && (
              <>
                <ShieldCheck className="h-4 w-4 text-green-500 mr-1" />
                <Wifi className="h-4 w-4 text-green-500 mr-1" />
                Sikker samtale
              </>
            )}
            {securityLevel === 'server_e2ee' && (
              <>
                <Shield className="h-4 w-4 text-blue-500 mr-1" />
                Sikker E2EE samtale
              </>
            )}
            {securityLevel === 'standard' && (
              <>
                <Shield className="h-4 w-4 text-amber-500 mr-1" />
                Standard samtale
              </>
            )}
          </h4>
          <p className="text-xs text-cybergold-400">
            {securityDescriptions[securityLevel]}
          </p>
        </div>
      </div>
    </div>
  );
};
