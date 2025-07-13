import React from 'react';
import { SecuritySettingsPanel } from './SecuritySettingsPanel';
import { Shield } from 'lucide-react';

export const SecuritySettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6 flex items-center">
        <Shield className="h-6 w-6 text-cybergold-500 mr-2" />
        <h1 className="text-2xl font-bold text-cybergold-300">Sikkerhet og personvern</h1>
      </div>
      
      <div className="mb-4 pb-4 border-b border-cyberdark-700">
        <p className="text-sm text-cyberdark-300">
          Administrer sikkerhetsinnstillinger, kryptering og personvern for din Snakkaz-konto.
          Alle endringer vil automatisk synkroniseres på tvers av dine enheter.
        </p>
      </div>
      
      <SecuritySettingsPanel />
      
      <div className="mt-8 pt-4 border-t border-cyberdark-700">
        <h2 className="text-lg font-semibold text-cybergold-300 mb-2">Om sikkerhetsfunksjonene</h2>
        <div className="space-y-4 text-sm text-cyberdark-200">
          <p>
            <strong className="text-cybergold-400">Ende-til-ende-kryptering</strong>: 
            Alle meldinger er kryptert på din enhet og kan bare dekrypteres av mottakeren. 
            Ingen, ikke engang Snakkaz, kan lese innholdet i meldingene dine.
          </p>
          <p>
            <strong className="text-cybergold-400">Selvdestruerende meldinger</strong>: 
            Du kan sette meldinger til å slettes automatisk etter en viss tid for å beskytte 
            sensitive samtaler.
          </p>
          <p>
            <strong className="text-cybergold-400">Skjermdumpbeskyttelse</strong>: 
            Forhindrer at andre kan ta skjermdumper av dine samtaler for å beskytte 
            mot uautorisert deling av innhold.
          </p>
          <p>
            <strong className="text-cybergold-400">Identitetsverifisering</strong>: 
            Bekreft sikkert identiteten til dine kontakter ved å sammenligne sikkerhetsnøkler 
            eller bruke sikre QR-koder.
          </p>
        </div>
      </div>
    </div>
  );
};