import { Card } from "@/components/ui/card";
import { usePinPreferences } from "@/hooks/usePinPreferences";
import { Shield, Lock, Key, Clock, RefreshCcw } from "lucide-react";
import { PreferenceItem } from "../profile/PreferenceItem";
import { PinManagement } from "../pin/PinManagement";
import { Separator } from "../ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { useAuth } from "@/contexts/AuthContext";

interface SecuritySettingsProps {
  userId: string | null;
}

export const SecuritySettings = ({ userId }: SecuritySettingsProps) => {
  const { preferences, loading, updatePreferences } = usePinPreferences(userId);
  const { autoLogoutTime, setAutoLogoutTime, usePinLock, setUsePinLock } = useAuth();

  // Auto logout time options in minutes
  const autoLogoutOptions = [
    { value: null, label: 'Aldri' },
    { value: 5, label: '5 minutter' },
    { value: 15, label: '15 minutter' },
    { value: 30, label: '30 minutter' },
    { value: 60, label: '1 time' },
    { value: 120, label: '2 timer' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-cybergold-400" />
        <h2 className="text-lg font-semibold text-cybergold-300">Sikkerhetsinnstillinger</h2>
      </div>

      {/* Auto-utlogging og sesjons-innstillinger */}
      <Card className="p-6 bg-cyberdark-800/90 border-cybergold-400/50">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-cybergold-400" />
          <h3 className="text-md font-semibold text-cybergold-200">Automatisk utlogging</h3>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="auto-logout" className="text-cybergold-200">Logg meg ut etter inaktivitet</Label>
            <Select 
              value={autoLogoutTime === null ? 'null' : autoLogoutTime.toString()}
              onValueChange={(value) => {
                const minutes = value === 'null' ? null : parseInt(value, 10);
                setAutoLogoutTime(minutes);
              }}
            >
              <SelectTrigger className="w-full bg-cyberdark-900 border-cybergold-500/20 text-white">
                <SelectValue placeholder="Velg tid for auto-utlogging" />
              </SelectTrigger>
              <SelectContent className="bg-cyberdark-900 border-cybergold-500/20 text-white">
                {autoLogoutOptions.map(option => (
                  <SelectItem 
                    key={option.value === null ? 'null' : option.value} 
                    value={option.value === null ? 'null' : option.value.toString()}
                    className="hover:bg-cyberdark-800"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-cybergold-400/60 mt-1">
              Setter en tidsfrist for inaktivitet før automatisk utlogging av sikkerhetshensyn
            </p>
          </div>

          <PreferenceItem
            title="Bruk PIN-lås istedenfor full utlogging"
            description="Vis PIN-skjerm istedenfor å logge helt ut ved inaktivitet"
            checked={usePinLock}
            onCheckedChange={(checked) => setUsePinLock(checked)}
            loading={loading}
          />
        </div>
        
        <Separator className="my-6 bg-cybergold-500/20" />

        <div className="flex items-center gap-2 mb-4">
          <RefreshCcw className="h-4 w-4 text-cybergold-400" />
          <h3 className="text-md font-semibold text-cybergold-200">Sesjons-innstillinger</h3>
        </div>
        
        <div className="space-y-6">
          <PreferenceItem
            title="Hold meg pålogget mellom besøk"
            description="Forbli pålogget når du lukker nettleseren (anbefales ikke på delte enheter)"
            checked={preferences.stayLoggedIn || false}
            onCheckedChange={(checked) => 
              updatePreferences({ stayLoggedIn: checked })
            }
            loading={loading}
          />
        </div>
      </Card>

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