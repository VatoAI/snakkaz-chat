import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Volume2,
  Lock,
  Eye,
  Smartphone
} from 'lucide-react';
import { useAuth } from '@/core/hooks/useAuth';
import './Settings.css';

const Settings: React.FC = () => {
  const { user, signOut } = useAuth();
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
      icon: User,
      items: [
        {
          icon: User,
          title: 'Profilinformasjon',
          subtitle: 'Rediger navn, bio og kontaktinfo',
          action: () => console.log('Navigate to profile'),
          path: '/app/profile'
        },
        {
          icon: Lock,
          title: 'Passord og sikkerhet',
          subtitle: 'Endre passord, to-faktor autentisering',
          action: () => console.log('Navigate to security')
        },
        {
          icon: Eye,
          title: 'Personvern',
          subtitle: 'Synlighet og personverninnstillinger',
          action: () => console.log('Navigate to privacy')
        }
      ]
    },
    {
      title: 'Notifikasjoner',
      icon: Bell,
      items: [
        {
          icon: Smartphone,
          title: 'Push-varsler',
          subtitle: 'Desktop og mobilvarsler',
          toggle: true,
          value: notifications.messages,
          onChange: (value: boolean) => setNotifications({...notifications, messages: value})
        },
        {
          icon: Volume2,
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
      icon: Palette,
      items: [
        {
          icon: darkMode ? Moon : Sun,
          title: 'Mørkt tema',
          subtitle: 'Bytt mellom lyst og mørkt tema',
          toggle: true,
          value: darkMode,
          onChange: setDarkMode
        },
        {
          icon: Globe,
          title: 'Språk',
          subtitle: 'Norsk (Standard)',
          action: () => console.log('Language settings')
        }
      ]
    },
    {
      title: 'Sikkerhet',
      icon: Shield,
      items: [
        {
          icon: Shield,
          title: 'Aktivitetsoversikt',
          subtitle: 'Se påloggingshistorikk og enheter',
          action: () => console.log('Activity overview')
        },
        {
          icon: Lock,
          title: 'Krypteringsinnstillinger',
          subtitle: 'E2E kryptering og sikkerhet',
          action: () => console.log('Encryption settings')
        }
      ]
    }
  ];

  return (
    <div className="settings-page min-h-screen bg-cyberdark-950 p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white mb-2">Innstillinger</h1>
        <p className="text-cyberdark-300">Tilpass din SnakkaZ-opplevelse</p>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {settingsSections.map((section, sectionIndex) => {
          const SectionIcon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-cyberdark-800/50 border border-cyberdark-700 rounded-xl overflow-hidden"
            >
              {/* Section Header */}
              <div className="px-6 py-4 border-b border-cyberdark-700">
                <div className="flex items-center space-x-3">
                  <SectionIcon size={20} className="text-cybergold-400" />
                  <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                </div>
              </div>

              {/* Section Items */}
              <div className="divide-y divide-cyberdark-700">
                {section.items.map((item, itemIndex) => {
                  const ItemIcon = item.icon;
                  return (
                    <div
                      key={itemIndex}
                      className="px-6 py-4 hover:bg-cyberdark-800/70 transition-colors cursor-pointer"
                      onClick={item.action}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-cyberdark-700 rounded-lg">
                            <ItemIcon size={18} className="text-cybergold-400" />
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
                            <ChevronRight size={16} className="text-cyberdark-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Danger Zone */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-red-500/10 border border-red-500/20 rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-red-400 mb-4">Farlig sone</h2>
        <button
          onClick={() => {
            if (confirm('Er du sikker på at du vil logge ut?')) {
              signOut();
            }
          }}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
        >
          <LogOut size={18} />
          <span>Logg ut</span>
        </button>
      </motion.div>
    </div>
  );
};

export default Settings;