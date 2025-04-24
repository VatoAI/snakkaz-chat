import { Card } from "@/components/ui/card";
import { usePinPreferences } from "@/hooks/usePinPreferences";
import { Shield, Lock, Key } from "lucide-react";
import { PreferenceItem } from "../profile/PreferenceItem";
import { PinManagement } from "../pin/PinManagement";
import { Separator } from "../ui/separator";

interface SecuritySettingsProps {
  userId: string | null;
}

export const SecuritySettings = ({ userId }: SecuritySettingsProps) => {
  const { preferences, loading, updatePreferences } = usePinPreferences(userId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-cybergold-400" />
        <h2 className="text-lg font-semibold text-cybergold-300">Sikkerhetsinnstillinger</h2>
      </div>

      {/* PIN-kode håndtering */}
      <Card className="p-6 bg-cyberdark-800/90 border-cybergold-400/50">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-4 w-4 text-cybergold-400" />
          <h3 className="text-md font-semibold text-cybergold-200">PIN-kode sikkerhet</h3>
        </div>
        
        <PinManagement />
        
        <Separator className="my-6 bg-cybergold-500/20" />
        
        <div className="flex items-center gap-2 mb-4">
          <Key className="h-4 w-4 text-cybergold-400" />
          <h3 className="text-md font-semibold text-cybergold-200">PIN-kode innstillinger</h3>
        </div>
        
        <div className="space-y-6">
          <PreferenceItem
            title="Krev PIN for å slette meldinger"
            description="Økt sikkerhet for sletting av meldinger"
            checked={preferences.requirePinForDelete}
            onCheckedChange={(checked) => 
              updatePreferences({ requirePinForDelete: checked })
            }
            loading={loading}
          />

          <PreferenceItem
            title="Krev PIN for å redigere meldinger"
            description="Ekstra beskyttelse for redigering"
            checked={preferences.requirePinForEdit}
            onCheckedChange={(checked) => 
              updatePreferences({ requirePinForEdit: checked })
            }
            loading={loading}
          />

          <PreferenceItem
            title="Krev PIN for sensitive handlinger"
            description="Generell PIN-beskyttelse for viktige handlinger"
            checked={preferences.requirePinForSensitive}
            onCheckedChange={(checked) => 
              updatePreferences({ requirePinForSensitive: checked })
            }
            loading={loading}
          />
        </div>
      </Card>
    </div>
  );
};