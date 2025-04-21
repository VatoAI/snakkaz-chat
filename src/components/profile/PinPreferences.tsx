
import { Card } from "@/components/ui/card";
import { usePinPreferences } from "@/hooks/usePinPreferences";
import { Shield } from "lucide-react";
import { PreferenceItem } from "./PreferenceItem";

interface PinPreferencesProps {
  userId: string | null;
}

export const PinPreferences = ({ userId }: PinPreferencesProps) => {
  const { preferences, loading, updatePreferences } = usePinPreferences(userId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-cybergold-400" />
        <h2 className="text-lg font-semibold text-cybergold-300">PIN-innstillinger</h2>
      </div>

      <Card className="p-6 bg-cyberdark-800/90 border-cybergold-400/50">
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
