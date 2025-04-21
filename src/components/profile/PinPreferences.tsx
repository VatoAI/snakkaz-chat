
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { usePinPreferences } from "@/hooks/usePinPreferences";
import { Shield } from "lucide-react";
import { EnhancedSwitch } from "./EnhancedSwitch";

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
          <div className="flex items-center justify-between group p-3 rounded-lg transition-colors hover:bg-cyberdark-700/50">
            <div className="space-y-1">
              <Label className="text-sm text-white">
                Krev PIN for å slette meldinger
              </Label>
              <p className="text-xs text-cyberdark-400">Økt sikkerhet for sletting av meldinger</p>
            </div>
            <EnhancedSwitch
              checked={preferences.requirePinForDelete}
              onCheckedChange={(checked) => 
                updatePreferences({ requirePinForDelete: checked })
              }
              loading={loading}
            />
          </div>

          <div className="flex items-center justify-between group p-3 rounded-lg transition-colors hover:bg-cyberdark-700/50">
            <div className="space-y-1">
              <Label className="text-sm text-white">
                Krev PIN for å redigere meldinger
              </Label>
              <p className="text-xs text-cyberdark-400">Ekstra beskyttelse for redigering</p>
            </div>
            <EnhancedSwitch
              checked={preferences.requirePinForEdit}
              onCheckedChange={(checked) => 
                updatePreferences({ requirePinForEdit: checked })
              }
              loading={loading}
            />
          </div>

          <div className="flex items-center justify-between group p-3 rounded-lg transition-colors hover:bg-cyberdark-700/50">
            <div className="space-y-1">
              <Label className="text-sm text-white">
                Krev PIN for sensitive handlinger
              </Label>
              <p className="text-xs text-cyberdark-400">Generell PIN-beskyttelse for viktige handlinger</p>
            </div>
            <EnhancedSwitch
              checked={preferences.requirePinForSensitive}
              onCheckedChange={(checked) => 
                updatePreferences({ requirePinForSensitive: checked })
              }
              loading={loading}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
