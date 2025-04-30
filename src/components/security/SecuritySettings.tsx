import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PasswordSettings } from './PasswordSettings';
import { ScreenProtection } from './ScreenProtection';
import { BiometricsSettings } from './BiometricsSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Fingerprint, KeyRound } from 'lucide-react';

/**
 * Sikkerhetsinnstillinger-komponent
 * Samler alle sikkerhetsrelaterte innstillinger på ett sted
 */
export const SecuritySettings: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Sikkerhetsinnstillinger</h1>
        <p className="text-muted-foreground mt-1">
          Administrer sikkerhetsinnstillinger for å beskytte kontoen og meldingene dine
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-2/3">
          <TabsTrigger value="general">Generelt</TabsTrigger>
          <TabsTrigger value="privacy">Personvern</TabsTrigger>
          <TabsTrigger value="password">Passord</TabsTrigger>
          <TabsTrigger value="biometrics">Biometri</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" /> Generell sikkerhet
              </CardTitle>
              <CardDescription>
                Grunnleggende sikkerhetsinnstillinger for Snakkaz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Generelle sikkerhetsinnstillinger kommer her */}
              <p>Generelle sikkerhetsinnstillinger er under utvikling.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <KeyRound className="mr-2 h-5 w-5" /> Kryptering
              </CardTitle>
              <CardDescription>
                Administrer krypteringsinnstillinger for meldinger
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Krypteringsinnstillinger kommer her */}
              <p>Krypteringsinnstillinger er under utvikling.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-4">
          <ScreenProtection />
        </TabsContent>
        
        <TabsContent value="password" className="space-y-4">
          <PasswordSettings />
        </TabsContent>
        
        <TabsContent value="biometrics" className="space-y-4">
          <BiometricsSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
