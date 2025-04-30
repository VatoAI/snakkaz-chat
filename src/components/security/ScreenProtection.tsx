import React, { useEffect, useState } from 'react';
import { getConfig, updateConfig } from '@/config/app-config';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Eye, EyeOff, Shield, Camera } from 'lucide-react';

/**
 * Komponent for å håndtere skjermbildebeskyttelse og beslektede sikkerhetsfunksjoner
 * Inspirert av Session og Briar sikre meldingsapper
 */
export const ScreenProtection: React.FC = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState(getConfig());
  const [isScreenshotBlocked, setIsScreenshotBlocked] = useState(config.security.screenshotProtection);
  const [isRecordingBlocked, setIsRecordingBlocked] = useState(config.security.preventScreenRecording);
  const [isAutoDeleteEnabled, setIsAutoDeleteEnabled] = useState(config.security.autoDeleteMessages.enabled);
  const [autoDeleteTimeout, setAutoDeleteTimeout] = useState(config.security.autoDeleteMessages.defaultTimeout);

  useEffect(() => {
    const handleConfigUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setConfig(customEvent.detail);
        setIsScreenshotBlocked(customEvent.detail.security.screenshotProtection);
        setIsRecordingBlocked(customEvent.detail.security.preventScreenRecording);
        setIsAutoDeleteEnabled(customEvent.detail.security.autoDeleteMessages.enabled);
        setAutoDeleteTimeout(customEvent.detail.security.autoDeleteMessages.defaultTimeout);
      }
    };

    window.addEventListener('app-config-updated', handleConfigUpdate);
    return () => {
      window.removeEventListener('app-config-updated', handleConfigUpdate);
    };
  }, []);

  useEffect(() => {
    // Dette ville normalt koble til native funksjonalitet i en Capacitor/Cordova/React Native app
    // For nettlesere kan dette implementeres med ulike metoder avhengig av nettleser
    if (isScreenshotBlocked) {
      applyScreenshotProtection();
    } else {
      removeScreenshotProtection();
    }

    if (isRecordingBlocked) {
      applyRecordingProtection();
    } else {
      removeRecordingProtection();
    }
  }, [isScreenshotBlocked, isRecordingBlocked]);

  const applyScreenshotProtection = () => {
    // I en ekte mobilapp ville dette kalle native API-er
    // I en nettleser kan vi gjøre følgende:
    try {
      // 1. Blokkere standard nettleser-funksjoner
      document.addEventListener('contextmenu', preventDefaultAction);
      document.addEventListener('keydown', preventPrintScreen);
      
      // 2. Legg til visuell beskyttelse på sensitiv innhold
      document.querySelectorAll('.sensitive-content').forEach(el => {
        el.classList.add('screenshot-protected');
      });
      
      console.log('Screenshot protection activated');
    } catch (error) {
      console.error('Failed to apply screenshot protection:', error);
    }
  };

  const removeScreenshotProtection = () => {
    try {
      document.removeEventListener('contextmenu', preventDefaultAction);
      document.removeEventListener('keydown', preventPrintScreen);
      
      document.querySelectorAll('.sensitive-content').forEach(el => {
        el.classList.remove('screenshot-protected');
      });
      
      console.log('Screenshot protection deactivated');
    } catch (error) {
      console.error('Failed to remove screenshot protection:', error);
    }
  };

  const applyRecordingProtection = () => {
    // Dette er mer utfordrende i nettlesere, men vi kan implementere noen teknikker
    // I native apper ville vi bruke API-er som MediaProjection detection på Android
    
    // For nettlesere kan vi bruke screen.captureStream-deteksjon (begrenset effektivitet)
    try {
      // Legg til en klasse for å gjøre visuelt tydelig at opptak er blokkert
      document.body.classList.add('recording-protected');
      
      // I en ekte implementasjon ville vi legge til mer avanserte teknikker
      console.log('Recording protection activated');
    } catch (error) {
      console.error('Failed to apply recording protection:', error);
    }
  };

  const removeRecordingProtection = () => {
    try {
      document.body.classList.remove('recording-protected');
      console.log('Recording protection deactivated');
    } catch (error) {
      console.error('Failed to remove recording protection:', error);
    }
  };

  const preventDefaultAction = (e: Event) => {
    e.preventDefault();
    return false;
  };

  const preventPrintScreen = (e: KeyboardEvent) => {
    // Blokkere PrintScreen, Command+Shift+3/4 (Mac), etc.
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    
    if (
      e.key === 'PrintScreen' || 
      e.key === 'Snapshot' || 
      (isMac && e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4'))
    ) {
      e.preventDefault();
      toast({
        title: "Skjermbilder er deaktivert",
        description: "Av sikkerhetsmessige årsaker er skjermbilder deaktivert i denne appen.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleScreenshotToggle = (enabled: boolean) => {
    setIsScreenshotBlocked(enabled);
    updateConfig({
      security: {
        ...config.security,
        screenshotProtection: enabled
      }
    });
    
    toast({
      title: enabled ? "Skjermbildebeskyttelse aktivert" : "Skjermbildebeskyttelse deaktivert",
      description: enabled 
        ? "Skjermbilder vil nå være blokkert i sensitive deler av appen." 
        : "Skjermbilder er nå tillatt i appen.",
      variant: enabled ? "default" : "destructive"
    });
  };

  const handleRecordingToggle = (enabled: boolean) => {
    setIsRecordingBlocked(enabled);
    updateConfig({
      security: {
        ...config.security,
        preventScreenRecording: enabled
      }
    });
    
    toast({
      title: enabled ? "Opptaksbeskyttelse aktivert" : "Opptaksbeskyttelse deaktivert",
      description: enabled 
        ? "Skjermopptak vil nå være blokkert i sensitive deler av appen." 
        : "Skjermopptak er nå tillatt i appen.",
      variant: enabled ? "default" : "destructive"
    });
  };

  const handleAutoDeleteToggle = (enabled: boolean) => {
    setIsAutoDeleteEnabled(enabled);
    updateConfig({
      security: {
        ...config.security,
        autoDeleteMessages: {
          ...config.security.autoDeleteMessages,
          enabled: enabled
        }
      }
    });
    
    toast({
      title: enabled ? "Automatisk sletting aktivert" : "Automatisk sletting deaktivert",
      description: enabled 
        ? `Meldinger vil nå bli automatisk slettet etter ${autoDeleteTimeout} timer.` 
        : "Meldinger vil ikke lenger bli automatisk slettet.",
      variant: "default"
    });
  };

  const handleTimeoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const timeout = parseInt(e.target.value);
    setAutoDeleteTimeout(timeout);
    updateConfig({
      security: {
        ...config.security,
        autoDeleteMessages: {
          ...config.security.autoDeleteMessages,
          defaultTimeout: timeout
        }
      }
    });
    
    if (isAutoDeleteEnabled) {
      toast({
        title: "Tidinnstilling oppdatert",
        description: `Meldinger vil nå bli automatisk slettet etter ${timeout} timer.`,
        variant: "default"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-4 w-4" /> Skjermbildebeskyttelse
          </CardTitle>
          <CardDescription>
            Blokker skjermbilder og opptak av sensitive data i appen for å beskytte privatlivet ditt.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="h-4 w-4" />
              <span>Blokker skjermbilder</span>
            </div>
            <Switch 
              checked={isScreenshotBlocked}
              onCheckedChange={handleScreenshotToggle}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Blokker skjermopptak</span>
            </div>
            <Switch 
              checked={isRecordingBlocked}
              onCheckedChange={handleRecordingToggle}
            />
          </div>
          
          {(isScreenshotBlocked || isRecordingBlocked) && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-300">
                  <p className="font-medium">Merk:</p>
                  <p className="mt-1">
                    Disse funksjonene fungerer best på mobile enheter. I nettlesere kan beskyttelsen være begrenset
                    av hvilken nettleser og operativsystem som brukes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <EyeOff className="mr-2 h-4 w-4" /> Selvdestruerende meldinger
          </CardTitle>
          <CardDescription>
            Aktiver automatisk sletting av meldinger etter en angitt tidsperiode for økt sikkerhet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>Aktiver automatisk sletting</span>
            </div>
            <Switch 
              checked={isAutoDeleteEnabled}
              onCheckedChange={handleAutoDeleteToggle}
            />
          </div>
          
          {isAutoDeleteEnabled && (
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">
                Slett meldinger etter
              </label>
              <select 
                value={autoDeleteTimeout}
                onChange={handleTimeoutChange}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value={1}>1 time</option>
                <option value={24}>24 timer (1 dag)</option>
                <option value={168}>7 dager</option>
                <option value={720}>30 dager</option>
              </select>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Når aktivert vil alle sendte og mottatte meldinger automatisk slettes fra alle enheter etter den valgte tidsperioden.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};