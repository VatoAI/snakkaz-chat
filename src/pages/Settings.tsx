import React, { useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ShieldCheck,
  Bell,
  Palette,
  Moon,
  Sun,
  Monitor,
  LockKeyhole,
  Key,
  Smartphone,
  MessageSquare,
  Globe,
  FileText
} from 'lucide-react';

const SettingCard: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => {
  return (
    <Card className="bg-cyberdark-900 border-cyberdark-700 mb-4">
      <CardHeader>
        <CardTitle className="text-lg text-cybergold-400">{title}</CardTitle>
        <CardDescription className="text-cybergold-600">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

const ToggleSetting: React.FC<{
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}> = ({ title, description, checked, onCheckedChange }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h4 className="text-base font-medium text-cybergold-300">{title}</h4>
        <p className="text-sm text-cybergold-500">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-cybergold-600"
      />
    </div>
  );
};

const Settings: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  // Håndterer generelle innstillinger
  const [language, setLanguage] = useState("nb-NO");
  const [theme, setTheme] = useState("dark");
  const [fontScale, setFontScale] = useState("medium");
  const [animations, setAnimations] = useState(true);
  
  // Sikkerhetsinnstillinger
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [autoLockEnabled, setAutoLockEnabled] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(false);
  
  // Personverninnstillinger
  const [readReceipts, setReadReceipts] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [linkPreview, setLinkPreview] = useState(true);
  
  // Varslingsinnstillinger
  const [pushNotifications, setPushNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [groupNotifications, setGroupNotifications] = useState(true);
  const [callNotifications, setCallNotifications] = useState(true);
  
  // Varslingslyder
  const [notificationSound, setNotificationSound] = useState("default");
  const [messageSound, setMessageSound] = useState("default");

  // Håndter lagring av innstillinger
  const saveSettings = () => {
    toast({
      title: "Innstillinger lagret",
      description: "Dine innstillinger har blitt oppdatert.",
    });
  };

  // Håndter aktivering av 2FA
  const enable2FA = () => {
    toast({
      title: "2FA er under utvikling",
      description: "To-faktorautentisering vil være tilgjengelig snart.",
    });
  };

  // Håndter tilbakestilling av passord
  const resetPassword = async () => {
    try {
      // I en ekte implementasjon vil vi kalle Supabase her
      toast({
        title: "E-post sendt",
        description: "Følg instruksjonene i e-posten for å tilbakestille passordet.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Feil",
        description: "Kunne ikke sende e-post for tilbakestilling.",
      });
    }
  };

  return (
    <div className="container max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-cybergold-300">Innstillinger</h1>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 bg-cyberdark-800 mb-6">
          <TabsTrigger value="general" className="data-[state=active]:bg-cyberdark-700">
            <Palette className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Generelt</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-cyberdark-700">
            <ShieldCheck className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Sikkerhet</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-cyberdark-700">
            <LockKeyhole className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Personvern</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-cyberdark-700">
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Varsler</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="data-[state=active]:bg-cyberdark-700">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Om</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <SettingCard 
            title="Visning" 
            description="Tilpass utseende og opplevelse"
          >
            <div className="space-y-6">
              <div className="flex flex-col space-y-2">
                <Label className="text-cybergold-300">Tema</Label>
                <div className="flex space-x-4 mt-2">
                  <Button 
                    variant={theme === "dark" ? "default" : "outline"} 
                    onClick={() => setTheme("dark")}
                    className={theme === "dark" ? "bg-cybergold-600 text-black" : "border-cyberdark-700"}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Mørkt
                  </Button>
                  <Button 
                    variant={theme === "light" ? "default" : "outline"} 
                    onClick={() => setTheme("light")}
                    className={theme === "light" ? "bg-cybergold-600 text-black" : "border-cyberdark-700"}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Lyst
                  </Button>
                  <Button 
                    variant={theme === "system" ? "default" : "outline"} 
                    onClick={() => setTheme("system")}
                    className={theme === "system" ? "bg-cybergold-600 text-black" : "border-cyberdark-700"}
                  >
                    <Monitor className="h-4 w-4 mr-2" />
                    System
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label className="text-cybergold-300">Tekststørrelse</Label>
                <Select value={fontScale} onValueChange={setFontScale}>
                  <SelectTrigger className="bg-cyberdark-800 border-cyberdark-700 w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cyberdark-800 border-cyberdark-700">
                    <SelectItem value="small">Liten</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Stor</SelectItem>
                    <SelectItem value="xl">Ekstra stor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label className="text-cybergold-300">Språk</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-cyberdark-800 border-cyberdark-700 w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cyberdark-800 border-cyberdark-700">
                    <SelectItem value="nb-NO">Norsk (Bokmål)</SelectItem>
                    <SelectItem value="nn-NO">Norsk (Nynorsk)</SelectItem>
                    <SelectItem value="en-US">Engelsk</SelectItem>
                    <SelectItem value="sv-SE">Svensk</SelectItem>
                    <SelectItem value="da-DK">Dansk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <ToggleSetting
                title="Animasjoner"
                description="Aktivér animasjonseffekter i appen"
                checked={animations}
                onCheckedChange={setAnimations}
              />
            </div>
          </SettingCard>
          
          <div className="mt-6">
            <Button 
              onClick={saveSettings}
              className="bg-cybergold-600 text-black hover:bg-cybergold-500"
            >
              Lagre innstillinger
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <SettingCard 
            title="Kontosikkerhet" 
            description="Administrer logg inn og autentisering"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium text-cybergold-300">To-faktorautentisering</h4>
                  <p className="text-sm text-cybergold-500">Legg til et ekstra lag med sikkerhet til kontoen din</p>
                </div>
                <Button 
                  variant={twoFactorEnabled ? "destructive" : "outline"}
                  onClick={twoFactorEnabled ? () => setTwoFactorEnabled(false) : enable2FA}
                  className={!twoFactorEnabled ? "border-cybergold-600 text-cybergold-300" : ""}
                >
                  {twoFactorEnabled ? "Deaktiver" : "Aktiver"} 2FA
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium text-cybergold-300">Tilbakestill passord</h4>
                  <p className="text-sm text-cybergold-500">Send en e-post for å tilbakestille passordet ditt</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={resetPassword}
                  className="border-cybergold-600 text-cybergold-300"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Tilbakestill
                </Button>
              </div>
              
              <ToggleSetting
                title="Applikasjonslås"
                description="Automatisk lås appen når den er inaktiv"
                checked={autoLockEnabled}
                onCheckedChange={setAutoLockEnabled}
              />
              
              <ToggleSetting
                title="PIN-kode"
                description="Krev PIN-kode for å få tilgang til appen"
                checked={pinEnabled}
                onCheckedChange={setPinEnabled}
              />
            </div>
          </SettingCard>
          
          <SettingCard 
            title="Økter" 
            description="Administrer dine aktive økter"
          >
            <div className="bg-cyberdark-800 p-4 rounded-md mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-base font-medium text-cybergold-300">Denne enheten</h4>
                  <p className="text-xs text-cybergold-500">Aktiv nå</p>
                </div>
                <div className="flex items-center">
                  <Smartphone className="h-4 w-4 text-cybergold-500 mr-2" />
                  <span className="text-cybergold-400">Gjeldende økt</span>
                </div>
              </div>
            </div>
            
            <Button 
              variant="destructive"
              onClick={() => signOut()}
              className="w-full"
            >
              Logg ut av alle enheter
            </Button>
          </SettingCard>
        </TabsContent>
        
        <TabsContent value="privacy">
          <SettingCard 
            title="Meldingspersonvern" 
            description="Kontroller hvordan andre ser din meldingsaktivitet"
          >
            <div className="space-y-6">
              <ToggleSetting
                title="Lesebekreftelser"
                description="La andre se når du har lest meldingene deres"
                checked={readReceipts}
                onCheckedChange={setReadReceipts}
              />
              
              <ToggleSetting
                title="Online-status"
                description="Vis når du er aktiv til andre brukere"
                checked={onlineStatus}
                onCheckedChange={setOnlineStatus}
              />
              
              <ToggleSetting
                title="Link-forhåndsvisning"
                description="Vis forhåndsvisninger av delte lenker i meldinger"
                checked={linkPreview}
                onCheckedChange={setLinkPreview}
              />
            </div>
          </SettingCard>
          
          <SettingCard 
            title="Datalagring" 
            description="Administrer hvordan data lagres og brukes"
          >
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full border-cybergold-600 text-cybergold-300"
              >
                Last ned mine data
              </Button>
              <Button 
                variant="destructive"
                className="w-full"
              >
                Slett konto og data
              </Button>
            </div>
          </SettingCard>
        </TabsContent>
        
        <TabsContent value="notifications">
          <SettingCard 
            title="Varslingsinnstillinger" 
            description="Administrer hvordan du mottar varsler"
          >
            <div className="space-y-6">
              <ToggleSetting
                title="Push-varsler"
                description="Motta push-varsler på denne enheten"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
              
              <ToggleSetting
                title="Meldingsvarsler"
                description="Få varsler når du mottar nye meldinger"
                checked={messageNotifications}
                onCheckedChange={setMessageNotifications}
              />
              
              <ToggleSetting
                title="Gruppevarsler"
                description="Få varsler fra gruppesamtaler"
                checked={groupNotifications}
                onCheckedChange={setGroupNotifications}
              />
              
              <ToggleSetting
                title="Anropsvarsler"
                description="Få varsler om innkommende anrop"
                checked={callNotifications}
                onCheckedChange={setCallNotifications}
              />
            </div>
          </SettingCard>
          
          <SettingCard 
            title="Lyder" 
            description="Administrer varslingslyder"
          >
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label className="text-cybergold-300">Varslingslyd</Label>
                <Select value={notificationSound} onValueChange={setNotificationSound}>
                  <SelectTrigger className="bg-cyberdark-800 border-cyberdark-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cyberdark-800 border-cyberdark-700">
                    <SelectItem value="default">Standard</SelectItem>
                    <SelectItem value="subtle">Subtil</SelectItem>
                    <SelectItem value="cyber">Cyber</SelectItem>
                    <SelectItem value="retro">Retro</SelectItem>
                    <SelectItem value="none">Ingen lyd</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label className="text-cybergold-300">Meldingslyd</Label>
                <Select value={messageSound} onValueChange={setMessageSound}>
                  <SelectTrigger className="bg-cyberdark-800 border-cyberdark-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cyberdark-800 border-cyberdark-700">
                    <SelectItem value="default">Standard</SelectItem>
                    <SelectItem value="subtle">Subtil</SelectItem>
                    <SelectItem value="cyber">Cyber</SelectItem>
                    <SelectItem value="retro">Retro</SelectItem>
                    <SelectItem value="none">Ingen lyd</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SettingCard>
        </TabsContent>
        
        <TabsContent value="about">
          <SettingCard 
            title="Om Snakkaz Chat" 
            description="Programvareinformasjon"
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-medium text-cybergold-300">Versjon</h4>
                <p className="text-cybergold-500">1.0.0</p>
              </div>
              
              <div>
                <h4 className="text-base font-medium text-cybergold-300">Utviklet av</h4>
                <p className="text-cybergold-500">Snakkaz Team</p>
              </div>
              
              <div className="pt-4 space-y-2">
                <Button 
                  variant="outline" 
                  className="border-cybergold-600 text-cybergold-300 w-full"
                  onClick={() => window.open('https://github.com/snakkaz', '_blank')}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Besøk nettsiden vår
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-cybergold-600 text-cybergold-300 w-full"
                  onClick={() => window.open('https://snakkaz.com/support', '_blank')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Kundesupport
                </Button>
              </div>
            </div>
          </SettingCard>
          
          <SettingCard 
            title="Juridisk" 
            description="Juridisk informasjon"
          >
            <div className="space-y-4">
              <Button 
                variant="ghost" 
                className="w-full text-left justify-start"
                onClick={() => window.open('/terms', '_blank')}
              >
                Vilkår for bruk
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full text-left justify-start"
                onClick={() => window.open('/privacy', '_blank')}
              >
                Personvernerklæring
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full text-left justify-start"
                onClick={() => window.open('/cookies', '_blank')}
              >
                Cookie-policy
              </Button>
            </div>
          </SettingCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;