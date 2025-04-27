import React from 'react';
import { Bell, Volume2, Smartphone, Clock, Music } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { notificationSounds } from "@/utils/sound-manager";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const NotificationSettings = () => {
  const { settings, updateSettings } = useNotifications();

  // Spiller valgt meldingslyd for forhåndsvisning
  const playSoundPreview = (soundId: string) => {
    const sound = notificationSounds[soundId];
    if (sound) {
      sound.play(settings.soundVolume);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-cyberdark-800 border-cybergold-400/50">
        <DialogHeader>
          <DialogTitle className="text-cybergold-200">Varselinnstillinger</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-cybergold-400" />
              <Label htmlFor="sound" className="text-cyberdark-100">Lydvarsler</Label>
            </div>
            <Switch
              id="sound"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
              className="data-[state=checked]:bg-cybergold-500"
            />
          </div>
          
          {settings.soundEnabled && (
            <>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Music className="h-4 w-4 text-cybergold-400" />
                  <Label className="text-cyberdark-100">Meldingslyd</Label>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={settings.customSoundId || "soft-chime"}
                    onValueChange={(value) => updateSettings({ customSoundId: value })}
                  >
                    <SelectTrigger className="w-full bg-cyberdark-700 border-cybergold-500/30 text-cyberdark-100">
                      <SelectValue placeholder="Velg meldingslyd" />
                    </SelectTrigger>
                    <SelectContent className="bg-cyberdark-700 border-cybergold-500/30">
                      {Object.entries(notificationSounds).map(([id, sound]) => (
                        <SelectItem key={id} value={id} className="text-cyberdark-100 focus:bg-cybergold-500/20 focus:text-cybergold-200">
                          {sound.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="border-cybergold-500/30"
                    onClick={() => playSoundPreview(settings.customSoundId || "soft-chime")}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-cyberdark-100">Lydvolum</Label>
                <Slider
                  value={[settings.soundVolume * 100]}
                  onValueChange={(value) => updateSettings({ soundVolume: value[0] / 100 })}
                  max={100}
                  step={1}
                  className="[&>span:first-child]:bg-cybergold-500/50 [&>span:nth-child(2)]:bg-cybergold-500"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4 text-cybergold-400" />
              <Label htmlFor="vibration" className="text-cyberdark-100">Vibrasjon</Label>
            </div>
            <Switch
              id="vibration"
              checked={settings.vibrationEnabled}
              onCheckedChange={(checked) => updateSettings({ vibrationEnabled: checked })}
              className="data-[state=checked]:bg-cybergold-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-cybergold-400" />
              <Label htmlFor="quietHours" className="text-cyberdark-100">Stille timer</Label>
            </div>
            <Switch
              id="quietHours"
              checked={settings.quietHoursEnabled}
              onCheckedChange={(checked) => updateSettings({ quietHoursEnabled: checked })}
              className="data-[state=checked]:bg-cybergold-500"
            />
          </div>

          {settings.quietHoursEnabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quietHoursStart" className="text-cyberdark-100">Start</Label>
                <input
                  type="time"
                  id="quietHoursStart"
                  value={settings.quietHoursStart}
                  onChange={(e) => updateSettings({ quietHoursStart: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-cyberdark-700 border-cybergold-500/30 text-cyberdark-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quietHoursEnd" className="text-cyberdark-100">Slutt</Label>
                <input
                  type="time"
                  id="quietHoursEnd"
                  value={settings.quietHoursEnd}
                  onChange={(e) => updateSettings({ quietHoursEnd: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-cyberdark-700 border-cybergold-500/30 text-cyberdark-100"
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
