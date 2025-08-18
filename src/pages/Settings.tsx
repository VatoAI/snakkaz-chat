import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    messages: true,
    friends: true,
    groups: true,
    system: false
  });

  const settingsSections = [
    {
      title: 'Konto',
      icon: '👤',
      items: [
        { icon: '👤', title: 'Profilinformasjon', subtitle: 'Rediger navn, bio og kontaktinfo' },
        { icon: '🔒', title: 'Passord og sikkerhet', subtitle: 'Endre passord, to-faktor autentisering' },
        { icon: '👁️', title: 'Personvern', subtitle: 'Synlighet og personverninnstillinger' }
      ]
    },
    {
      title: 'Notifikasjoner',
      icon: '🔔',
      items: [
        { 
          icon: '📱', 
          title: 'Push-varsler', 
          subtitle: 'Desktop og mobilvarsler',
          toggle: true,
          value: notifications.messages,
          onChange: (value: boolean) => setNotifications({...notifications, messages: value})
        },
        { 
          icon: '🔊', 
          title: 'Lydvarsler', 
          subtitle: 'Lyder for nye meldinger',
          toggle: true,
          value: notifications.system,
          onChange: (value: boolean) => setNotifications({...notifications, system: value})
        }
      ]
    },
    {
      title: 'Utseende',
      icon: '🎨',
      items: [
        { 
          icon: darkMode ? '🌙' : '☀️', 
          title: 'Mørkt tema', 
          subtitle: 'Bytt mellom lyst og mørkt tema',
          toggle: true,
          value: darkMode,
          onChange: setDarkMode
        },
        { icon: '🌍', title: 'Språk', subtitle: 'Norsk (Standard)' }
      ]
    },
    {
      title: 'Sikkerhet',
      icon: '🛡️',
      items: [
        { icon: '🛡️', title: 'Aktivitetsoversikt', subtitle: 'Se påloggingshistorikk og enheter' },
        { icon: '🔐', title: 'Krypteringsinnstillinger', subtitle: 'E2E kryptering og sikkerhet' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-cyberdark-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Innstillinger</h1>
        <p className="text-cyberdark-300">Tilpass din SnakkaZ-opplevelse</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {settingsSections.map((section, sectionIndex) => (
          <div
            key={section.title}
            className="bg-cyberdark-800/50 border border-cyberdark-700 rounded-xl overflow-hidden"
          >
            {/* Section Header */}
            <div className="px-6 py-4 border-b border-cyberdark-700">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{section.icon}</span>
                <h2 className="text-lg font-semibold text-white">{section.title}</h2>
              </div>
            </div>

            {/* Section Items */}
            <div className="divide-y divide-cyberdark-700">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="px-6 py-4 hover:bg-cyberdark-800/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-cyberdark-700 rounded-lg">
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{item.title}</h3>
                        <p className="text-cyberdark-400 text-sm">{item.subtitle}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {item.toggle ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            item.onChange?.(!(item.value as boolean));
                          }}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            item.value 
                              ? 'bg-cybergold-600' 
                              : 'bg-cyberdark-600'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            item.value ? 'translate-x-7' : 'translate-x-1'
                          } mt-1`} />
                        </button>
                      ) : (
                        <span className="text-cyberdark-400">›</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-red-400 mb-4">Farlig sone</h2>
        <button
          onClick={() => {
            if (confirm('Er du sikker på at du vil logge ut?')) {
              console.log('Logging out...');
            }
          }}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
        >
          <span>🚪</span>
          <span>Logg ut</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;