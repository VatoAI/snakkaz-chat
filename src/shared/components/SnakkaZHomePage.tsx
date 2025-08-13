import React from 'react';

interface HomeSectionProps {
    id: string;
    title: string;
    description: string;
    icon: string;
    features: string[];
    highlight?: boolean;
}

const SnakkaZHomePage: React.FC = () => {
    const sections: HomeSectionProps[] = [
        {
            id: 'main',
            title: 'SnakkaZ - Norges Sikreste Chat',
            description: 'Revolusjonerende kommunikasjonsplattform bygget for det norske markedet',
            icon: '🇳🇴',
            features: [
                'End-to-End Kryptering (E2EE)',
                'WebRTC Sanntidskommunikasjon',
                'Norske servere - GDPR-kompatibel',
                'AI-assisterte funksjoner (MCP)',
                'Mobile-first design'
            ],
            highlight: true
        },
        {
            id: 'kontakt',
            title: 'Kontakt & Support',
            description: 'Vi er her for å hjelpe deg med SnakkaZ',
            icon: '📞',
            features: [
                'Email: support@snakkaz.com',
                'Telefon: +47 123 45 678',
                'Live chat: Tilgjengelig 24/7',
                'FAQ & Dokumentasjon',
                'Community Forum'
            ]
        },
        {
            id: 'info',
            title: 'Teknisk Informasjon',
            description: 'Avanserte funksjoner og spesifikasjoner',
            icon: '⚡',
            features: [
                'React + TypeScript Frontend',
                'Supabase Backend & Database',
                'Cloudflare Edge Network',
                'Progressive Web App (PWA)',
                'Offline Support'
            ]
        },
        {
            id: 'sikkerhet',
            title: 'Sikkerhet & Personvern',
            description: 'Din sikkerhet er vår høyeste prioritet',
            icon: '🛡️',
            features: [
                'AES-256 End-to-End Kryptering',
                'Zero-Knowledge Arkitektur',
                'Norsk personvernlovgivning',
                'Ingen datadeling med tredjeparter',
                'Automatisk sesjonssikkerhet'
            ]
        }
    ];

    return (
        <div style={{
            padding: '2rem',
            maxWidth: '1400px',
            margin: '0 auto',
            fontFamily: 'var(--font-body)'
        }}>
            {/* Hero Section */}
            <div style={{
                textAlign: 'center',
                marginBottom: '4rem'
            }}>
                <div style={{
                    fontSize: '6rem',
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    SNAKKAZ
                </div>
                <h1 style={{
                    color: 'white',
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    lineHeight: '1.2'
                }}>
                    🇳🇴 Norges Mest Avanserte Chat-Plattform
                </h1>
                <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '1.2rem',
                    maxWidth: '600px',
                    margin: '0 auto',
                    lineHeight: '1.6'
                }}>
                    Sikker, rask og norsk-bygget kommunikasjon for det moderne Norge.
                    Med E2E-kryptering, AI-superkrefter og mobile-first design.
                </p>
            </div>

            {/* Superpower Navigation Sections */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2rem',
                marginBottom: '3rem'
            }}>
                {sections.map((section) => (
                    <div
                        key={section.id}
                        style={{
                            background: section.highlight
                                ? 'linear-gradient(135deg, rgba(100, 181, 246, 0.15) 0%, rgba(77, 208, 225, 0.15) 100%)'
                                : 'var(--glass-bg)',
                            backdropFilter: 'var(--backdrop-blur)',
                            borderRadius: '20px',
                            border: section.highlight
                                ? '2px solid var(--snakkaz-primary)'
                                : '1px solid var(--glass-border)',
                            padding: '2rem',
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'all 0.4s ease',
                            minHeight: '300px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 20px 50px rgba(100, 181, 246, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        {/* Superpower Effect */}
                        {section.highlight && (
                            <div style={{
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                background: 'radial-gradient(circle, rgba(100, 181, 246, 0.1) 0%, transparent 70%)',
                                animation: 'pulse 4s ease-in-out infinite',
                                pointerEvents: 'none'
                            }} />
                        )}

                        {/* Section Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1.5rem',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <div style={{
                                fontSize: '3rem',
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'var(--glass-bg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid var(--glass-border)'
                            }}>
                                {section.icon}
                            </div>
                            <div>
                                <h2 style={{
                                    color: 'white',
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    marginBottom: '0.5rem',
                                    lineHeight: '1.2'
                                }}>
                                    {section.title}
                                </h2>
                                <p style={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: '0.95rem',
                                    margin: 0,
                                    lineHeight: '1.4'
                                }}>
                                    {section.description}
                                </p>
                            </div>
                        </div>

                        {/* Features List */}
                        <div style={{
                            position: 'relative',
                            zIndex: 1
                        }}>
                            {section.features.map((feature, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        marginBottom: '0.75rem',
                                        padding: '0.5rem',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}
                                >
                                    <div style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: section.highlight ? 'var(--snakkaz-primary)' : 'var(--snakkaz-secondary)',
                                        flexShrink: 0
                                    }} />
                                    <span style={{
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontSize: '0.9rem',
                                        lineHeight: '1.4'
                                    }}>
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Section Footer */}
                        <div style={{
                            position: 'absolute',
                            bottom: '1rem',
                            right: '1rem',
                            opacity: 0.6
                        }}>
                            <div style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                background: 'var(--snakkaz-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem'
                            }}>
                                →
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stats & Trust Indicators */}
            <div style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'var(--backdrop-blur)',
                borderRadius: '20px',
                border: '1px solid var(--glass-border)',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <h3 style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    🚀 Hvorfor Velge SnakkaZ?
                </h3>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2rem'
                }}>
                    {[
                        { number: '100%', label: 'Norsk Eierskap', icon: '🇳🇴' },
                        { number: 'E2EE', label: 'Kryptering Standard', icon: '🔒' },
                        { number: '<100ms', label: 'Svartid Europa', icon: '⚡' },
                        { number: '24/7', label: 'Support Tilgjengelig', icon: '🛟' },
                        { number: 'GDPR', label: 'Personvern Kompatibel', icon: '🛡️' },
                        { number: 'WebRTC', label: 'Sanntid Teknologi', icon: '📡' }
                    ].map((stat, index) => (
                        <div key={index} style={{
                            padding: '1.5rem',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                                {stat.icon}
                            </div>
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                color: 'var(--snakkaz-primary)',
                                marginBottom: '0.25rem'
                            }}>
                                {stat.number}
                            </div>
                            <div style={{
                                fontSize: '0.85rem',
                                color: 'rgba(255, 255, 255, 0.7)'
                            }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer CTA */}
            <div style={{
                textAlign: 'center',
                marginTop: '3rem',
                padding: '2rem',
                background: 'linear-gradient(135deg, rgba(100, 181, 246, 0.1) 0%, rgba(77, 208, 225, 0.1) 100%)',
                borderRadius: '20px',
                border: '1px solid var(--snakkaz-primary)'
            }}>
                <h3 style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    marginBottom: '1rem'
                }}>
                    Klar for å oppleve fremtiden av kommunikasjon?
                </h3>
                <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '2rem'
                }}>
                    Bli med på den sikre, norske kommunikasjonsrevolusjonen
                </p>
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        padding: '0.75rem 1.5rem',
                        background: 'var(--snakkaz-primary)',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: '600'
                    }}>
                        🚀 Allerede Live!
                    </div>
                    <div style={{
                        padding: '0.75rem 1.5rem',
                        border: '1px solid var(--snakkaz-primary)',
                        borderRadius: '12px',
                        color: 'var(--snakkaz-primary)',
                        fontWeight: '600'
                    }}>
                        📱 www.snakkaz.com
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SnakkaZHomePage;
