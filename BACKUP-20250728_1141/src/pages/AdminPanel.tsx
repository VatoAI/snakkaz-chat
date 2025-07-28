import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, Users, Settings, Database, Key, Lock, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Dette ville normalt være en sjekk mot en faktisk admin-rolle i databasen
  const isAdmin = user?.email?.endsWith('@snakkaz.no') || true; // For demo settes alle som admin

  if (!isAdmin) {
    return (
      <div className="container max-w-6xl mx-auto py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <ShieldCheck className="h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-cybergold-300 mb-2">Ingen tilgang</h1>
          <p className="text-cybergold-500 mb-6">
            Du har ikke tillatelse til å se denne siden. Kontakt en administrator hvis dette er feil.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-cybergold-300">Administrasjonspanel</h1>
          <p className="text-cybergold-500">
            Administrer brukere, grupper, sikkerhet og systeminnstillinger
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-red-400 border-red-900/30">
            <Activity className="h-4 w-4 mr-2" />
            System Status
          </Button>
          <Button className="bg-cybergold-600 text-black hover:bg-cybergold-700">
            <Settings className="h-4 w-4 mr-2" />
            Systeminnstillinger
          </Button>
        </div>
      </div>
      
      <Tabs 
        defaultValue="overview"
        className="space-y-4" 
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="bg-cyberdark-900 border-cyberdark-700 grid sm:grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="overview" className="data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-400">
            Oversikt
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-400">
            Brukere
          </TabsTrigger>
          <TabsTrigger value="groups" className="data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-400">
            Grupper
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-400">
            Sikkerhet
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-400">
            Logger
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-cyberdark-900 border-cybergold-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cybergold-300">
                  Totalt brukere
                </CardTitle>
                <Users className="h-4 w-4 text-cybergold-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cybergold-400">142</div>
                <p className="text-xs text-cybergold-600">+12% fra forrige måned</p>
              </CardContent>
            </Card>
            
            <Card className="bg-cyberdark-900 border-cybergold-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cybergold-300">
                  Aktive grupper
                </CardTitle>
                <Users className="h-4 w-4 text-cybergold-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cybergold-400">38</div>
                <p className="text-xs text-cybergold-600">+5 de siste 7 dager</p>
              </CardContent>
            </Card>
            
            <Card className="bg-cyberdark-900 border-cybergold-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cybergold-300">
                  Systembelastning
                </CardTitle>
                <Activity className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">Normal</div>
                <p className="text-xs text-cybergold-600">Alle systemer OK</p>
              </CardContent>
            </Card>
            
            <Card className="bg-cyberdark-900 border-cybergold-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cybergold-300">
                  Sikkerhetsstatus
                </CardTitle>
                <Lock className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">Sikret</div>
                <p className="text-xs text-cybergold-600">Siste oppdatering: i dag</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-cyberdark-900 border-cybergold-500/30">
              <CardHeader>
                <CardTitle className="text-cybergold-300">Aktive brukere (siste 24t)</CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-cybergold-500">Graf ville vises her</div>
              </CardContent>
            </Card>
            
            <Card className="bg-cyberdark-900 border-cybergold-500/30">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-cybergold-300">Systemhendelser</CardTitle>
                <Button variant="outline" size="sm" className="h-8 border-cybergold-500/30 text-cybergold-400">
                  Vis alle
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-start pb-2 border-b border-cyberdark-700">
                    <div>
                      <p className="text-sm font-medium text-cybergold-300">Systemoppdatering</p>
                      <p className="text-xs text-cybergold-600">Krypteringsnøkler rotert</p>
                    </div>
                    <span className="text-xs text-cybergold-600">07:42</span>
                  </div>
                  
                  <div className="flex justify-between items-start pb-2 border-b border-cyberdark-700">
                    <div>
                      <p className="text-sm font-medium text-cybergold-300">Ny bruker registrert</p>
                      <p className="text-xs text-cybergold-600">bruker@eksempel.no</p>
                    </div>
                    <span className="text-xs text-cybergold-600">08:15</span>
                  </div>
                  
                  <div className="flex justify-between items-start pb-2 border-b border-cyberdark-700">
                    <div>
                      <p className="text-sm font-medium text-cybergold-300">Gruppe opprettet</p>
                      <p className="text-xs text-cybergold-600">Prosjekt Falcon</p>
                    </div>
                    <span className="text-xs text-cybergold-600">09:32</span>
                  </div>
                  
                  <div className="flex justify-between items-start pb-2">
                    <div>
                      <p className="text-sm font-medium text-cybergold-300">Sikkerhetsadvarsel</p>
                      <p className="text-xs text-cybergold-600">Flere mislykkede påloggingsforsøk</p>
                    </div>
                    <span className="text-xs text-cybergold-600">10:20</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-cyberdark-800 text-cybergold-400 hover:bg-cyberdark-700">
                  Last inn flere
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Andre tabs ville ha innhold her */}
        <TabsContent value="users" className="space-y-4">
          <Card className="bg-cyberdark-900 border-cybergold-500/30">
            <CardHeader>
              <CardTitle className="text-cybergold-300">Administrer brukere</CardTitle>
              <CardDescription className="text-cybergold-500">
                Administrer brukerkontoer, tillatelser og tilgangsnivåer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-cybergold-500 py-12">
                Brukeradministrasjon ville vises her i en fullstendig implementering
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="groups" className="space-y-4">
          <Card className="bg-cyberdark-900 border-cybergold-500/30">
            <CardHeader>
              <CardTitle className="text-cybergold-300">Administrer grupper</CardTitle>
              <CardDescription className="text-cybergold-500">
                Administrer grupper, medlemskap og tillatelser
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-cybergold-500 py-12">
                Gruppeadministrasjon ville vises her i en fullstendig implementering
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card className="bg-cyberdark-900 border-cybergold-500/30">
            <CardHeader>
              <CardTitle className="text-cybergold-300">Sikkerhetsinnstillinger</CardTitle>
              <CardDescription className="text-cybergold-500">
                Administrer krypteringsnøkler, tofaktorautentisering og sikkerhetspolicyer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-cybergold-500 py-12">
                Sikkerhetsinnstillinger ville vises her i en fullstendig implementering
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4">
          <Card className="bg-cyberdark-900 border-cybergold-500/30">
            <CardHeader>
              <CardTitle className="text-cybergold-300">Systemlogger</CardTitle>
              <CardDescription className="text-cybergold-500">
                Vis og analyser systemlogger for feilsøking og overvåking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-cybergold-500 py-12">
                Systemlogger ville vises her i en fullstendig implementering
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;