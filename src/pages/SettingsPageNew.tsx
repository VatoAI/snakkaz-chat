import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SnakkaZNavigation from '../components/navigation/SnakkaZNavigationFixed';
import {
    Settings as SettingsIcon,
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
    Phone,
    Users,
    Camera,
    Mic,
    ChevronRight,
    Clock
} from 'lucide-react';

const SettingsPageNew: React.FC = () => {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState<string>('general');

    // Settings state
    const [settings, setSettings] = useState({
        theme: 'dark',
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

    const settingsSections = [
        { id: 'general', label: 'Generelt', icon: SettingsIcon },
        { id: 'account', label: 'Konto', icon: Users },
        { id: 'notifications', label: 'Varsler', icon: Bell },
        { id: 'privacy', label: 'Personvern', icon: Eye },
        { id: 'security', label: 'Sikkerhet', icon: Shield },
        { id: 'chat', label: 'Chat', icon: MessageCircle },
        { id: 'media', label: 'Medier', icon: Camera },
        { id: 'storage', label: 'Lagring', icon: Download },
        { id: 'help', label: 'Hjelp', icon: HelpCircle }
    ];

    const toggleSetting = (category: string, key: string) => {
        setSettings(prev => {
            const categorySettings = prev[category as keyof typeof prev] as any;
            return {
                ...prev,
                [category]: {
                    ...categorySettings,
                    [key]: !categorySettings[key]
                }
            };
        });
    };

    const renderGeneralSettings = () => (
        <div className="space-y-6">
            <div className="bg-gray-700/30 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Språk og region
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-300">Språk</span>
                        <select
                            value={settings.language}
                            onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                            className="bg-gray-600 text-white rounded px-3 py-1 border border-gray-500"
                        >
                            <option value="no">Norsk</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-gray-700/30 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                    {settings.theme === 'dark' ? <Moon className="w-5 h-5 mr-2" /> : <Sun className="w-5 h-5 mr-2" />}
                    Utseende
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-300">Tema</span>
                        <select
                            value={settings.theme}
                            onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                            className="bg-gray-600 text-white rounded px-3 py-1 border border-gray-500"
                        >
                            <option value="dark">Mørk</option>
                            <option value="light">Lys</option>
                            <option value="auto">Automatisk</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderNotificationSettings = () => (
        <div className="space-y-6">
            <div className="bg-gray-700/30 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Varslingsinnstillinger
                </h3>
                <div className="space-y-4">
                    {[
                        { key: 'push', label: 'Push-varsler', icon: Smartphone },
                        { key: 'email', label: 'E-postvarsler', icon: Mail },
                        { key: 'sound', label: 'Lyd', icon: Volume2 },
                        { key: 'vibration', label: 'Vibrasjon', icon: Phone }
                    ].map(({ key, label, icon: Icon }) => (
                        <div key={key} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Icon className="w-4 h-4 mr-3 text-gray-400" />
                                <span className="text-gray-300">{label}</span>
                            </div>
                            <button
                                onClick={() => toggleSetting('notifications', key)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${(settings.notifications as any)[key] ? 'bg-blue-600' : 'bg-gray-600'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(settings.notifications as any)[key] ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderPrivacySettings = () => (
        <div className="space-y-6">
            <div className="bg-gray-700/30 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Personverninnstillinger
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-3 text-gray-400" />
                            <span className="text-gray-300">Lesekvitteringer</span>
                        </div>
                        <button
                            onClick={() => toggleSetting('privacy', 'readReceipts')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.privacy.readReceipts ? 'bg-blue-600' : 'bg-gray-600'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.privacy.readReceipts ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-3 text-gray-400" />
                            <span className="text-gray-300">Sist pålogget</span>
                        </div>
                        <button
                            onClick={() => toggleSetting('privacy', 'lastSeen')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.privacy.lastSeen ? 'bg-blue-600' : 'bg-gray-600'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.privacy.lastSeen ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSecuritySettings = () => (
        <div className="space-y-6">
            <div className="bg-gray-700/30 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Sikkerhetsinnstillinger
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Key className="w-4 h-4 mr-3 text-gray-400" />
                            <span className="text-gray-300">Tofaktor-autentisering</span>
                        </div>
                        <button
                            onClick={() => toggleSetting('security', 'twoFactor')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.security.twoFactor ? 'bg-blue-600' : 'bg-gray-600'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.security.twoFactor ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Smartphone className="w-4 h-4 mr-3 text-gray-400" />
                            <span className="text-gray-300">Biometrisk innlogging</span>
                        </div>
                        <button
                            onClick={() => toggleSetting('security', 'biometric')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.security.biometric ? 'bg-blue-600' : 'bg-gray-600'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.security.biometric ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                <div className="flex items-center mb-2">
                    <Shield className="w-5 h-5 mr-2 text-green-400" />
                    <h4 className="text-green-400 font-semibold">End-to-End Kryptering</h4>
                </div>
                <p className="text-green-300 text-sm">
                    Alle meldingene dine er beskyttet med end-to-end kryptering.
                    Kun du og mottakeren kan lese meldingene.
                </p>
            </div>
        </div>
    );

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'general': return renderGeneralSettings();
            case 'notifications': return renderNotificationSettings();
            case 'privacy': return renderPrivacySettings();
            case 'security': return renderSecuritySettings();
            default:
                return (
                    <div className="text-center py-8">
                        <SettingsIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">Innstilling kommer snart</h3>
                        <p className="text-gray-400">Denne innstillingsseksjonen er under utvikling.</p>
                    </div>
                );
        }
    };

    return (
        <div className="snakkaz-settings-page min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900">
            {/* Navigation */}
            <SnakkaZNavigation
                userName={user?.user_metadata?.username || "Erik Nordmann"}
                notificationCount={3}
            />

            {/* Main Settings Layout */}
            <div className="flex h-[calc(100vh-73px)]">
                {/* Left Sidebar - Settings Menu */}
                <div className="w-80 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/30">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-700/30">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">🇳🇴</span>
                                </div>
                                <div>
                                    <h1 className="text-white font-bold text-lg">SnakkaZ</h1>
                                    <p className="text-xs text-gray-400">Sikker • Norsk • Premium</p>
                                </div>
                            </div>
                            <Shield className="w-5 h-5 text-green-400" />
                        </div>

                        <h2 className="text-white font-semibold text-lg flex items-center">
                            <SettingsIcon className="w-5 h-5 mr-2" />
                            Innstillinger
                        </h2>
                    </div>

                    {/* Settings Menu */}
                    <div className="flex-1 overflow-y-auto">
                        {settingsSections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center justify-between p-4 hover:bg-gray-700/30 cursor-pointer border-b border-gray-700/20 transition-colors ${activeSection === section.id ? 'bg-gray-700/50 border-l-4 border-l-blue-500' : ''
                                    }`}
                            >
                                <div className="flex items-center">
                                    <section.icon className="w-5 h-5 mr-3 text-gray-400" />
                                    <span className={`font-medium ${activeSection === section.id ? 'text-white' : 'text-gray-300'}`}>
                                        {section.label}
                                    </span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                        ))}
                    </div>

                    {/* User Info */}
                    <div className="p-4 border-t border-gray-700/30">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                {(user?.user_metadata?.username || "Erik Nordmann").split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-white truncate">
                                    {user?.user_metadata?.username || "Erik Nordmann"}
                                </h3>
                                <p className="text-sm text-gray-400 truncate">
                                    {user?.email || "erik@snakkaz.no"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Settings Content */}
                <div className="flex-1 bg-gray-800/30 backdrop-blur-sm overflow-y-auto">
                    <div className="p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {settingsSections.find(s => s.id === activeSection)?.label || 'Innstillinger'}
                            </h2>
                            <p className="text-gray-400">
                                Tilpass SnakkaZ etter dine preferanser
                            </p>
                        </div>

                        {renderSectionContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPageNew;
