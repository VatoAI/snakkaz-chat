import { useState, useEffect } from "react";
import { useAuth } from "../../authentication/AuthProvider";

// SVG Icon Components - Høy kvalitet!
const UserIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor" />
        <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor" />
    </svg>
);

const MailIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const PhoneIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

const SettingsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2" />
    </svg>
);

const CrownIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 20H19L16 8L12 12L8 8L5 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 8L8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 8L22 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 2V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const FlagIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="4" y1="22" x2="4" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const EditIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface UserProfileData {
    displayName: string;
    email: string;
    phone: string;
    bio: string;
    location: string;
    joinDate: Date;
    lastActive: Date;
    membershipType: 'free' | 'premium' | 'pro';
    verified: boolean;
    twoFactorEnabled: boolean;
}

const UserProfile: React.FC = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [profileData, setProfileData] = useState<UserProfileData>({
        displayName: 'Erik Andersen',
        email: user?.email || 'erik@snakkaz.no',
        phone: '+47 98 76 54 32',
        bio: 'Tech-entusiast fra Oslo. Elsker sikker kommunikasjon og norsk teknologi! 🇳🇴',
        location: 'Oslo, Norge',
        joinDate: new Date('2024-01-15'),
        lastActive: new Date(),
        membershipType: 'premium',
        verified: true,
        twoFactorEnabled: true
    });

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleSaveProfile = () => {
        // Lagre til Supabase her
        setIsEditing(false);
    };

    const getMembershipBadge = () => {
        const badges = {
            free: { text: 'Gratis', color: '#6b7280', icon: UserIcon },
            premium: { text: 'Premium', color: '#f59e0b', icon: CrownIcon },
            pro: { text: 'Pro', color: '#10b981', icon: CrownIcon }
        };
        return badges[profileData.membershipType];
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
                    Min Profil
                </h1>
                <p style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '1rem'
                }}>
                    Administrer dine kontoinnstillinger og preferanser
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr',
                gap: '2rem'
            }}>
                {/* Venstre Side - Profil Kort */}
                <div style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: 'var(--backdrop-blur)',
                    borderRadius: '20px',
                    border: '1px solid var(--glass-border)',
                    padding: '2rem',
                    textAlign: 'center',
                    height: 'fit-content'
                }}>
                    {/* Profilbilde */}
                    <div style={{
                        width: '120px',
                        height: '120px',
                        margin: '0 auto 1.5rem',
                        background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        fontWeight: '700',
                        color: 'white',
                        border: '4px solid var(--glass-border)',
                        position: 'relative'
                    }}>
                        {profileData.displayName.split(' ').map(n => n[0]).join('')}

                        {/* Verified Badge */}
                        {profileData.verified && (
                            <div style={{
                                position: 'absolute',
                                bottom: '5px',
                                right: '5px',
                                width: '28px',
                                height: '28px',
                                background: '#22c55e',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '3px solid var(--snakkaz-dark)',
                                color: 'white'
                            }}>
                                ✓
                            </div>
                        )}
                    </div>

                    {/* Navn og Status */}
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        marginBottom: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}>
                        {profileData.displayName}
                        <FlagIcon />
                    </h2>

                    {/* Membership Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: `${getMembershipBadge().color}20`,
                        border: `1px solid ${getMembershipBadge().color}40`,
                        borderRadius: '20px',
                        padding: '0.5rem 1rem',
                        marginBottom: '1rem',
                        color: getMembershipBadge().color,
                        fontSize: '0.9rem',
                        fontWeight: '600'
                    }}>
                        <CrownIcon />
                        {getMembershipBadge().text}
                    </div>

                    {/* Quick Stats */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            padding: '1rem',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                color: 'var(--snakkaz-primary)',
                                marginBottom: '0.25rem'
                            }}>
                                247
                            </div>
                            <div style={{
                                fontSize: '0.8rem',
                                color: 'rgba(255, 255, 255, 0.6)'
                            }}>
                                Meldinger
                            </div>
                        </div>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            padding: '1rem',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                color: 'var(--snakkaz-secondary)',
                                marginBottom: '0.25rem'
                            }}>
                                12
                            </div>
                            <div style={{
                                fontSize: '0.8rem',
                                color: 'rgba(255, 255, 255, 0.6)'
                            }}>
                                Grupper
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        color: '#22c55e',
                        fontSize: '0.9rem',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            background: '#22c55e',
                            borderRadius: '50%'
                        }} />
                        Online nå
                    </div>

                    {/* Rediger Knapp */}
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        style={{
                            width: '100%',
                            background: isEditing
                                ? 'rgba(239, 68, 68, 0.1)'
                                : 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                            border: isEditing ? '1px solid #ef4444' : 'none',
                            borderRadius: '12px',
                            padding: '0.75rem 1rem',
                            color: isEditing ? '#ef4444' : 'white',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <EditIcon />
                        {isEditing ? 'Avbryt redigering' : 'Rediger profil'}
                    </button>
                </div>

                {/* Høyre Side - Profilinnstillinger */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Personlig Informasjon */}
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
                            <UserIcon />
                            Personlig informasjon
                        </h3>

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {/* Navn */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    marginBottom: '0.5rem',
                                    color: 'rgba(255, 255, 255, 0.8)'
                                }}>
                                    Visningsnavn
                                </label>
                                <input
                                    type="text"
                                    value={profileData.displayName}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                                    disabled={!isEditing}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        background: isEditing ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontSize: '0.9rem',
                                        outline: 'none',
                                        cursor: isEditing ? 'text' : 'not-allowed'
                                    }}
                                />
                            </div>

                            {/* E-post */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    marginBottom: '0.5rem',
                                    color: 'rgba(255, 255, 255, 0.8)'
                                }}>
                                    E-post adresse
                                </label>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}>
                                    <MailIcon />
                                    <span style={{
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontSize: '0.9rem'
                                    }}>
                                        {profileData.email}
                                    </span>
                                    {profileData.verified && (
                                        <span style={{
                                            fontSize: '0.8rem',
                                            color: '#22c55e',
                                            background: 'rgba(34, 197, 94, 0.1)',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '6px',
                                            border: '1px solid rgba(34, 197, 94, 0.2)'
                                        }}>
                                            Verifisert
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Telefon */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    marginBottom: '0.5rem',
                                    color: 'rgba(255, 255, 255, 0.8)'
                                }}>
                                    Telefonnummer
                                </label>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}>
                                    <PhoneIcon />
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                                        disabled={!isEditing}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem 1rem',
                                            background: isEditing ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: '12px',
                                            color: 'white',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            cursor: isEditing ? 'text' : 'not-allowed'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    marginBottom: '0.5rem',
                                    color: 'rgba(255, 255, 255, 0.8)'
                                }}>
                                    Om meg
                                </label>
                                <textarea
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                                    disabled={!isEditing}
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        background: isEditing ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontSize: '0.9rem',
                                        outline: 'none',
                                        resize: 'vertical',
                                        cursor: isEditing ? 'text' : 'not-allowed'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Lagre Knapp */}
                        {isEditing && (
                            <button
                                onClick={handleSaveProfile}
                                style={{
                                    marginTop: '1.5rem',
                                    background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '0.75rem 2rem',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(100, 181, 246, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                Lagre endringer
                            </button>
                        )}
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
                            Sikkerhet og personvern
                        </h3>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {/* 2FA */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.02)',
                                borderRadius: '12px',
                                border: '1px solid var(--glass-border)'
                            }}>
                                <div>
                                    <div style={{
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        color: 'white',
                                        marginBottom: '0.25rem'
                                    }}>
                                        To-faktor autentisering
                                    </div>
                                    <div style={{
                                        fontSize: '0.8rem',
                                        color: 'rgba(255, 255, 255, 0.6)'
                                    }}>
                                        Ekstra sikkerhet for din konto
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0.5rem',
                                    borderRadius: '8px',
                                    background: profileData.twoFactorEnabled ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                    color: profileData.twoFactorEnabled ? '#22c55e' : '#ef4444',
                                    fontSize: '0.8rem',
                                    fontWeight: '600'
                                }}>
                                    {profileData.twoFactorEnabled ? 'Aktivert' : 'Deaktivert'}
                                </div>
                            </div>

                            {/* Notifikasjoner */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.02)',
                                borderRadius: '12px',
                                border: '1px solid var(--glass-border)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <BellIcon />
                                    <div>
                                        <div style={{
                                            fontSize: '0.9rem',
                                            fontWeight: '500',
                                            color: 'white',
                                            marginBottom: '0.25rem'
                                        }}>
                                            Push-notifikasjoner
                                        </div>
                                        <div style={{
                                            fontSize: '0.8rem',
                                            color: 'rgba(255, 255, 255, 0.6)'
                                        }}>
                                            Få varsler om nye meldinger
                                        </div>
                                    </div>
                                </div>
                                <button style={{
                                    background: 'var(--snakkaz-primary)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.5rem 1rem',
                                    color: 'white',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                }}>
                                    Konfigurer
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Konto informasjon */}
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
                            <SettingsIcon />
                            Kontoinformasjon
                        </h3>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                            gap: '1rem',
                            fontSize: '0.9rem'
                        }}>
                            <div>
                                <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Medlem siden:</span>
                                <div style={{ color: 'white', fontWeight: '500' }}>
                                    {profileData.joinDate.toLocaleDateString('no-NO', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                            <div>
                                <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Sist aktiv:</span>
                                <div style={{ color: 'white', fontWeight: '500' }}>
                                    {profileData.lastActive.toLocaleDateString('no-NO', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
