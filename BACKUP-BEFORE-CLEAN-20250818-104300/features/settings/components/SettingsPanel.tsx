import { useState, useEffect } from "react";
import { useAuth } from "../../authentication/AuthProvider";

// SVG Icon Components - Høy kvalitet som UserProfile!
const SettingsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2" />
    </svg>
);

const ThemeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const LanguageIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M2 12h20" stroke="currentColor" strokeWidth="2" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2" />
    </svg>
);

const SoundIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ShieldIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const BellIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChatIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DatabaseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="2" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" stroke="currentColor" strokeWidth="2" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" stroke="currentColor" strokeWidth="2" />
    </svg>
);

const KeyIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DeviceIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
        <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" />
        <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" />
    </svg>
);

interface SettingsData {
    theme: 'dark' | 'light';
    language: 'no' | 'en';
    notifications: {
        chat: boolean;
        groups: boolean;
        marketplace: boolean;
        security: boolean;
    };
    privacy: {
        onlineStatus: boolean;
        readReceipts: boolean;
        lastSeen: boolean;
        profilePhoto: 'everyone' | 'contacts' | 'nobody';
    };
    chat: {
        autoDownload: boolean;
        enterToSend: boolean;
        soundEnabled: boolean;
        vibrationEnabled: boolean;
    };
    security: {
        twoFactor: boolean;
        sessionTimeout: number;
        biometrics: boolean;
    };
}

const SettingsPanel: React.FC = () => {
    const { user, signOut } = useAuth();
    const [isMobile, setIsMobile] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [settings, setSettings] = useState<SettingsData>({
        theme: 'dark',
        language: 'no',
        notifications: {
            chat: true,
            groups: true,
            marketplace: true,
            security: true
        },
        privacy: {
            onlineStatus: true,
            readReceipts: true,
            lastSeen: true,
            profilePhoto: 'contacts'
        },
        chat: {
            autoDownload: true,
            enterToSend: true,
            soundEnabled: true,
            vibrationEnabled: true
        },
        security: {
            twoFactor: true,
            sessionTimeout: 30,
            biometrics: false
        }
    });

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleSettingChange = (category: keyof SettingsData, key: string, value: any) => {
        setSettings(prev => {
            const categoryData = prev[category];
            if (typeof categoryData === 'object' && categoryData !== null) {
                return {
                    ...prev,
                    [category]: {
                        ...categoryData,
                        [key]: value
                    }
                };
            }
            return {
                ...prev,
                [category]: value
            };
        });
        setHasChanges(true);
    }; const handleSaveSettings = async () => {
        // Lagre til Supabase her
        console.log('Saving settings:', settings);
        setHasChanges(false);
    };

    return (
        <div style={{
            padding: isMobile ? '1rem' : '2rem',
            maxWidth: '1000px',
            margin: '0 auto',
            color: 'white'
        }}>
            {/* Header */}
            <div style={{
                marginBottom: '2rem',
                textAlign: 'center'
            }}>
                <h1 style={{
                    fontSize: isMobile ? '2rem' : '2.5rem',
                    fontWeight: '700',
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    Innstillinger
                </h1>
                <p style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '1rem'
                }}>
                    Tilpass SnakkaZ etter dine preferanser
                </p>
            </div>

            {/* Save Changes Banner */}
            {hasChanges && (
                <div style={{
                    background: 'rgba(100, 181, 246, 0.1)',
                    border: '1px solid var(--snakkaz-primary)',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{ color: 'var(--snakkaz-primary)' }}>
                        Du har ulagrede endringer
                    </span>
                    <button
                        onClick={handleSaveSettings}
                        style={{
                            background: 'var(--snakkaz-primary)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.5rem 1rem',
                            color: 'white',
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                        }}
                    >
                        Lagre endringer
                    </button>
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '2rem'
            }}>

                {/* Utseende og Tema */}
                <div style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: 'var(--backdrop-blur)',
                    borderRadius: '16px',
                    border: '1px solid var(--glass-border)',
                    padding: '2rem'
                }}>
                    <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: '600',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'white'
                    }}>
                        <ThemeIcon />
                        Utseende og Tema
                    </h3>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {/* Tema */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                marginBottom: '0.5rem',
                                color: 'rgba(255, 255, 255, 0.8)'
                            }}>
                                Fargetema
                            </label>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '0.5rem'
                            }}>
                                {['dark', 'light'].map((theme) => (
                                    <button
                                        key={theme}
                                        onClick={() => handleSettingChange('theme', 'theme', theme)}
                                        style={{
                                            padding: '0.75rem',
                                            background: settings.theme === theme ? 'var(--snakkaz-primary)' : 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: '8px',
                                            color: settings.theme === theme ? 'white' : 'rgba(255, 255, 255, 0.7)',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {theme === 'dark' ? '🌙 Mørk' : '☀️ Lys'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Språk */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                marginBottom: '0.5rem',
                                color: 'rgba(255, 255, 255, 0.8)'
                            }}>
                                <LanguageIcon /> Språk
                            </label>
                            <select
                                value={settings.language}
                                onChange={(e) => handleSettingChange('language', 'language', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <option value="no">🇳🇴 Norsk</option>
                                <option value="en">🇺🇸 English</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Chat Innstillinger */}
                <div style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: 'var(--backdrop-blur)',
                    borderRadius: '16px',
                    border: '1px solid var(--glass-border)',
                    padding: '2rem'
                }}>
                    <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: '600',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'white'
                    }}>
                        <ChatIcon />
                        Chat-innstillinger
                    </h3>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {[
                            { key: 'autoDownload', label: 'Automatisk nedlasting av media', desc: 'Last ned bilder og filer automatisk' },
                            { key: 'enterToSend', label: 'Enter for å sende', desc: 'Send meldinger med Enter-tasten' },
                            { key: 'soundEnabled', label: 'Lydnotifikasjoner', desc: 'Spill lyd ved nye meldinger' },
                            { key: 'vibrationEnabled', label: 'Vibrasjoner', desc: 'Vibrer ved nye meldinger (mobil)' }
                        ].map((item) => (
                            <div key={item.key} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.02)',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)'
                            }}>
                                <div>
                                    <div style={{
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        color: 'white',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {item.label}
                                    </div>
                                    <div style={{
                                        fontSize: '0.8rem',
                                        color: 'rgba(255, 255, 255, 0.6)'
                                    }}>
                                        {item.desc}
                                    </div>
                                </div>
                                <label style={{
                                    position: 'relative',
                                    display: 'inline-block',
                                    width: '50px',
                                    height: '24px'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={settings.chat[item.key as keyof typeof settings.chat]}
                                        onChange={(e) => handleSettingChange('chat', item.key, e.target.checked)}
                                        style={{
                                            opacity: 0,
                                            width: 0,
                                            height: 0
                                        }}
                                    />
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notifikasjoner */}
                <div style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: 'var(--backdrop-blur)',
                    borderRadius: '16px',
                    border: '1px solid var(--glass-border)',
                    padding: '2rem'
                }}>
                    <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: '600',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'white'
                    }}>
                        <BellIcon />
                        Notifikasjoner
                    </h3>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {[
                            { key: 'chat', label: 'Chat-meldinger', desc: 'Private meldinger og direktesamtaler' },
                            { key: 'groups', label: 'Gruppe-meldinger', desc: 'Meldinger i gruppechatter' },
                            { key: 'marketplace', label: 'Marketplace', desc: 'Handelsaktivitet og annonser' },
                            { key: 'security', label: 'Sikkerhetsvarsel', desc: 'Innlogginger og sikkerhetshendelser' }
                        ].map((item) => (
                            <div key={item.key} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.02)',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)'
                            }}>
                                <div>
                                    <div style={{
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        color: 'white',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {item.label}
                                    </div>
                                    <div style={{
                                        fontSize: '0.8rem',
                                        color: 'rgba(255, 255, 255, 0.6)'
                                    }}>
                                        {item.desc}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0.5rem',
                                    borderRadius: '8px',
                                    background: settings.notifications[item.key as keyof typeof settings.notifications] ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                    color: settings.notifications[item.key as keyof typeof settings.notifications] ? '#22c55e' : '#ef4444',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                                    onClick={() => handleSettingChange('notifications', item.key, !settings.notifications[item.key as keyof typeof settings.notifications])}
                                >
                                    {settings.notifications[item.key as keyof typeof settings.notifications] ? 'PÅ' : 'AV'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sikkerhet og Personvern */}
                <div style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: 'var(--backdrop-blur)',
                    borderRadius: '16px',
                    border: '1px solid var(--glass-border)',
                    padding: '2rem'
                }}>
                    <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: '600',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'white'
                    }}>
                        <ShieldIcon />
                        Sikkerhet og Personvern
                    </h3>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {/* 2FA */}
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '8px',
                            border: '1px solid var(--glass-border)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.5rem'
                            }}>
                                <div style={{
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    color: 'white'
                                }}>
                                    To-faktor autentisering
                                </div>
                                <button
                                    style={{
                                        background: settings.security.twoFactor ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '0.25rem 0.75rem',
                                        color: settings.security.twoFactor ? '#22c55e' : '#ef4444',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleSettingChange('security', 'twoFactor', !settings.security.twoFactor)}
                                >
                                    {settings.security.twoFactor ? 'Aktivert' : 'Deaktivert'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
