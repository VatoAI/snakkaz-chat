import React, { useState, useEffect, useRef } from 'react';
import {
    Zap,
    Brain,
    BarChart3,
    Sparkles,
    Palette,
    MessageCircle,
    Rocket,
    Eye
} from 'lucide-react';

// Matrix Rain Component
const MatrixRain: React.FC<{ intensity?: number; color?: string }> = ({
    intensity = 0.3,
    color = '#4dd0e1'
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Matrix characters including some sacred geometry symbols
        const chars = '01ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛋᛏᛒᛖᛗᛚᛜᛞᛟ∞◊△▲▼◆◇⬢⬡⬟⬠';
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops: number[] = new Array(columns).fill(0);

        const draw = () => {
            // Create trailing effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Set text properties
            ctx.fillStyle = color;
            ctx.font = `${fontSize}px monospace`;

            // Draw characters
            for (let i = 0; i < drops.length; i++) {
                if (Math.random() > intensity) continue;

                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(char, i * fontSize, drops[i] * fontSize);

                // Reset drop randomly
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 50);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [intensity, color]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0.4,
                pointerEvents: 'none',
                zIndex: 1
            }}
        />
    );
};

// Liquid Glass Orb Component
const LiquidGlassOrb: React.FC<{ size?: number; color?: string; animated?: boolean }> = ({
    size = 100,
    color = '#4dd0e1',
    animated = true
}) => {
    return (
        <div
            style={{
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                background: `
                    radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 50%),
                    radial-gradient(circle at 70% 70%, ${color}40 0%, transparent 70%),
                    linear-gradient(135deg, ${color}20 0%, ${color}60 100%)
                `,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${color}30`,
                boxShadow: `
                    0 8px 32px ${color}20,
                    inset 0 1px 0 rgba(255,255,255,0.3),
                    inset 0 -1px 0 rgba(0,0,0,0.1)
                `,
                position: 'absolute',
                animation: animated ? 'float 6s ease-in-out infinite' : 'none'
            }}
        />
    );
};

interface SuperpowerCardProps {
    icon: any;
    title: string;
    subtitle: string;
    description: string;
    color: string;
    deployed?: boolean;
    onDeploy: () => void;
}

const SuperpowerCard: React.FC<SuperpowerCardProps> = ({
    icon: Icon,
    title,
    subtitle,
    description,
    color,
    deployed = false,
    onDeploy
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const [showMatrix, setShowMatrix] = useState(false);

    const handleDeploy = async () => {
        setIsDeploying(true);
        setShowMatrix(true);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Longer Matrix effect
        onDeploy();
        setIsDeploying(false);
        setTimeout(() => setShowMatrix(false), 1000);
    };

    return (
        <div
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                background: `
                    linear-gradient(135deg, 
                        rgba(255,255,255,0.1) 0%, 
                        rgba(255,255,255,0.05) 50%, 
                        ${color}15 100%
                    )
                `,
                backdropFilter: 'blur(25px)',
                WebkitBackdropFilter: 'blur(25px)',
                border: `1px solid rgba(255,255,255,0.2)`,
                borderRadius: '24px',
                padding: '2rem',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered ? 'translateY(-12px) scale(1.03)' : 'translateY(0) scale(1)',
                boxShadow: isHovered
                    ? `
                        0 25px 50px ${color}25, 
                        0 15px 35px rgba(0,0,0,0.3),
                        inset 0 1px 0 rgba(255,255,255,0.3),
                        0 0 40px ${color}15
                    `
                    : `
                        0 10px 25px rgba(0,0,0,0.15),
                        inset 0 1px 0 rgba(255,255,255,0.2)
                    `,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Matrix Rain Background when deploying */}
            {(isDeploying || showMatrix) && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1,
                    borderRadius: '24px',
                    overflow: 'hidden'
                }}>
                    <MatrixRain intensity={0.4} color={color} />
                </div>
            )}

            {/* Enhanced Liquid Dream Background Animation */}
            <div
                style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    right: '-50%',
                    bottom: '-50%',
                    background: `
                        radial-gradient(circle at ${isHovered ? '60% 40%' : '30% 70%'}, ${color}25 0%, transparent 60%),
                        radial-gradient(circle at ${isHovered ? '20% 80%' : '70% 30%'}, rgba(255,255,255,0.1) 0%, transparent 50%),
                        conic-gradient(from ${isHovered ? '180deg' : '0deg'}, ${color}10, transparent, ${color}20, transparent)
                    `,
                    transition: 'all 3s ease',
                    zIndex: 0,
                    animation: 'liquidFlow 8s ease-in-out infinite'
                }}
            />

            {/* Floating Liquid Glass Orbs */}
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 0 }}>
                <LiquidGlassOrb size={30} color={color} />
            </div>
            <div style={{ position: 'absolute', bottom: '15px', left: '15px', zIndex: 0 }}>
                <LiquidGlassOrb size={20} color={color} />
            </div>

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 2 }}>
                {/* Enhanced Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div
                        style={{
                            background: `
                                linear-gradient(135deg, ${color} 0%, ${color}80 50%, rgba(255,255,255,0.3) 100%)
                            `,
                            borderRadius: '16px',
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: isHovered ? 'rotate(12deg) scale(1.15)' : 'rotate(0deg) scale(1)',
                            transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                            boxShadow: `
                                0 8px 20px ${color}30,
                                inset 0 1px 0 rgba(255,255,255,0.4),
                                inset 0 -1px 0 rgba(0,0,0,0.1)
                            `,
                            border: '1px solid rgba(255,255,255,0.3)'
                        }}
                    >
                        <Icon size={26} color="white" />
                    </div>
                    <div>
                        <h3 style={{
                            fontSize: '1.15rem',
                            fontWeight: '800',
                            background: `linear-gradient(135deg, ${color} 0%, rgba(255,255,255,0.9) 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '0.25rem',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            {title}
                        </h3>
                        <p style={{
                            fontSize: '0.85rem',
                            color: color,
                            fontWeight: '700',
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                        }}>
                            {subtitle}
                        </p>
                    </div>
                </div>

                {/* Enhanced Description */}
                <p style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                    {description}
                </p>

                {/* Enhanced Deploy Button */}
                <button
                    onClick={handleDeploy}
                    disabled={deployed || isDeploying}
                    style={{
                        width: '100%',
                        background: deployed
                            ? `linear-gradient(135deg, #10b981 0%, #059669 50%, rgba(255,255,255,0.2) 100%)`
                            : isDeploying
                                ? `linear-gradient(135deg, ${color}60 0%, ${color}80 50%, rgba(255,255,255,0.3) 100%)`
                                : `linear-gradient(135deg, ${color} 0%, ${color}C0 50%, rgba(255,255,255,0.2) 100%)`,
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '16px',
                        padding: '1rem 1.5rem',
                        fontSize: '0.95rem',
                        fontWeight: '700',
                        cursor: deployed ? 'default' : 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        boxShadow: deployed || isDeploying
                            ? `0 8px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)`
                            : `0 12px 25px ${color}30, inset 0 1px 0 rgba(255,255,255,0.4)`,
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)'
                    }}
                    className={!deployed && !isDeploying ? 'hover:scale-105' : ''}
                >
                    {deployed ? (
                        <>
                            <Sparkles size={18} />
                            DEPLOYED ✨
                        </>
                    ) : isDeploying ? (
                        <>
                            <div style={{
                                animation: 'spin 1s linear infinite',
                                filter: 'drop-shadow(0 0 4px currentColor)'
                            }}>⚡</div>
                            DEPLOYING MATRIX...
                        </>
                    ) : (
                        <>
                            <Rocket size={18} />
                            DEPLOY SUPERPOWER
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

const SuperpowerDashboard: React.FC = () => {
    const [deployedFeatures, setDeployedFeatures] = useState(new Set<string>());
    const [showPreview, setShowPreview] = useState(false);

    const features = [
        {
            id: 'liquid-messaging',
            icon: MessageCircle,
            title: '🌊 LIQUID MESSAGING',
            subtitle: 'Real-time Sync',
            description: 'Instant message sync across all devices med smooth liquid animations og real-time presence indicators.',
            color: '#4dd0e1'
        },
        {
            id: 'instant-reactions',
            icon: Zap,
            title: '⚡ INSTANT REACTIONS',
            subtitle: 'Emoji Burst',
            description: 'Interactive emoji reactions med beautiful burst animations og haptic feedback for mobile users.',
            color: '#f59e0b'
        },
        {
            id: 'smart-ai',
            icon: Brain,
            title: '🧠 SMART AI ASSIST',
            subtitle: 'Context Aware',
            description: 'AI-powered auto-translate, smart suggestions og context-aware responses for better communication.',
            color: '#6366f1'
        },
        {
            id: 'analytics',
            icon: BarChart3,
            title: '📊 ANALYTICS DASHBOARD',
            subtitle: 'Live Metrics',
            description: 'Real-time chat analytics, user engagement metrics og beautiful data visualizations.',
            color: '#10b981'
        },
        {
            id: 'magic-responses',
            icon: Sparkles,
            title: '🔮 MAGIC RESPONSES',
            subtitle: 'AI Powered',
            description: 'Smart auto-complete, mood detection og personalized response suggestions basert på context.',
            color: '#8b5cf6'
        },
        {
            id: 'theme-generator',
            icon: Palette,
            title: '🎨 THEME GENERATOR',
            subtitle: 'Custom Dreams',
            description: 'Personalized Liquid Dream themes med AI-generated color schemes og custom animations.',
            color: '#ec4899'
        }
    ];

    const handleDeploy = (featureId: string) => {
        setDeployedFeatures(prev => new Set([...prev, featureId]));
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, var(--snakkaz-dark) 0%, var(--snakkaz-surface) 100%)',
            position: 'relative',
            fontFamily: 'var(--font-body)'
        }}>
            {/* Matrix Rain Background */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none'
            }}>
                <MatrixRain intensity={0.1} color="#4dd0e1" />
            </div>

            {/* Liquid Dream Background */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `
                    radial-gradient(circle at 20% 50%, rgba(77, 208, 225, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(129, 199, 132, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)
                `,
                animation: 'liquidDream 20s ease-in-out infinite',
                zIndex: 1,
                pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 2, padding: '2rem' }}>
                {/* Hero Section */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 50%, #6366f1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '1rem',
                        letterSpacing: '-0.02em',
                        textShadow: '0 0 40px rgba(77, 208, 225, 0.3)'
                    }}>
                        SNAKKAZ LIQUID DREAM
                    </h1>
                    <h2 style={{
                        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        marginBottom: '1rem',
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}>
                        Gi chatten dine superkrefter! 🚀
                    </h2>
                    <p style={{
                        fontSize: '1.1rem',
                        color: 'var(--text-secondary)',
                        maxWidth: '600px',
                        margin: '0 auto 2rem auto',
                        lineHeight: '1.6'
                    }}>
                        Velg funksjonene du vil ha i chatten din. Hver "superpower" gir nye muligheter
                        for team-kommunikasjon med moderne AI og real-time teknologi.
                    </p>

                    {/* Stats Row */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '3rem',
                        flexWrap: 'wrap',
                        marginBottom: '2rem'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                fontSize: '2rem',
                                fontWeight: '900',
                                color: 'var(--snakkaz-primary)',
                                textShadow: '0 0 20px currentColor'
                            }}>
                                {deployedFeatures.size}
                            </div>
                            <div style={{
                                fontSize: '0.9rem',
                                color: 'var(--text-secondary)'
                            }}>
                                Superpowers Deployed
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                fontSize: '2rem',
                                fontWeight: '900',
                                color: 'var(--snakkaz-secondary)',
                                textShadow: '0 0 20px currentColor'
                            }}>
                                30s
                            </div>
                            <div style={{
                                fontSize: '0.9rem',
                                color: 'var(--text-secondary)'
                            }}>
                                Setup Time
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                fontSize: '2rem',
                                fontWeight: '900',
                                color: '#6366f1',
                                textShadow: '0 0 20px currentColor'
                            }}>
                                ∞
                            </div>
                            <div style={{
                                fontSize: '0.9rem',
                                color: 'var(--text-secondary)'
                            }}>
                                Possibilities
                            </div>
                        </div>
                    </div>

                    {/* Preview Button */}
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        style={{
                            background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.3)',
                            borderRadius: '16px',
                            padding: '1rem 2rem',
                            fontSize: '1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            margin: '0 auto',
                            boxShadow: '0 12px 25px rgba(77, 208, 225, 0.3), inset 0 1px 0 rgba(255,255,255,0.4)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)'
                        }}
                        className="hover:scale-105"
                    >
                        <Eye size={20} />
                        {showPreview ? 'Skjul Preview' : 'Vis Live Preview'}
                    </button>
                </div>

                {/* Features Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '2rem',
                    maxWidth: '1400px',
                    margin: '0 auto'
                }}>
                    {features.map((feature) => (
                        <SuperpowerCard
                            key={feature.id}
                            {...feature}
                            deployed={deployedFeatures.has(feature.id)}
                            onDeploy={() => handleDeploy(feature.id)}
                        />
                    ))}
                </div>

                {/* Live Preview Section */}
                {showPreview && (
                    <div style={{
                        marginTop: '4rem',
                        background: `
                            linear-gradient(135deg, 
                                rgba(255,255,255,0.1) 0%, 
                                rgba(255,255,255,0.05) 50%, 
                                rgba(77, 208, 225, 0.1) 100%
                            )
                        `,
                        backdropFilter: 'blur(25px)',
                        WebkitBackdropFilter: 'blur(25px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '24px',
                        padding: '2rem',
                        maxWidth: '1200px',
                        margin: '4rem auto 0',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)'
                    }}>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            marginBottom: '1rem',
                            textAlign: 'center',
                            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                        }}>
                            🌊 Live Chat Preview med Deployed Superpowers
                        </h3>
                        <div style={{
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '16px',
                            padding: '2rem',
                            fontSize: '0.9rem',
                            color: 'var(--text-secondary)',
                            textAlign: 'center',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            Interactive chat preview kommer her når features deployes...
                            <br />
                            <span style={{
                                color: 'var(--snakkaz-primary)',
                                fontWeight: '700',
                                textShadow: '0 0 10px currentColor'
                            }}>
                                {deployedFeatures.size > 0
                                    ? `${deployedFeatures.size} superpowers active! ⚡✨`
                                    : 'Deploy noen features for å se dem i aksjon! 🚀'
                                }
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperpowerDashboard;

// Add CSS animations using useEffect
if (typeof document !== 'undefined' && !document.querySelector('#snakkaz-animations')) {
    const style = document.createElement('style');
    style.id = 'snakkaz-animations';
    style.textContent = `
        @keyframes liquidFlow {
            0% { transform: rotate(0deg) scale(1); opacity: 0.6; }
            25% { transform: rotate(90deg) scale(1.1); opacity: 0.8; }
            50% { transform: rotate(180deg) scale(0.9); opacity: 0.7; }
            75% { transform: rotate(270deg) scale(1.05); opacity: 0.9; }
            100% { transform: rotate(360deg) scale(1); opacity: 0.6; }
        }
        
        @keyframes liquidDream {
            0% { transform: translate(0%, 0%) rotate(0deg); }
            33% { transform: translate(30%, -30%) rotate(120deg); }
            66% { transform: translate(-20%, 20%) rotate(240deg); }
            100% { transform: translate(0%, 0%) rotate(360deg); }
        }
        
        @keyframes matrixGlow {
            0% { filter: brightness(1) hue-rotate(0deg); }
            50% { filter: brightness(1.3) hue-rotate(180deg); }
            100% { filter: brightness(1) hue-rotate(360deg); }
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .hover\\:scale-105:hover {
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);
}
