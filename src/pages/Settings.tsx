import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import MainNav from '@/components/navigation/MainNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  BellRing, 
  Shield, 
  Eye, 
  Info, 
  Moon, 
  Sun, 
  Monitor,
  Bell,
  Volume2,
  VolumeX,
  Mail,
  BellOff,
  Lock,
  Key,
  Smartphone,
  LogOut
} from 'lucide-react';

// Define types for settings object
interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  email: boolean;
  push: boolean;
}

interface PrivacySettings {
  profileVisibility: string;
  lastSeen: boolean;
  readReceipts: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
}

interface SettingsState {
  theme: string;
  language: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  security: SecuritySettings;
}

const Settings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  
  // Mock state for settings
  const [settings, setSettings] = useState<SettingsState>({
    theme: 'dark',
    language: 'no',
    notifications: {
      enabled: true,
      sound: true,
      email: false,
      push: true
    },
    privacy: {
      profileVisibility: 'all',
      lastSeen: true,
      readReceipts: true
    },
    security: {
      twoFactorAuth: false
    }
  });
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logget ut",
        description: "Du har blitt logget ut av Snakkaz Chat.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Feil ved utlogging",
        description: "Kunne ikke logge ut. Vennligst prøv igjen.",
      });
    }
  };
  
  const updateSetting = (category: keyof SettingsState, setting: string, value: string | boolean | number) => {
    setSettings(prev => {
      if (category === 'notifications' || category === 'privacy' || category === 'security') {
        return {
          ...prev,
          [category]: {
            ...prev[category],
            [setting]: value
          }
        };
      }
      return prev;
    });
    
    toast({
      title: "Innstilling oppdatert",
      description: `${setting} innstillingen har blitt oppdatert.`,
    });
  };
  
  const updateTheme = (theme: string) => {
    setSettings(prev => ({
      ...prev,
      theme
    }));
    
    toast({
      title: "Tema endret",
      description: `Tema er satt til ${theme === 'dark' ? 'mørkt' : theme === 'light' ? 'lyst' : 'system'}.`,
    });
  };
  
  const updateLanguage = (language: string) => {
    setSettings(prev => ({
      ...prev,
      language
    }));
    
    toast({
      title: "Språk endret",
      description: `Språk er satt til ${language === 'no' ? 'norsk' : 'engelsk'}.`,
    });
  };

  return (
    <div className="min-h-screen bg-cyberdark-950 text-cybergold-300 pb-16 md:pb-0 md:pt-16">
      <MainNav />
      <main className="container max-w-4xl py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-cybergold-400">Innstillinger</h1>
          <Badge variant="outline" className="border-cybergold-600 text-cybergold-400">
            {user?.email}
          </Badge>
        </div>
        
        <Card className="bg-cyberdark-900 border-cyberdark-700">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 bg-cyberdark-800">
              <TabsTrigger value="general" className="data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400">
                <SettingsIcon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Generelt</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400">
                <BellRing className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Varsler</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400">
                <Eye className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Personvern</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400">
                <Shield className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sikkerhet</span>
              </TabsTrigger>
              <TabsTrigger value="about" className="data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400">
                <Info className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Om</span>
              </TabsTrigger>
            </TabsList>
            
            {/* General Settings */}
            <TabsContent value="general" className="p-4 space-y-6">
              <div>
                <h2 className="text-lg font-medium text-cybergold-300 mb-4">Tema</h2>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className={`flex flex-col items-center justify-center h-24 ${
                      settings.theme === 'light' ? 'bg-cybergold-600/20 border-cybergold-500' : 'bg-cyberdark-800'
                    }`}
                    onClick={() => updateTheme('light')}
                  >
                    <Sun className="h-8 w-8 mb-2" />
                    <span>Lyst</span>
                  </Button>
                  <Button
                    variant="outline"
                    className={`flex flex-col items-center justify-center h-24 ${
                      settings.theme === 'dark' ? 'bg-cybergold-600/20 border-cybergold-500' : 'bg-cyberdark-800'
                    }`}
                    onClick={() => updateTheme('dark')}
                  >
                    <Moon className="h-8 w-8 mb-2" />
                    <span>Mørkt</span>
                  </Button>
                  <Button
                    variant="outline"
                    className={`flex flex-col items-center justify-center h-24 ${
                      settings.theme === 'system' ? 'bg-cybergold-600/20 border-cybergold-500' : 'bg-cyberdark-800'
                    }`}
                    onClick={() => updateTheme('system')}
                  >
                    <Monitor className="h-8 w-8 mb-2" />
                    <span>System</span>
                  </Button>
                </div>
              </div>
              
              <Separator className="bg-cyberdark-700" />
              
              <div>
                <h2 className="text-lg font-medium text-cybergold-300 mb-4">Språk</h2>
                <Select 
                  value={settings.language} 
                  onValueChange={updateLanguage}
                >
                  <SelectTrigger className="w-full sm:w-1/3 bg-cyberdark-800 border-cyberdark-700">
                    <SelectValue placeholder="Velg språk" />
                  </SelectTrigger>
                  <SelectContent className="bg-cyberdark-800 border-cyberdark-700">
                    <SelectItem value="no">Norsk</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator className="bg-cyberdark-700" />
              
              <div>
                <h2 className="text-lg font-medium text-cybergold-300 mb-4">Konto</h2>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="bg-cyberdark-800 border-cyberdark-700 w-full sm:w-auto"
                    onClick={() => toast({
                      title: "Eksporter data",
                      description: "Dataeksport er under utvikling."
                    })}
                  >
                    Eksporter data
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    className="w-full sm:w-auto"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logg ut
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Notifications */}
            <TabsContent value="notifications" className="p-4 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-cybergold-300">Varsler</h2>
                  <Switch 
                    id="notifications-toggle"
                    checked={settings.notifications.enabled}
                    onCheckedChange={(checked) => updateSetting('notifications', 'enabled', checked)}
                    className="data-[state=checked]:bg-cybergold-500"
                  />
                </div>
                
                <div className="space-y-4 ml-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-5 w-5 text-cybergold-500" />
                      <Label 
                        htmlFor="app-notifications"
                        className={settings.notifications.enabled ? "text-cybergold-300" : "text-cybergold-600"}
                      >
                        App-varsler
                      </Label>
                    </div>
                    <Switch 
                      id="app-notifications"
                      checked={settings.notifications.push && settings.notifications.enabled}
                      disabled={!settings.notifications.enabled}
                      onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                      className="data-[state=checked]:bg-cybergold-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Volume2 className="h-5 w-5 text-cybergold-500" />
                      <Label 
                        htmlFor="sound-notifications"
                        className={settings.notifications.enabled ? "text-cybergold-300" : "text-cybergold-600"}
                      >
                        Lydvarsler
                      </Label>
                    </div>
                    <Switch 
                      id="sound-notifications"
                      checked={settings.notifications.sound && settings.notifications.enabled}
                      disabled={!settings.notifications.enabled}
                      onCheckedChange={(checked) => updateSetting('notifications', 'sound', checked)}
                      className="data-[state=checked]:bg-cybergold-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-cybergold-500" />
                      <Label 
                        htmlFor="email-notifications"
                        className={settings.notifications.enabled ? "text-cybergold-300" : "text-cybergold-600"}
                      >
                        E-postvarsler
                      </Label>
                    </div>
                    <Switch 
                      id="email-notifications"
                      checked={settings.notifications.email && settings.notifications.enabled}
                      disabled={!settings.notifications.enabled}
                      onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                      className="data-[state=checked]:bg-cybergold-500"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Privacy */}
            <TabsContent value="privacy" className="p-4 space-y-6">
              <div>
                <h2 className="text-lg font-medium text-cybergold-300 mb-4">Profilsynlighet</h2>
                <Select
                  value={settings.privacy.profileVisibility}
                  onValueChange={(value) => updateSetting('privacy', 'profileVisibility', value)}
                >
                  <SelectTrigger className="w-full sm:w-1/2 bg-cyberdark-800 border-cyberdark-700">
                    <SelectValue placeholder="Velg hvem som kan se profilen din" />
                  </SelectTrigger>
                  <SelectContent className="bg-cyberdark-800 border-cyberdark-700">
                    <SelectItem value="all">Alle</SelectItem>
                    <SelectItem value="contacts">Bare kontakter</SelectItem>
                    <SelectItem value="none">Ingen (privat)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator className="bg-cyberdark-700" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label 
                      htmlFor="last-seen"
                      className="text-cybergold-300 block mb-1"
                    >
                      Vis sist sett
                    </Label>
                    <p className="text-cybergold-600 text-sm">
                      La andre se når du sist var aktiv
                    </p>
                  </div>
                  <Switch 
                    id="last-seen"
                    checked={settings.privacy.lastSeen}
                    onCheckedChange={(checked) => updateSetting('privacy', 'lastSeen', checked)}
                    className="data-[state=checked]:bg-cybergold-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label 
                      htmlFor="read-receipts"
                      className="text-cybergold-300 block mb-1"
                    >
                      Lesebekreftelser
                    </Label>
                    <p className="text-cybergold-600 text-sm">
                      La andre se når du har lest meldingene deres
                    </p>
                  </div>
                  <Switch 
                    id="read-receipts"
                    checked={settings.privacy.readReceipts}
                    onCheckedChange={(checked) => updateSetting('privacy', 'readReceipts', checked)}
                    className="data-[state=checked]:bg-cybergold-500"
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Security */}
            <TabsContent value="security" className="p-4 space-y-6">
              <div>
                <h2 className="text-lg font-medium text-cybergold-300 mb-4">Kontosikerhet</h2>
                <Button 
                  variant="outline" 
                  className="bg-cyberdark-800 border-cyberdark-700 mb-4"
                  onClick={() => toast({
                    title: "Endre passord",
                    description: "Funksjonen for å endre passord direkte er under utvikling."
                  })}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Endre passord
                </Button>
                
                <div className="flex items-center justify-between mt-6">
                  <div>
                    <Label 
                      htmlFor="two-factor-auth"
                      className="text-cybergold-300 block mb-1"
                    >
                      To-faktor autentisering
                    </Label>
                    <p className="text-cybergold-600 text-sm">
                      Legg til et ekstra sikkerhetslag for kontoen din
                    </p>
                  </div>
                  <Switch 
                    id="two-factor-auth"
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
                    className="data-[state=checked]:bg-cybergold-500"
                  />
                </div>
                
                {settings.security.twoFactorAuth && (
                  <div className="mt-4 bg-cyberdark-800 p-4 rounded-lg border border-cyberdark-700">
                    <h3 className="text-sm font-medium text-cybergold-400 mb-2">
                      Konfigurer to-faktor autentisering
                    </h3>
                    <p className="text-cybergold-600 text-sm mb-4">
                      For å fullføre oppsett, skann QR-koden med en autentiserings-app som Google Authenticator eller Authy.
                    </p>
                    <div className="bg-white p-4 rounded-md w-48 h-48 mx-auto mb-4 flex items-center justify-center">
                      <p className="text-black text-xs">QR-kode placeholder</p>
                    </div>
                    <div className="flex justify-center">
                      <Button className="bg-cybergold-600 text-black hover:bg-cybergold-500">
                        <Key className="h-4 w-4 mr-2" />
                        Fullfør oppsett
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="mt-6">
                  <h3 className="text-md font-medium text-cybergold-300 mb-3">
                    Innloggingsøkter
                  </h3>
                  <Card className="bg-cyberdark-800 border-cyberdark-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-10 w-10 text-cybergold-500" />
                          <div>
                            <p className="text-cybergold-300 font-medium">Denne enheten</p>
                            <p className="text-cybergold-600 text-xs">Sist aktiv: Nå</p>
                          </div>
                        </div>
                        <Badge className="bg-green-600/20 text-green-400 border-green-700">
                          Aktiv
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* About */}
            <TabsContent value="about" className="p-4 space-y-6">
              <div className="text-center mb-6">
                <img 
                  src="/logos/snakkaz-gold.svg" 
                  alt="Snakkaz Logo" 
                  className="h-20 w-auto mx-auto mb-3"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/logos/snakkaz-gold.png";
                  }}
                />
                <h2 className="text-2xl font-bold text-cybergold-400">Snakkaz Chat</h2>
                <p className="text-cybergold-600">Versjon 1.0.0</p>
              </div>
              
              <div className="space-y-4 max-w-2xl mx-auto">
                <p className="text-cybergold-300 text-center">
                  Snakkaz Chat er en sikker, ende-til-ende-kryptert meldingstjeneste som prioriterer brukerens personvern og datasikkerhet.
                </p>
                
                <Separator className="bg-cyberdark-700" />
                
                <div>
                  <h3 className="text-lg font-medium text-cybergold-300 mb-2">Kontakt</h3>
                  <p className="text-cybergold-500">
                    E-post: support@snakkaz.no<br />
                    Nettside: snakkaz.no
                  </p>
                </div>
                
                <Separator className="bg-cyberdark-700" />
                
                <div>
                  <h3 className="text-lg font-medium text-cybergold-300 mb-2">Juridisk</h3>
                  <div className="space-y-2">
                    <Button variant="link" className="text-cybergold-400 hover:text-cybergold-300 p-0 h-auto">
                      Personvernserklæring
                    </Button>
                    <br />
                    <Button variant="link" className="text-cybergold-400 hover:text-cybergold-300 p-0 h-auto">
                      Brukervilkår
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
};

export default Settings;