// Admin/Security Access Route - Hidden from public
// Only accessible by direct URL for authorized personnel

import React, { useState } from 'react';
import { SecurityMonitoringSystem } from '../../security/PoliceCooperationSystem';

const AdminSecurityPanel: React.FC = () => {
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  // Simple access control - you can modify this
  const handleAccess = () => {
    if (accessCode === 'SNAKKAZ_ADMIN_2025') {
      setAccessGranted(true);
    } else {
      alert('Ugyldig tilgangskode');
    }
  };

  if (!accessGranted) {
    return (
      <div className="min-h-screen bg-cyberdark-950 flex items-center justify-center">
        <div className="bg-cyberdark-900 p-8 rounded-lg border border-red-500/20">
          <h2 className="text-xl font-bold text-red-400 mb-4">Begrenset tilgang</h2>
          <input
            type="password"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Tilgangskode"
            className="w-full p-2 mb-4 bg-cyberdark-800 border border-red-500/30 rounded text-red-300"
          />
          <button
            onClick={handleAccess}
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            Få tilgang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyberdark-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-red-400 mb-6">
          🔒 Sikkerhetssystem - Skjult Panel
        </h1>
        
        <div className="grid gap-6">
          <div className="bg-cyberdark-900 p-6 rounded-lg border border-red-500/20">
            <h3 className="text-lg font-semibold text-red-300 mb-4">
              Sikkerhetssystemer Tilgjengelig
            </h3>
            <ul className="space-y-2 text-red-200">
              <li>• SecurityMonitoringSystem - Sporing av mistenkelig aktivitet</li>
              <li>• Politirapportering kun ved alvorlige forbrytelser</li>
              <li>• Automatisk logging av sikkerhetsrelaterte hendelser</li>
              <li>• Trust-system integrering</li>
            </ul>
          </div>

          <div className="bg-cyberdark-900 p-6 rounded-lg border border-amber-500/20">
            <h3 className="text-lg font-semibold text-amber-300 mb-4">
              ⚠️ Viktig Informasjon
            </h3>
            <div className="text-amber-200 space-y-2">
              <p>• Dette systemet er skjult fra offentlige brukere</p>
              <p>• Kun tilgjengelig via direkte URL: /admin/security</p>
              <p>• Systemet samler IKKE persondata fra vanlige brukere</p>
              <p>• Aktiveres kun ved mistanke om alvorlige forbrytelser</p>
            </div>
          </div>

          <div className="bg-cyberdark-900 p-6 rounded-lg border border-green-500/20">
            <h3 className="text-lg font-semibold text-green-300 mb-4">
              ✅ STEG 3 - UX Forbedringer
            </h3>
            <div className="text-green-200 space-y-2">
              <p>• Fjernet synlig referanse til politisamarbeid fra brukergrensesnitt</p>
              <p>• Systemet fortsatt tilgjengelig for autorisert personell</p>
              <p>• Appen fremstår nå som mer inkluderende og brukervennlig</p>
              <p>• Sikkerhetsfunksjonalitet bevart i bakgrunnen</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSecurityPanel;
