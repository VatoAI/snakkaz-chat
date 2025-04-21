
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { usePinPreferences } from "@/hooks/usePinPreferences";
import { Shield } from "lucide-react";

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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-white">
              Krev PIN for å slette meldinger
              <p className="text-xs text-cyberdark-400">Økt sikkerhet for sletting av meldinger</p>
            </Label>
            <Switch
              checked={preferences.requirePinForDelete}
              onCheckedChange={(checked) => 
                updatePreferences({ requirePinForDelete: checked })
              }
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm text-white">
              Krev PIN for å redigere meldinger
              <p className="text-xs text-cyberdark-400">Ekstra beskyttelse for redigering</p>
            </Label>
            <Switch
              checked={preferences.requirePinForEdit}
              onCheckedChange={(checked) => 
                updatePreferences({ requirePinForEdit: checked })
              }
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm text-white">
              Krev PIN for sensitive handlinger
              <p className="text-xs text-cyberdark-400">Generell PIN-beskyttelse for viktige handlinger</p>
            </Label>
            <Switch
              checked={preferences.requirePinForSensitive}
              onCheckedChange={(checked) => 
                updatePreferences({ requirePinForSensitive: checked })
              }
              disabled={loading}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
