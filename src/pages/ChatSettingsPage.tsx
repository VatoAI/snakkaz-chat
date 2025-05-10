/**
 * Chat Settings Page
 * 
 * Page for configuring security and privacy settings for the chat
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { EncryptionService, SecurityLevel } from '../encryption/encryptionService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Loader2, Shield, Key, Lock, Eye, Bell, AlertTriangle } from 'lucide-react';
import { useToast } from '../../components/ui/use-toast';

const encryptionService = new EncryptionService();

interface UserSettings {
  defaultSecurityLevel: SecurityLevel;
  storeOfflineData: boolean;
  enableReadReceipts: boolean;
  enableLinkPreviews: boolean;
  enableTypingIndicators: boolean;
  screenshotNotifications: boolean;
  autoDeleteMessages: boolean;
  autoDeleteDays: number;
}

const ChatSettingsPage: React.FC = () => {
  // State
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    defaultSecurityLevel: SecurityLevel.E2EE,
    storeOfflineData: false,
    enableReadReceipts: true,
    enableLinkPreviews: true,
    enableTypingIndicators: true,
    screenshotNotifications: true,
    autoDeleteMessages: false,
    autoDeleteDays: 30
  });
  const [regeneratingKeys, setRegeneratingKeys] = useState(false);
  const [showKeysWarning, setShowKeysWarning] = useState(false);
  
  // Toast
  const { toast } = useToast();
  
  // Fetch user and settings
  useEffect(() => {
    const fetchUserAndSettings = async () => {
      try {
        // Get current user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        if (!userData.user) {
          window.location.href = '/login';
          return;
        }
        
        setUser(userData.user);
        
        // Get user settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', userData.user.id)
          .single();
          
        if (settingsError && settingsError.code !== 'PGRST116') {
          throw settingsError;
        }
        
        if (settingsData) {
          // Format settings data
          setSettings({
            defaultSecurityLevel: settingsData.default_security_level || SecurityLevel.E2EE,
            storeOfflineData: settingsData.store_offline_data || false,
            enableReadReceipts: settingsData.enable_read_receipts !== false,
            enableLinkPreviews: settingsData.enable_link_previews !== false,
            enableTypingIndicators: settingsData.enable_typing_indicators !== false,
            screenshotNotifications: settingsData.screenshot_notifications !== false,
            autoDeleteMessages: settingsData.auto_delete_messages || false,
            autoDeleteDays: settingsData.auto_delete_days || 30
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          title: 'Feil ved lasting av innstillinger',
          description: 'Kunne ikke laste brukerinnstillinger. Prøv igjen senere.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserAndSettings();
  }, [toast]);
  
  // Save settings
  const saveSettings = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      // Format settings for database
      const dbSettings = {
        user_id: user.id,
        default_security_level: settings.defaultSecurityLevel,
        store_offline_data: settings.storeOfflineData,
        enable_read_receipts: settings.enableReadReceipts,
        enable_link_previews: settings.enableLinkPreviews,
        enable_typing_indicators: settings.enableTypingIndicators,
        screenshot_notifications: settings.screenshotNotifications,
        auto_delete_messages: settings.autoDeleteMessages,
        auto_delete_days: settings.autoDeleteDays,
        updated_at: new Date().toISOString()
      };
      
      // Upsert settings
      const { error } = await supabase
        .from('user_settings')
        .upsert(dbSettings)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: 'Innstillinger lagret',
        description: 'Dine innstillinger har blitt lagret.'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Feil ved lagring av innstillinger',
        description: 'Kunne ikke lagre innstillinger. Prøv igjen senere.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Regenerate encryption keys
  const regenerateEncryptionKeys = async () => {
    if (!user) return;
    
    setRegeneratingKeys(true);
    
    try {
      // Generate new keys
      await encryptionService.regenerateEncryptionKeys();
      
      toast({
        title: 'Krypteringsnøkler regenerert',
        description: 'Dine krypteringsnøkler har blitt regenerert. Tidligere krypterte data må dekrypteres på nytt.'
      });
      
      // Hide warning
      setShowKeysWarning(false);
    } catch (error) {
      console.error('Error regenerating keys:', error);
      toast({
        title: 'Feil ved regenerering av nøkler',
        description: 'Kunne ikke regenerere krypteringsnøkler. Prøv igjen senere.',
        variant: 'destructive'
      });
    } finally {
      setRegeneratingKeys(false);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-cybergold-500" />
        <p className="mt-4 text-cybergold-300">Laster innstillinger...</p>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold text-cybergold-100 mb-8">Chat-innstillinger</h1>
      
      <Tabs defaultValue="security">
        <TabsList className="mb-8">
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Sikkerhet
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            Personvern
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Varsler
          </TabsTrigger>
        </TabsList>
        
        {/* Security Settings */}
        <TabsContent value="security">
          <div className="grid gap-6">
            <Card className="bg-cyberdark-900 border-cyberdark-800">
              <CardHeader>
                <CardTitle className="text-cybergold-100">Kryptering</CardTitle>
                <CardDescription>
                  Administrer krypteringsinnstillinger for dine meldinger
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="security-level">Standard sikkerhetsnivå</Label>
                  <Select 
                    value={settings.defaultSecurityLevel}
                    onValueChange={(value) => setSettings({...settings, defaultSecurityLevel: value as SecurityLevel})}
                  >
                    <SelectTrigger id="security-level" className="bg-cyberdark-800 border-cyberdark-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-cyberdark-800 border-cyberdark-700">
                      <SelectItem value={SecurityLevel.STANDARD}>Standard (Server-side kryptering)</SelectItem>
                      <SelectItem value={SecurityLevel.E2EE}>Ende-til-ende-kryptering</SelectItem>
                      <SelectItem value={SecurityLevel.P2P_E2EE}>Premium (P2P ende-til-ende-kryptering)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-cybergold-400">
                    Dette sikkerhetsnivået vil bli brukt som standard for nye samtaler.
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <Label htmlFor="offline-storage" className="text-base">Lagre data for offline bruk</Label>
                    <p className="text-xs text-cybergold-400">
                      Lagrer krypterte samtaler lokalt for tilgang uten internett
                    </p>
                  </div>
                  <Switch 
                    id="offline-storage"
                    checked={settings.storeOfflineData}
                    onCheckedChange={(checked) => setSettings({...settings, storeOfflineData: checked})}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-cyberdark-900 border-cyberdark-800">
              <CardHeader>
                <CardTitle className="text-cybergold-100 flex items-center">
                  <Key className="h-5 w-5 mr-2 text-cybergold-500" />
                  Krypteringsnøkler
                </CardTitle>
                <CardDescription>
                  Administrer dine personlige krypteringsnøkler
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {showKeysWarning ? (
                  <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-md">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="text-red-400 font-medium">Advarsel: Dette er en irreversibel handling</h4>
                        <p className="text-sm text-red-300 mt-1">
                          Regenerering av krypteringsnøkler vil slette alle eksisterende nøkler og erstatte dem med nye.
                          Du vil ikke lenger kunne dekryptere tidligere krypterte meldinger og filer. Fortsett kun hvis du er sikker.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => setShowKeysWarning(false)}
                        disabled={regeneratingKeys}
                      >
                        Avbryt
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={regenerateEncryptionKeys}
                        disabled={regeneratingKeys}
                      >
                        {regeneratingKeys ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Regenererer...
                          </>
                        ) : (
                          'Jeg forstår, regenerer nøkler'
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-cybergold-300">
                      Krypteringsnøklene dine brukes til å sikre dine meldinger og filer. 
                      Du kan regenerere nøklene hvis du mistenker at de har blitt kompromittert.
                    </p>
                    <Button 
                      variant="outline" 
                      className="border-cybergold-700"
                      onClick={() => setShowKeysWarning(true)}
                    >
                      Regenerer krypteringsnøkler
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <Card className="bg-cyberdark-900 border-cyberdark-800">
            <CardHeader>
              <CardTitle className="text-cybergold-100 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-cybergold-500" />
                Personvern
              </CardTitle>
              <CardDescription>
                Kontroller hvordan dine data og samtaleinformasjon håndteres
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="read-receipts" className="text-base">Lesebekreftelser</Label>
                  <p className="text-xs text-cybergold-400">
                    La andre se når du har lest meldinger
                  </p>
                </div>
                <Switch 
                  id="read-receipts"
                  checked={settings.enableReadReceipts}
                  onCheckedChange={(checked) => setSettings({...settings, enableReadReceipts: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="typing-indicators" className="text-base">Skriveindikatorer</Label>
                  <p className="text-xs text-cybergold-400">
                    Vis andre når du skriver en melding
                  </p>
                </div>
                <Switch 
                  id="typing-indicators"
                  checked={settings.enableTypingIndicators}
                  onCheckedChange={(checked) => setSettings({...settings, enableTypingIndicators: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="link-previews" className="text-base">Lenkeforhåndsvisning</Label>
                  <p className="text-xs text-cybergold-400">
                    Vis forhåndsvisninger av lenker i meldinger
                  </p>
                </div>
                <Switch 
                  id="link-previews"
                  checked={settings.enableLinkPreviews}
                  onCheckedChange={(checked) => setSettings({...settings, enableLinkPreviews: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="screenshot-notifications" className="text-base">Skjermbildevarsler</Label>
                  <p className="text-xs text-cybergold-400">
                    Varsle andre når du tar et skjermbilde av samtalen
                  </p>
                </div>
                <Switch 
                  id="screenshot-notifications"
                  checked={settings.screenshotNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, screenshotNotifications: checked})}
                />
              </div>
              
              <div className="pt-2 border-t border-cyberdark-700">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Label htmlFor="auto-delete" className="text-base">Automatisk sletting av meldinger</Label>
                    <p className="text-xs text-cybergold-400">
                      Slett meldinger automatisk etter et bestemt tidsrom
                    </p>
                  </div>
                  <Switch 
                    id="auto-delete"
                    checked={settings.autoDeleteMessages}
                    onCheckedChange={(checked) => setSettings({...settings, autoDeleteMessages: checked})}
                  />
                </div>
                
                {settings.autoDeleteMessages && (
                  <div className="mt-4">
                    <Label htmlFor="auto-delete-days">Slett meldinger etter</Label>
                    <Select 
                      value={settings.autoDeleteDays.toString()}
                      onValueChange={(value) => setSettings({...settings, autoDeleteDays: parseInt(value)})}
                    >
                      <SelectTrigger id="auto-delete-days" className="bg-cyberdark-800 border-cyberdark-700 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-cyberdark-800 border-cyberdark-700">
                        <SelectItem value="1">1 dag</SelectItem>
                        <SelectItem value="7">7 dager</SelectItem>
                        <SelectItem value="30">30 dager</SelectItem>
                        <SelectItem value="90">90 dager</SelectItem>
                        <SelectItem value="180">180 dager</SelectItem>
                        <SelectItem value="365">1 år</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="bg-cyberdark-900 border-cyberdark-800">
            <CardHeader>
              <CardTitle className="text-cybergold-100 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-cybergold-500" />
                Varsler
              </CardTitle>
              <CardDescription>
                Konfigurer varsler for nye meldinger og aktiviteter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-cybergold-300 mb-4">
                Varselsinnstillinger er tilgjengelige i systeminnstillingene for din enhet.
                For å endre hvordan du mottar varsler fra Snakkaz Chat, gå til enhetsinnstillingene.
              </p>
              
              <Button 
                variant="outline" 
                className="border-cybergold-700"
                onClick={() => {
                  if ('Notification' in window) {
                    Notification.requestPermission();
                  }
                }}
              >
                Kontroller varselstillatelser
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Save button */}
      <div className="mt-8 flex justify-end">
        <Button 
          onClick={saveSettings}
          disabled={isSaving}
          size="lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Lagrer innstillinger...
            </>
          ) : (
            'Lagre innstillinger'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatSettingsPage;
