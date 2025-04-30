import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useBusiness } from '@/hooks/useBusiness';
import { BusinessConfig, BusinessHours, BusinessLocation } from '@/config/business-config';
import { Clock, MapPin, MessageSquare, Bot, Inbox } from 'lucide-react';
import { TimeInput } from '@/components/ui/time-input';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BusinessSettingsProps {
  userId: string;
}

/**
 * Komponent for å administrere business-innstillinger
 */
export const BusinessSettings: React.FC<BusinessSettingsProps> = ({ userId }) => {
  const { businessConfig, isLoading, isSaving, saveBusinessConfig } = useBusiness(userId);
  const [tab, setTab] = useState('general');
  const [tempConfig, setTempConfig] = useState<Partial<BusinessConfig>>(businessConfig || {});
  
  const updateConfig = (path: string, value: any) => {
    setTempConfig(prev => {
      // Håndter nøstede paths som "welcomeMessage.enabled"
      const parts = path.split('.');
      if (parts.length > 1) {
        const [parent, child] = parts;
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof typeof prev],
            [child]: value
          }
        };
      }
      
      return {
        ...prev,
        [path]: value
      };
    });
  };
  
  const handleSave = async () => {
    try {
      await saveBusinessConfig(tempConfig);
      toast({
        title: "Endringer lagret",
        description: "Business-innstillingene dine er oppdatert",
      });
    } catch (error) {
      console.error('Feil ved lagring av business-innstillinger:', error);
      toast({
        title: "Feil ved lagring",
        description: "Det oppstod en feil ved lagring av innstillingene",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Snakkaz Business</h1>
        <p className="text-muted-foreground">
          Aktiver og konfigurer business-funksjoner for din konto
        </p>
      </div>
      
      <div className="flex items-center space-x-2 mb-6">
        <Switch
          checked={tempConfig.enabled || false}
          onCheckedChange={(checked) => updateConfig('enabled', checked)}
          id="business-mode"
        />
        <Label htmlFor="business-mode">
          {tempConfig.enabled ? 'Business-modus aktivert' : 'Business-modus deaktivert'}
        </Label>
      </div>
      
      {!tempConfig.enabled && (
        <Alert className="mb-6">
          <AlertDescription>
            Aktiver business-modus for å få tilgang til funksjoner som åpningstider,
            automatiske svar, hurtigsvar og mer.
          </AlertDescription>
        </Alert>
      )}
      
      {tempConfig.enabled && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Grunnleggende informasjon</CardTitle>
              <CardDescription>
                Legg til grunnleggende informasjon om virksomheten din
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="business-name">Virksomhetsnavn</Label>
                <Input
                  id="business-name"
                  value={tempConfig.businessName || ''}
                  onChange={(e) => updateConfig('businessName', e.target.value)}
                  placeholder="F.eks. 'Navn AS' eller 'Min Bedrift'"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="business-description">Beskrivelse</Label>
                <Textarea
                  id="business-description"
                  value={tempConfig.description || ''}
                  onChange={(e) => updateConfig('description', e.target.value)}
                  placeholder="Kort beskrivelse av din virksomhet"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="business-logo">Logo URL</Label>
                <Input
                  id="business-logo"
                  value={tempConfig.logoUrl || ''}
                  onChange={(e) => updateConfig('logoUrl', e.target.value)}
                  placeholder="URL til virksomhetens logo"
                />
              </div>
            </CardContent>
          </Card>
          
          <Tabs value={tab} onValueChange={setTab} className="w-full mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="hours">
                <Clock className="h-4 w-4 mr-2" /> Åpningstider
              </TabsTrigger>
              <TabsTrigger value="location">
                <MapPin className="h-4 w-4 mr-2" /> Lokasjon
              </TabsTrigger>
              <TabsTrigger value="messages">
                <MessageSquare className="h-4 w-4 mr-2" /> Automatiske meldinger
              </TabsTrigger>
              <TabsTrigger value="quick-replies">
                <Inbox className="h-4 w-4 mr-2" /> Hurtigsvar
              </TabsTrigger>
              <TabsTrigger value="chatbot">
                <Bot className="h-4 w-4 mr-2" /> Chatbot
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="hours" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Åpningstider</CardTitle>
                  <CardDescription>
                    Angi når virksomheten din er åpen for å hjelpe kunder med å vite når de kan forvente svar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                    <div key={day} className="flex items-center space-x-4">
                      <div className="w-28">
                        <Label>{day.charAt(0).toUpperCase() + day.slice(1)}</Label>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Switch
                          checked={
                            tempConfig.businessHours?.[day as keyof BusinessHours] !== 'closed'
                          }
                          onCheckedChange={(checked) =>
                            updateConfig(`businessHours.${day}`, checked ? { open: '09:00', close: '17:00' } : 'closed')
                          }
                          id={`${day}-open`}
                        />
                        
                        {tempConfig.businessHours?.[day as keyof BusinessHours] !== 'closed' && (
                          <>
                            <div className="flex items-center space-x-2">
                              <TimeInput
                                value={
                                  typeof tempConfig.businessHours?.[day as keyof BusinessHours] === 'object'
                                    ? (tempConfig.businessHours?.[day as keyof BusinessHours] as any)?.open || '09:00'
                                    : '09:00'
                                }
                                onChange={(value) => {
                                  const current = tempConfig.businessHours?.[day as keyof BusinessHours];
                                  if (typeof current === 'object') {
                                    updateConfig(`businessHours.${day}`, { 
                                      ...current, 
                                      open: value 
                                    });
                                  }
                                }}
                              />
                              <span>-</span>
                              <TimeInput
                                value={
                                  typeof tempConfig.businessHours?.[day as keyof BusinessHours] === 'object'
                                    ? (tempConfig.businessHours?.[day as keyof BusinessHours] as any)?.close || '17:00'
                                    : '17:00'
                                }
                                onChange={(value) => {
                                  const current = tempConfig.businessHours?.[day as keyof BusinessHours];
                                  if (typeof current === 'object') {
                                    updateConfig(`businessHours.${day}`, { 
                                      ...current, 
                                      close: value 
                                    });
                                  }
                                }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="location" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lokasjon</CardTitle>
                  <CardDescription>
                    Legg til virksomhetens fysiske adresse og plassering på kartet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={tempConfig.location?.address || ''}
                      onChange={(e) => updateConfig('location', {
                        ...tempConfig.location,
                        address: e.target.value
                      })}
                      placeholder="Gateadresse"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="city">By</Label>
                      <Input
                        id="city"
                        value={tempConfig.location?.city || ''}
                        onChange={(e) => updateConfig('location', {
                          ...tempConfig.location,
                          city: e.target.value
                        })}
                        placeholder="By"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="postal-code">Postnummer</Label>
                      <Input
                        id="postal-code"
                        value={tempConfig.location?.postalCode || ''}
                        onChange={(e) => updateConfig('location', {
                          ...tempConfig.location,
                          postalCode: e.target.value
                        })}
                        placeholder="Postnummer"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="country">Land</Label>
                    <Input
                      id="country"
                      value={tempConfig.location?.country || ''}
                      onChange={(e) => updateConfig('location', {
                        ...tempConfig.location,
                        country: e.target.value
                      })}
                      placeholder="Land"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="latitude">Breddegrad</Label>
                      <Input
                        id="latitude"
                        type="number"
                        value={tempConfig.location?.latitude || ''}
                        onChange={(e) => updateConfig('location', {
                          ...tempConfig.location,
                          latitude: parseFloat(e.target.value)
                        })}
                        placeholder="F.eks. 59.9139"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="longitude">Lengdegrad</Label>
                      <Input
                        id="longitude"
                        type="number"
                        value={tempConfig.location?.longitude || ''}
                        onChange={(e) => updateConfig('location', {
                          ...tempConfig.location,
                          longitude: parseFloat(e.target.value)
                        })}
                        placeholder="F.eks. 10.7522"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="messages" className="space-y-4">
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Velkomstmelding</CardTitle>
                  <CardDescription>
                    Automatisk melding som sendes til nye kontakter
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={tempConfig.welcomeMessage?.enabled || false}
                      onCheckedChange={(checked) => updateConfig('welcomeMessage.enabled', checked)}
                      id="welcome-message-enabled"
                    />
                    <Label htmlFor="welcome-message-enabled">Aktiver velkomstmelding</Label>
                  </div>
                  
                  {tempConfig.welcomeMessage?.enabled && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="welcome-message">Melding</Label>
                        <Textarea
                          id="welcome-message"
                          value={tempConfig.welcomeMessage?.message || ''}
                          onChange={(e) => updateConfig('welcomeMessage.message', e.target.value)}
                          placeholder="F.eks. 'Hei! Takk for at du kontakter oss.'"
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="welcome-repeat">Gjenta etter (dager)</Label>
                        <Input
                          id="welcome-repeat"
                          type="number"
                          value={tempConfig.welcomeMessage?.repeatPeriod || 30}
                          onChange={(e) => updateConfig('welcomeMessage.repeatPeriod', parseInt(e.target.value))}
                          placeholder="Antall dager før samme bruker får velkomstmeldingen på nytt"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Fraværsmelding</CardTitle>
                  <CardDescription>
                    Automatisk melding som sendes når du er utilgjengelig eller virksomheten er stengt
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={tempConfig.awayMessage?.enabled || false}
                      onCheckedChange={(checked) => updateConfig('awayMessage.enabled', checked)}
                      id="away-message-enabled"
                    />
                    <Label htmlFor="away-message-enabled">Aktiver fraværsmelding</Label>
                  </div>
                  
                  {tempConfig.awayMessage?.enabled && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="away-message">Melding</Label>
                        <Textarea
                          id="away-message"
                          value={tempConfig.awayMessage?.message || ''}
                          onChange={(e) => updateConfig('awayMessage.message', e.target.value)}
                          placeholder="F.eks. 'Vi er nå stengt, men svarer deg så snart som mulig.'"
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={tempConfig.awayMessage?.useBusinessHours || false}
                          onCheckedChange={(checked) => updateConfig('awayMessage.useBusinessHours', checked)}
                          id="use-business-hours"
                        />
                        <Label htmlFor="use-business-hours">Bruk åpningstider</Label>
                      </div>
                      
                      {!tempConfig.awayMessage?.useBusinessHours && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="away-start">Fraværsperiode start</Label>
                            <Input
                              id="away-start"
                              type="date"
                              value={tempConfig.awayMessage?.startDate || ''}
                              onChange={(e) => updateConfig('awayMessage.startDate', e.target.value)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="away-end">Fraværsperiode slutt</Label>
                            <Input
                              id="away-end"
                              type="date"
                              value={tempConfig.awayMessage?.endDate || ''}
                              onChange={(e) => updateConfig('awayMessage.endDate', e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="quick-replies" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hurtigsvar</CardTitle>
                  <CardDescription>
                    Forhåndsdefinerte svar for vanlige spørsmål eller informasjon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tempConfig.quickReplies?.length ? (
                    <div className="space-y-2">
                      {tempConfig.quickReplies.map((reply, index) => (
                        <div key={reply.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="truncate">
                            <h4 className="font-medium">{reply.name}</h4>
                            <p className="text-sm text-muted-foreground truncate">
                              {reply.content.substring(0, 50)}
                              {reply.content.length > 50 ? '...' : ''}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              const updatedReplies = [...tempConfig.quickReplies!];
                              updatedReplies.splice(index, 1);
                              updateConfig('quickReplies', updatedReplies);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Ingen hurtigsvar lagt til ennå. Legg til ditt første hurtigsvar.
                    </p>
                  )}
                  
                  <Button
                    className="w-full mt-4"
                    variant="outline"
                    onClick={() => {
                      const newReply = {
                        id: `qr_${Date.now()}`,
                        name: 'Nytt hurtigsvar',
                        content: 'Skriv ditt hurtigsvar her'
                      };
                      
                      updateConfig('quickReplies', [
                        ...(tempConfig.quickReplies || []),
                        newReply
                      ]);
                    }}
                  >
                    Legg til hurtigsvar
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="chatbot" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Chatbot-innstillinger</CardTitle>
                  <CardDescription>
                    Koble til en chatbot for å automatisk svare på meldinger
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={tempConfig.chatbotEnabled || false}
                      onCheckedChange={(checked) => updateConfig('chatbotEnabled', checked)}
                      id="chatbot-enabled"
                    />
                    <Label htmlFor="chatbot-enabled">Aktiver chatbot</Label>
                  </div>
                  
                  {tempConfig.chatbotEnabled && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="bot-id">Bot ID</Label>
                        <Input
                          id="bot-id"
                          value={tempConfig.chatbotConfig?.botId || ''}
                          onChange={(e) => updateConfig('chatbotConfig', {
                            ...tempConfig.chatbotConfig,
                            botId: e.target.value
                          })}
                          placeholder="ID for din chatbot"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Tillat chatbot i</Label>
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="allow-all"
                              checked={tempConfig.chatbotConfig?.allowedChats === 'all'}
                              onChange={() => updateConfig('chatbotConfig', {
                                ...tempConfig.chatbotConfig,
                                allowedChats: 'all'
                              })}
                            />
                            <Label htmlFor="allow-all">Alle chatter</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="allow-new"
                              checked={tempConfig.chatbotConfig?.allowedChats === 'new'}
                              onChange={() => updateConfig('chatbotConfig', {
                                ...tempConfig.chatbotConfig,
                                allowedChats: 'new'
                              })}
                            />
                            <Label htmlFor="allow-new">Kun nye chatter</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="allow-specific"
                              checked={tempConfig.chatbotConfig?.allowedChats === 'specific'}
                              onChange={() => updateConfig('chatbotConfig', {
                                ...tempConfig.chatbotConfig,
                                allowedChats: 'specific'
                              })}
                            />
                            <Label htmlFor="allow-specific">Spesifiserte chatter</Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={tempConfig.chatbotConfig?.excludeContacts || false}
                          onCheckedChange={(checked) => updateConfig('chatbotConfig', {
                            ...tempConfig.chatbotConfig,
                            excludeContacts: checked
                          })}
                          id="exclude-contacts"
                        />
                        <Label htmlFor="exclude-contacts">Ekskluder kontakter</Label>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading || isSaving}>
              {isSaving ? 'Lagrer...' : 'Lagre innstillinger'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};