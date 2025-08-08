import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import {
    IconUser,
    IconNotification,
    IconPalette,
    IconShield,
    IconSettings,
    IconDeviceFloppy,
    IconBell,
    IconMoon,
    IconSun,
    IconVolume2,
    IconVolume
} from '@tabler/icons-react';

interface SettingsData {
    displayName: string;
    bio: string;
    theme: 'dark' | 'light' | 'auto';
    notifications: {
        push: boolean;
        sound: boolean;
        email: boolean;
    };
    privacy: {
        showOnlineStatus: boolean;
        allowDirectMessages: boolean;
    };
    cyberpunkEffects: boolean;
}

const SettingsPanel: React.FC = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState<SettingsData>({
        displayName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
        bio: user?.user_metadata?.bio || '',
        theme: 'dark',
        notifications: {
            push: true,
            sound: true,
            email: false
        },
        privacy: {
            showOnlineStatus: true,
            allowDirectMessages: true
        },
        cyberpunkEffects: true
    });

    const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'appearance' | 'privacy'>('profile');
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (user) {
            setSettings(prev => ({
                ...prev,
                displayName: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
                bio: user.user_metadata?.bio || ''
            }));
        }
    }, [user]);

    const updateSetting = (path: string, value: any) => {
        setSettings(prev => {
            const keys = path.split('.');
            const newSettings = { ...prev };
            let current: any = newSettings;

            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
            return newSettings;
        });
        setHasChanges(true);
    };

    const saveSettings = async () => {
        // Here you would typically save to your backend
        console.log('Saving settings:', settings);
        setHasChanges(false);

        // Show success feedback
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = 'Innstillinger lagret!';
        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    };

    const tabs = [
        { id: 'profile', label: 'Profil', icon: IconUser },
        { id: 'notifications', label: 'Varsler', icon: IconBell },
        { id: 'appearance', label: 'Utseende', icon: IconPalette },
        { id: 'privacy', label: 'Personvern', icon: IconShield }
    ] as const;

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-4">
                    Innstillinger
                </h1>
                <p className="text-gray-300 text-lg">
                    Tilpass din SnakkaZ-opplevelse og personvern-innstillinger
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-1/4">
                    <div className="cyberpunk-card rounded-2xl p-6 sticky top-6">
                        <div className="space-y-2">
                            {tabs.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === id
                                            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-300'
                                            : 'hover:bg-white/5 text-gray-300 hover:text-white'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Save Button */}
                        {hasChanges && (
                            <div className="mt-6 pt-6 border-t border-gray-700">
                                <button
                                    onClick={saveSettings}
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-3 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium"
                                >
                                    <IconDeviceFloppy size={20} />
                                    Lagre endringer
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="cyberpunk-card rounded-2xl p-8">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <IconUser className="text-cyan-400" />
                                    Profil
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Visningsnavn
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.displayName}
                                        onChange={(e) => updateSetting('displayName', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                                        placeholder="Ditt visningsnavn"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        value={settings.bio}
                                        onChange={(e) => updateSetting('bio', e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                                        placeholder="Fortell litt om deg selv..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        E-post
                                    </label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="w-full px-4 py-3 bg-gray-800/30 border border-gray-700 rounded-xl text-gray-400 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">E-post kan ikke endres</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <IconBell className="text-cyan-400" />
                                    Varsler
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <IconNotification className="text-cyan-400" size={20} />
                                            <div>
                                                <p className="text-white font-medium">Push-varsler</p>
                                                <p className="text-gray-400 text-sm">Motta varsler når du får nye meldinger</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updateSetting('notifications.push', !settings.notifications.push)}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${settings.notifications.push ? 'bg-cyan-500' : 'bg-gray-600'
                                                }`}
                                        >
                                            <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${settings.notifications.push ? 'translate-x-6' : 'translate-x-0.5'
                                                }`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            {settings.notifications.sound ? <IconVolume className="text-cyan-400" size={20} /> : <IconVolume2 className="text-gray-400" size={20} />}
                                            <div>
                                                <p className="text-white font-medium">Lydvarsler</p>
                                                <p className="text-gray-400 text-sm">Spill lyd når du mottar meldinger</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updateSetting('notifications.sound', !settings.notifications.sound)}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${settings.notifications.sound ? 'bg-cyan-500' : 'bg-gray-600'
                                                }`}
                                        >
                                            <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${settings.notifications.sound ? 'translate-x-6' : 'translate-x-0.5'
                                                }`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <IconBell className="text-cyan-400" size={20} />
                                            <div>
                                                <p className="text-white font-medium">E-post varsler</p>
                                                <p className="text-gray-400 text-sm">Motta sammendrag på e-post</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updateSetting('notifications.email', !settings.notifications.email)}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${settings.notifications.email ? 'bg-cyan-500' : 'bg-gray-600'
                                                }`}
                                        >
                                            <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${settings.notifications.email ? 'translate-x-6' : 'translate-x-0.5'
                                                }`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <IconPalette className="text-cyan-400" />
                                    Utseende
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-4">
                                            Tema
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {(['dark', 'light', 'auto'] as const).map((theme) => (
                                                <button
                                                    key={theme}
                                                    onClick={() => updateSetting('theme', theme)}
                                                    className={`p-4 rounded-xl border-2 transition-all ${settings.theme === theme
                                                            ? 'border-cyan-400 bg-cyan-400/10'
                                                            : 'border-gray-600 hover:border-gray-500'
                                                        }`}
                                                >
                                                    <div className="flex flex-col items-center gap-2">
                                                        {theme === 'dark' && <IconMoon className="text-cyan-400" size={24} />}
                                                        {theme === 'light' && <IconSun className="text-yellow-400" size={24} />}
                                                        {theme === 'auto' && <IconSettings className="text-purple-400" size={24} />}
                                                        <span className="text-white font-medium capitalize">{theme === 'auto' ? 'Automatisk' : theme === 'dark' ? 'Mørk' : 'Lys'}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                                        <div>
                                            <p className="text-white font-medium">Cyberpunk-effekter</p>
                                            <p className="text-gray-400 text-sm">Matrix rain og andre visuelle effekter</p>
                                        </div>
                                        <button
                                            onClick={() => updateSetting('cyberpunkEffects', !settings.cyberpunkEffects)}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${settings.cyberpunkEffects ? 'bg-cyan-500' : 'bg-gray-600'
                                                }`}
                                        >
                                            <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${settings.cyberpunkEffects ? 'translate-x-6' : 'translate-x-0.5'
                                                }`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'privacy' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <IconShield className="text-cyan-400" />
                                    Personvern
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                                        <div>
                                            <p className="text-white font-medium">Vis online-status</p>
                                            <p className="text-gray-400 text-sm">La andre se når du er pålogget</p>
                                        </div>
                                        <button
                                            onClick={() => updateSetting('privacy.showOnlineStatus', !settings.privacy.showOnlineStatus)}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${settings.privacy.showOnlineStatus ? 'bg-cyan-500' : 'bg-gray-600'
                                                }`}
                                        >
                                            <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${settings.privacy.showOnlineStatus ? 'translate-x-6' : 'translate-x-0.5'
                                                }`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                                        <div>
                                            <p className="text-white font-medium">Tillat direktemeldinger</p>
                                            <p className="text-gray-400 text-sm">Motta meldinger fra andre brukere</p>
                                        </div>
                                        <button
                                            onClick={() => updateSetting('privacy.allowDirectMessages', !settings.privacy.allowDirectMessages)}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${settings.privacy.allowDirectMessages ? 'bg-cyan-500' : 'bg-gray-600'
                                                }`}
                                        >
                                            <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${settings.privacy.allowDirectMessages ? 'translate-x-6' : 'translate-x-0.5'
                                                }`} />
                                        </button>
                                    </div>

                                    <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                                        <h3 className="text-red-300 font-bold mb-2">Datasletting</h3>
                                        <p className="text-gray-300 text-sm mb-4">
                                            Permanent slett all din data og lukk kontoen. Denne handlingen kan ikke angres.
                                        </p>
                                        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                                            Slett konto
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
