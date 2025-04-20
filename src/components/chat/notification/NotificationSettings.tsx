
import React from 'react';
import { Bell, Volume2, Smartphone } from "lucide-react";
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

export const NotificationSettings = () => {
  const { settings, updateSettings } = useNotifications();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Varselinnstillinger</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4" />
              <Label htmlFor="sound">Lydvarsler</Label>
            </div>
            <Switch
              id="sound"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
            />
          </div>
          
          {settings.soundEnabled && (
            <div className="space-y-2">
              <Label>Lydvolum</Label>
              <Slider
                value={[settings.soundVolume * 100]}
                onValueChange={(value) => updateSettings({ soundVolume: value[0] / 100 })}
                max={100}
                step={1}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4" />
              <Label htmlFor="vibration">Vibrasjon</Label>
            </div>
            <Switch
              id="vibration"
              checked={settings.vibrationEnabled}
              onCheckedChange={(checked) => updateSettings({ vibrationEnabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <Label htmlFor="quietHours">Stille timer</Label>
            </div>
            <Switch
              id="quietHours"
              checked={settings.quietHoursEnabled}
              onCheckedChange={(checked) => updateSettings({ quietHoursEnabled: checked })}
            />
          </div>

          {settings.quietHoursEnabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quietHoursStart">Start</Label>
                <input
                  type="time"
                  id="quietHoursStart"
                  value={settings.quietHoursStart}
                  onChange={(e) => updateSettings({ quietHoursStart: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quietHoursEnd">Slutt</Label>
                <input
                  type="time"
                  id="quietHoursEnd"
                  value={settings.quietHoursEnd}
                  onChange={(e) => updateSettings({ quietHoursEnd: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
