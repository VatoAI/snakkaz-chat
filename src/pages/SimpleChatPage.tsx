import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import SimpleChat from '@/components/chat/SimpleChat';
import { UnifiedNavigation } from '@/components/navigation/UnifiedNavigation';
import { Card } from '@/components/ui/card';

const SimpleChatPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <UnifiedNavigation variant="horizontal" />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Snakkaz Chat</h1>
              <p className="text-muted-foreground">
                Gratis chat med mulighet for BTC/NOK veksling
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <SimpleChat />
              </div>
              
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">💰 BTC/NOK Veksling</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Snakkaz Chat gjør det enkelt å veksle Bitcoin til norske kroner
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <p>• Sikker peer-to-peer handel</p>
                    <p>• Konkurransedyktige kurser</p>
                    <p>• Norsk støtte</p>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">🚀 Oppgrader til Premium</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Få tilgang til avanserte funksjoner
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <p>• End-to-end kryptering</p>
                    <p>• Private grupper</p>
                    <p>• Avansert handel</p>
                    <p>• Prioritert støtte</p>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">🇳🇴 Hvorfor NOK?</h3>
                  <p className="text-sm text-muted-foreground">
                    Norske kroner har stabil verdi støttet av Norges økonomiske styrke og naturressurser.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SimpleChatPage;
