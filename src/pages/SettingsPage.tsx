import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Moon,
  Sun,
  Globe,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Eye,
  EyeOff,
  Lock,
  Key,
  Download,
  Trash2,
  HelpCircle,
  MessageCircle,
  Mail,
  Phone
} from 'lucide-react';

interface SettingsData {
  theme: 'light' | 'dark' | 'auto';
  language: 'no' | 'en';
  notifications: {
    push: boolean;
    email: boolean;
    sound: boolean;
    vibration: boolean;
  };
  privacy: {
    readReceipts: boolean;
    lastSeen: boolean;
    profilePhoto: 'everyone' | 'contacts' | 'nobody';
    status: 'everyone' | 'contacts' | 'nobody';
  };
  security: {
    twoFactor: boolean;
    biometric: boolean;
    autoLock: number; // minutes
  };
  chat: {
    enterToSend: boolean;
    fontSize: 'small' | 'medium' | 'large';
    mediaAutoDownload: boolean;
  };
}

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>({
    theme: 'auto',
    language: 'no',
    notifications: {
      push: true,
      email: true,
      sound: true,
      vibration: true
    },
    privacy: {
      readReceipts: true,
      lastSeen: true,
      profilePhoto: 'contacts',
      status: 'contacts'
    },
    security: {
      twoFactor: true,
      biometric: false,
      autoLock: 30
    },
    chat: {
      enterToSend: true,
      fontSize: 'medium',
      mediaAutoDownload: true
    }
  });

  const updateSetting = (category: keyof SettingsData, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const toggleSetting = (category: keyof SettingsData, key: string) => {
    const currentValue = (settings[category] as any)[key];
    updateSetting(category, key, !currentValue);
  };

  return (
    <div className="settings-page glass-morphism-dark">
      <div className="settings-container">
        <div className="settings-header">
          <div className="snakkaz-logo">
            <MessageCircle className="logo-icon" size={32} />
            <h1>SnakkaZ Innstillinger</h1>
          </div>
          <p className="subtitle">Tilpass opplevelsen din</p>
        </div>

        {/* Utseende */}
        <div className="settings-section glass-morphism-light">
          <h2>
            <Sun size={20} />
            Utseende
          </h2>

          <div className="setting-item">
            <div className="setting-info">
              <strong>Tema</strong>
              <p>Velg mellom lys, mørkt eller automatisk tema</p>
            </div>
            <select
              className="setting-select"
              value={settings.theme}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                theme: e.target.value as 'light' | 'dark' | 'auto'
              }))}
            >
              <option value="auto">🌗 Automatisk</option>
              <option value="light">☀️ Lyst</option>
              <option value="dark">🌙 Mørkt</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <strong>Språk</strong>
              <p>Velg språk for applikasjonen</p>
            </div>
            <select
              className="setting-select"
              value={settings.language}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                language: e.target.value as 'no' | 'en'
              }))}
            >
              <option value="no">🇳🇴 Norsk</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>
        </div>

        {/* Varsler */}
        <div className="settings-section glass-morphism-light">
          <h2>
            <Bell size={20} />
            Varsler
          </h2>

          <div className="setting-item">
            <div className="setting-info">
              <strong>Push-varsler</strong>
              <p>Få varsler når du får nye meldinger</p>
            </div>
            <div className="toggle-container">
              <input
                type="checkbox"
                className="toggle-input"
                checked={settings.notifications.push}
                onChange={() => toggleSetting('notifications', 'push')}
              />
              <div className="toggle-switch"></div>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <strong>E-postvarsler</strong>
              <p>Få e-post når du har uleste meldinger</p>
            </div>
            <div className="toggle-container">
              <input
                type="checkbox"
                className="toggle-input"
                checked={settings.notifications.email}
                onChange={() => toggleSetting('notifications', 'email')}
              />
              <div className="toggle-switch"></div>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <strong>Lyder</strong>
              <p>Spill av lyd ved nye meldinger</p>
            </div>
            <div className="toggle-container">
              <input
                type="checkbox"
                className="toggle-input"
                checked={settings.notifications.sound}
                onChange={() => toggleSetting('notifications', 'sound')}
              />
              <div className="toggle-switch"></div>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <strong>Vibrasjon</strong>
              <p>Vibrer på mobil ved nye meldinger</p>
            </div>
            <div className="toggle-container">
              <input
                type="checkbox"
                className="toggle-input"
                checked={settings.notifications.vibration}
                onChange={() => toggleSetting('notifications', 'vibration')}
              />
              <div className="toggle-switch"></div>
            </div>
          </div>
        </div>

        {/* Personvern */}
        <div className="settings-section glass-morphism-light">
          <h2>
            <Shield size={20} />
            Personvern
          </h2>

          <div className="setting-item">
            <div className="setting-info">
              <strong>Lesekvittering</strong>
              <p>La andre se når du har lest meldingene deres</p>
            </div>
            <div className="toggle-container">
              <input
                type="checkbox"
                className="toggle-input"
                checked={settings.privacy.readReceipts}
                onChange={() => toggleSetting('privacy', 'readReceipts')}
              />
              <div className="toggle-switch"></div>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <strong>Sist sett</strong>
              <p>Vis når du sist var aktiv</p>
            </div>
            <div className="toggle-container">
              <input
                type="checkbox"
                className="toggle-input"
                checked={settings.privacy.lastSeen}
                onChange={() => toggleSetting('privacy', 'lastSeen')}
              />
              <div className="toggle-switch"></div>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <strong>Profilbilde</strong>
              <p>Hvem kan se profilbildet ditt</p>
            </div>
            <select
              className="setting-select"
              value={settings.privacy.profilePhoto}
              onChange={(e) => updateSetting('privacy', 'profilePhoto', e.target.value)}
            >
              <option value="everyone">Alle</option>
              <option value="contacts">Kun kontakter</option>
              <option value="nobody">Ingen</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <strong>Status</strong>
              <p>Hvem kan se statusmeldingen din</p>
            </div>
            <select
              className="setting-select"
              value={settings.privacy.status}
              onChange={(e) => updateSetting('privacy', 'status', e.target.value)}
            >
              <option value="everyone">Alle</option>
              <option value="contacts">Kun kontakter</option>
              <option value="nobody">Ingen</option>
            </select>
          </div>
        </div>

        {/* Sikkerhet */}
        <div className="settings-section glass-morphism-light">
          <h2>
            <Lock size={20} />
            Sikkerhet
          </h2>

          <div className="setting-item">
            <div className="setting-info">
              <strong>To-faktor autentisering</strong>
              <p>Ekstra sikkerhet med SMS eller app</p>
            </div>
            <div className="toggle-container">
              <input
                type="checkbox"
                className="toggle-input"
                checked={settings.security.twoFactor}
                onChange={() => toggleSetting('security', 'twoFactor')}
              />
              <div className="toggle-switch"></div>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <strong>Biometrisk låsing</strong>
              <p>Bruk fingeravtrykk eller Face ID</p>
            </div>
            <div className="toggle-container">
              <input
                type="checkbox"
                className="toggle-input"
                checked={settings.security.biometric}
                onChange={() => toggleSetting('security', 'biometric')}
              />
              <div className="toggle-switch"></div>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <strong>Auto-lås</strong>
              <p>Lås appen automatisk etter inaktivitet</p>
            </div>
            <select
              className="setting-select"
              value={settings.security.autoLock}
              onChange={(e) => updateSetting('security', 'autoLock', parseInt(e.target.value))}
            >
              <option value={5}>5 minutter</option>
              <option value={15}>15 minutter</option>
              <option value={30}>30 minutter</option>
              <option value={60}>1 time</option>
              <option value={0}>Aldri</option>
            </select>
          </div>
        </div>

        {/* Chat */}
        <div className="settings-section glass-morphism-light">
          <h2>
            <MessageCircle size={20} />
            Chat
          </h2>

          <div className="setting-item">
            <div className="setting-info">
              <strong>Enter for å sende</strong>
              <p>Send meldinger med Enter-tasten</p>
            </div>
            <div className="toggle-container">
              <input
                type="checkbox"
                className="toggle-input"
                checked={settings.chat.enterToSend}
                onChange={() => toggleSetting('chat', 'enterToSend')}
              />
              <div className="toggle-switch"></div>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <strong>Tekststørrelse</strong>
              <p>Juster størrelsen på tekst i chat</p>
            </div>
            <select
              className="setting-select"
              value={settings.chat.fontSize}
              onChange={(e) => updateSetting('chat', 'fontSize', e.target.value)}
            >
              <option value="small">Liten</option>
              <option value="medium">Medium</option>
              <option value="large">Stor</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <strong>Auto-nedlasting av media</strong>
              <p>Last ned bilder og videoer automatisk</p>
            </div>
            <div className="toggle-container">
              <input
                type="checkbox"
                className="toggle-input"
                checked={settings.chat.mediaAutoDownload}
                onChange={() => toggleSetting('chat', 'mediaAutoDownload')}
              />
              <div className="toggle-switch"></div>
            </div>
          </div>
        </div>

        {/* Støtte og informasjon */}
        <div className="settings-section glass-morphism-light">
          <h2>
            <HelpCircle size={20} />
            Støtte og informasjon
          </h2>

          <div className="support-items">
            <button className="support-item">
              <HelpCircle size={16} />
              <span>Hjelp og FAQ</span>
            </button>

            <button className="support-item">
              <Mail size={16} />
              <span>Kontakt støtte</span>
            </button>

            <button className="support-item">
              <Shield size={16} />
              <span>Personvernregler</span>
            </button>

            <button className="support-item">
              <Key size={16} />
              <span>Vilkår for bruk</span>
            </button>

            <button className="support-item">
              <Download size={16} />
              <span>Eksporter data</span>
            </button>
          </div>

          <div className="app-info">
            <p><strong>SnakkaZ versjon:</strong> 1.0.0</p>
            <p><strong>Sist oppdatert:</strong> Januar 2025</p>
            <p><strong>Kryptering:</strong> AES-256 E2EE</p>
          </div>
        </div>

        {/* Farlig område */}
        <div className="settings-section danger-section glass-morphism-light">
          <h2>
            <Trash2 size={20} />
            Farlig område
          </h2>

          <div className="danger-actions">
            <button className="danger-button">
              <Trash2 size={16} />
              Slett all chat-historikk
            </button>

            <button className="danger-button">
              <Trash2 size={16} />
              Deaktiver konto
            </button>

            <button className="danger-button">
              <Trash2 size={16} />
              Slett konto permanent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
