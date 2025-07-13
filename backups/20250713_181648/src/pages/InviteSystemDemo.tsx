import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Users,
  Share2,
  UserPlus,
  Settings,
  Camera,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { EnhancedRegisterForm } from '@/components/auth/EnhancedRegisterForm';
import { EnhancedAvatarUpload } from '@/components/profile/EnhancedAvatarUpload';
import { GroupInviteSystem } from '@/components/chat/GroupInviteSystem';
import { SnakkaZInviteSystem } from '@/components/invite/SnakkaZInviteSystem';
import { cn } from '@/lib/utils';

const InviteSystemDemo: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [groupSettings, setGroupSettings] = useState({
    isPublic: false,
    requireApproval: true,
    allowInvites: true,
    hasPassword: false
  });

  const handleRegistrationSuccess = () => {
    console.log('Registration successful!');
  };

  const handleAvatarChange = (url: string) => {
    setAvatarUrl(url);
    console.log('Avatar changed:', url);
  };

  const handleGroupSettingsChange = (settings: any) => {
    setGroupSettings(settings);
    console.log('Group settings changed:', settings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyberdark-950 via-cyberdark-900 to-cyberdark-800">
      {/* Header */}
      <div className="border-b border-cybergold-500/20 bg-cyberdark-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-cybergold-400 hover:text-cybergold-300">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Tilbake
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-cybergold-400" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cybergold-400 to-cyberblue-400 bg-clip-text text-transparent">
                  SnakkaZ Invitasjonssystem
                </h1>
                <Badge variant="outline" className="border-cybergold-500/50 text-cybergold-400">
                  DEMO
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-cybergold-200 mb-4">
              Komplett invitasjon- og registreringssystem
            </h2>
            <p className="text-lg text-cybergold-400 max-w-3xl mx-auto">
              Test alle de nye funksjonene for brukerregistrering, avatar-opplasting, 
              gruppeinnvitasjoner og app-deling i SnakkaZ Beta.
            </p>
          </div>

          {/* Feature Tabs */}
          <Tabs defaultValue="register" className="space-y-8">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto bg-cyberdark-800 border border-cybergold-500/30">
              <TabsTrigger 
                value="register" 
                className="data-[state=active]:bg-cybergold-600 data-[state=active]:text-black"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Registrering
              </TabsTrigger>
              <TabsTrigger 
                value="avatar" 
                className="data-[state=active]:bg-cybergold-600 data-[state=active]:text-black"
              >
                <Camera className="h-4 w-4 mr-2" />
                Avatar
              </TabsTrigger>
              <TabsTrigger 
                value="group" 
                className="data-[state=active]:bg-cybergold-600 data-[state=active]:text-black"
              >
                <Users className="h-4 w-4 mr-2" />
                Grupper
              </TabsTrigger>
              <TabsTrigger 
                value="app" 
                className="data-[state=active]:bg-cybergold-600 data-[state=active]:text-black"
              >
                <Share2 className="h-4 w-4 mr-2" />
                App-deling
              </TabsTrigger>
            </TabsList>

            {/* Registration Demo */}
            <TabsContent value="register" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <Card className="bg-cyberdark-900 border-cybergold-500/30">
                    <CardHeader>
                      <CardTitle className="text-cybergold-400 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Forbedret registreringsform
                      </CardTitle>
                      <CardDescription className="text-cybergold-300">
                        Med real-time validering og intelligent forslag
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-cybergold-300">✨ Nye funksjoner:</h4>
                        <ul className="text-sm text-cybergold-400 space-y-1">
                          <li>• Real-time brukernavn- og e-postvalidering</li>
                          <li>• Automatiske forslag hvis navn/e-post er tatt</li>
                          <li>• Live passordstyrke-indikator</li>
                          <li>• Invitasjonskode-støtte</li>
                          <li>• Responsiv design med glassmorphism</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-cybergold-500/10 border border-cybergold-500/30 rounded-lg">
                        <p className="text-sm text-cybergold-300">
                          <strong>Test:</strong> Prøv å skrive inn et brukernavn eller e-post 
                          for å se real-time validering og forslag i aksjon!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <EnhancedRegisterForm
                      onSuccess={handleRegistrationSuccess}
                      inviteCode="BETA2025"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Avatar Demo */}
            <TabsContent value="avatar" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <Card className="bg-cyberdark-900 border-cybergold-500/30">
                    <CardHeader>
                      <CardTitle className="text-cybergold-400 flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Avansert avatar-opplasting
                      </CardTitle>
                      <CardDescription className="text-cybergold-300">
                        Drag-and-drop med automatisk komprimering
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-cybergold-300">🚀 Funksjoner:</h4>
                        <ul className="text-sm text-cybergold-400 space-y-1">
                          <li>• Drag-and-drop fileopplasting</li>
                          <li>• Live forhåndsvisning av bilde</li>
                          <li>• Automatisk bildekomprimering</li>
                          <li>• Progress bar med prosent</li>
                          <li>• Støtte for JPG, PNG, WebP, GIF</li>
                          <li>• Intelligent validering og feilhåndtering</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-cyberblue-500/10 border border-cyberblue-500/30 rounded-lg">
                        <p className="text-sm text-cybergold-300">
                          <strong>Test:</strong> Dra et bilde hit eller klikk for å velge fil. 
                          Se hvordan systemet håndterer komprimering og validering!
                        </p>
                      </div>

                      {avatarUrl && (
                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <p className="text-sm text-green-400">
                            ✅ Avatar lastet opp: {avatarUrl.slice(0, 50)}...
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-center">
                  <EnhancedAvatarUpload
                    onAvatarChange={handleAvatarChange}
                    className="w-full max-w-md"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Group Invite Demo */}
            <TabsContent value="group" className="space-y-6">
              <div className="space-y-6">
                <Card className="bg-cyberdark-900 border-cybergold-500/30">
                  <CardHeader>
                    <CardTitle className="text-cybergold-400 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Gruppeinnvitasjonssystem
                    </CardTitle>
                    <CardDescription className="text-cybergold-300">
                      Komplett system for å administrere og dele gruppeinnvitasjoner
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-cybergold-300">⚙️ Administratorfunksjoner:</h4>
                        <ul className="text-sm text-cybergold-400 space-y-1">
                          <li>• Gruppetilgangskontroll</li>
                          <li>• Passord-beskyttelse</li>
                          <li>• Godkjenningskrav</li>
                          <li>• Medlemsrettigheter</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-cybergold-300">🔗 Delingsfunksjoner:</h4>
                        <ul className="text-sm text-cybergold-400 space-y-1">
                          <li>• QR-kode generering</li>
                          <li>• Sosiale medier integrasjon</li>
                          <li>• Custom meldinger</li>
                          <li>• Lenke-utløp og bruksgrenser</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-cybergold-300">📱 Plattformer:</h4>
                        <ul className="text-sm text-cybergold-400 space-y-1">
                          <li>• WhatsApp</li>
                          <li>• Telegram</li>
                          <li>• Facebook, Twitter, LinkedIn</li>
                          <li>• E-post og SMS</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <GroupInviteSystem
                  groupId="demo-group-123"
                  groupName="SnakkaZ Beta Testgruppe"
                  groupDescription="Demonstrasjonsgruppe for invitasjonssystemet"
                  isAdmin={true}
                  currentSettings={groupSettings}
                  onSettingsChange={handleGroupSettingsChange}
                />
              </div>
            </TabsContent>

            {/* App Invite Demo */}
            <TabsContent value="app" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <Card className="bg-cyberdark-900 border-cybergold-500/30">
                    <CardHeader>
                      <CardTitle className="text-cybergold-400 flex items-center gap-2">
                        <Share2 className="h-5 w-5" />
                        App-invitasjonssystem
                      </CardTitle>
                      <CardDescription className="text-cybergold-300">
                        Inviter venner til hele SnakkaZ Beta-appen
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-cybergold-300">🎁 Referanse-program:</h4>
                        <ul className="text-sm text-cybergold-400 space-y-1">
                          <li>• Personlig referansekode</li>
                          <li>• Bonus-poeng for begge parter</li>
                          <li>• Statistikk over invitasjoner</li>
                          <li>• QR-kode for rask deling</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-cybergold-300">🚀 Markedsføring:</h4>
                        <ul className="text-sm text-cybergold-400 space-y-1">
                          <li>• Forhåndsdefinerte meldinger</li>
                          <li>• Tilpassbare invitasjonstekster</li>
                          <li>• Bred sosial medier-støtte</li>
                          <li>• Viralt potensial</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <p className="text-sm text-cybergold-300">
                          <strong>Vekststrategi:</strong> Dette systemet er designet for å 
                          gjøre det super enkelt å dele SnakkaZ og få organisk vekst gjennom 
                          word-of-mouth markedsføring.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Variants Demo */}
                  <Card className="bg-cyberdark-900 border-cybergold-500/30">
                    <CardHeader>
                      <CardTitle className="text-cybergold-400 text-lg">
                        Ulike visningstyper
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-cybergold-300 mb-2">Knapp-variant:</p>
                          <SnakkaZInviteSystem variant="button" showStats={false} />
                        </div>
                        
                        <div>
                          <p className="text-sm text-cybergold-300 mb-2">Flytende variant (demo):</p>
                          <div className="relative h-20 bg-cyberdark-800 rounded-lg border border-cybergold-500/20 overflow-hidden">
                            <div className="absolute bottom-4 right-4">
                              <Button
                                size="lg"
                                className="rounded-full h-12 w-12 bg-gradient-to-r from-cybergold-600 to-cyberblue-600 hover:from-cybergold-500 hover:to-cyberblue-500 text-white shadow-lg"
                              >
                                <Share2 className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-center">
                  <SnakkaZInviteSystem 
                    variant="card" 
                    showStats={true}
                    className="w-full max-w-md"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Implementation Status */}
          <div className="mt-16">
            <Card className="bg-gradient-to-br from-cyberdark-900 to-cyberdark-800 border-cybergold-500/30">
              <CardHeader>
                <CardTitle className="text-cybergold-400 text-center">
                  🎯 Implementeringsstatus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-medium text-green-400">Real-time validering</h3>
                    <p className="text-sm text-cybergold-500">Komplett implementert</p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-medium text-green-400">Avatar-system</h3>
                    <p className="text-sm text-cybergold-500">Drag-drop og komprimering</p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-medium text-green-400">Gruppe-invitasjoner</h3>
                    <p className="text-sm text-cybergold-500">QR-koder og sosial deling</p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-medium text-green-400">App-invitasjoner</h3>
                    <p className="text-sm text-cybergold-500">Referanse-program klar</p>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-cybergold-300 text-lg">
                    🚀 <strong>Alle systemer er implementert og klare for produksjon!</strong>
                  </p>
                  <p className="text-cybergold-500 text-sm mt-2">
                    SnakkaZ Beta har nå et komplett invitasjon- og delingssystem som gjør det 
                    enkelt for brukere å invitere venner og utvide nettverket sitt.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteSystemDemo;
