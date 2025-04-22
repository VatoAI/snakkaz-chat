
import { Users } from "lucide-react";
import { SecurityLevel } from "@/types/security";

interface GroupChatEmptyStateProps {
  usingServerFallback: boolean;
  securityLevel: SecurityLevel;
}

export const GroupChatEmptyState = ({ 
  usingServerFallback,
  securityLevel
}: GroupChatEmptyStateProps) => {
  const securityDescriptions = {
    p2p_e2ee: usingServerFallback 
      ? "Ende-til-ende-kryptert, men direkte tilkobling mislyktes. Faller tilbake til server-basert levering med E2EE."
      : "Høyeste sikkerhetsnivå med direkte tilkobling og ende-til-ende-kryptering.",
    server_e2ee: "Meldinger leveres via server med ende-til-ende-kryptering for sikker gruppesamtale.",
    standard: "Vanlig kryptering for gruppesamtaler. Best for større grupper."
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="bg-cyberdark-800 border border-cybergold-500/20 rounded-lg p-8 max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-cybergold-500/10 flex items-center justify-center">
            <Users className="h-8 w-8 text-cybergold-500" />
          </div>
        </div>
        
        <h3 className="text-xl font-medium text-cybergold-300 mb-2">
          Gruppesamtale klar
        </h3>
        
        <p className="text-cybergold-400 mb-4">
          Det er ingen meldinger i denne gruppen ennå. 
          Send den første meldingen for å starte samtalen!
        </p>
        
        <div className="bg-cyberdark-900 border border-cybergold-500/20 rounded-md p-3 text-left">
          <h4 className="text-sm font-medium text-cybergold-300 mb-1">
            Sikkerhetsinformasjon:
          </h4>
          <p className="text-xs text-cybergold-400">
            {securityDescriptions[securityLevel]}
          </p>
        </div>
      </div>
    </div>
  );
};
