import React from 'react';
import { useTheme, themeUtils } from '../../context/ThemeProvider';

// Glassmorphic card component with performance optimization
interface GlassmorphicCardProps {
    variant?: 'light' | 'medium' | 'heavy';
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    hover?: boolean;
    neon?: boolean;
    neonColor?: 'cyan' | 'pink' | 'purple';
}

export const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
    variant = 'medium',
    children,
    className = '',
    style = {},
    onClick,
    hover = true,
    neon = false,
    neonColor = 'cyan'
}) => {
    const { tokens } = useTheme();

    const baseStyles = themeUtils.glass(variant);

    const neonStyles = neon ? {
        boxShadow: tokens.effects.neon.box[neonColor as keyof typeof tokens.effects.neon.box],
        border: `1px solid ${tokens.colors.primary[neonColor]}`,
    } : {};

    const hoverStyles = hover ? {
        cursor: onClick ? 'pointer' : 'default',
        transition: 'var(--transition-normal)',
    } : {};

    const combinedStyles = {
        ...baseStyles,
        ...neonStyles,
        ...hoverStyles,
        ...style,
        // Hardware acceleration for better performance
        transform: 'translateZ(0)',
        willChange: 'transform, backdrop-filter',
    };

    return (
        <div
            className={`glassmorphic-card ${className}`}
            style={combinedStyles}
            onClick={onClick}
            onMouseEnter={(e) => {
                if (hover) {
                    e.currentTarget.style.transform = 'translateY(-2px) translateZ(0)';
                    if (neon) {
                        e.currentTarget.style.boxShadow = `
              ${tokens.effects.neon.box[neonColor as keyof typeof tokens.effects.neon.box]},
              0 8px 32px rgba(0, 0, 0, 0.2)
            `;
                    }
                }
            }}
            onMouseLeave={(e) => {
                if (hover) {
                    e.currentTarget.style.transform = 'translateY(0) translateZ(0)';
                    if (neon) {
                        e.currentTarget.style.boxShadow = tokens.effects.neon.box[neonColor as keyof typeof tokens.effects.neon.box];
                    }
                }
            }}
        >
            {children}
        </div>
    );
};

// Neon text component
interface NeonTextProps {
    children: React.ReactNode;
    color?: 'cyan' | 'pink' | 'purple' | 'yellow';
    intensity?: 'light' | 'medium' | 'heavy';
    className?: string;
    style?: React.CSSProperties;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}export const NeonText: React.FC<NeonTextProps> = ({
    children,
    color = 'cyan',
    intensity = 'medium',
    className = '',
    style = {},
    as: Component = 'span'
}) => {
    const { tokens } = useTheme();

    const colorValue = tokens.colors.primary[color];
    const textShadow = themeUtils.neonText(colorValue, intensity);

    return (
        <Component
            className={`neon-text ${className}`}
            style={{
                color: colorValue,
                textShadow,
                fontFamily: 'var(--font-display)',
                fontWeight: tokens.typography.weights.bold,
                ...style,
            }}
        >
            {children}
        </Component>
    );
};

// Cyberpunk button component
interface CyberButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'base' | 'lg';
    color?: 'cyan' | 'pink' | 'purple' | 'yellow';
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    fullWidth?: boolean;
    neon?: boolean;
}

export const CyberButton: React.FC<CyberButtonProps> = ({
    children,
    variant = 'primary',
    size = 'base',
    color = 'cyan',
    disabled = false,
    loading = false,
    onClick,
    className = '',
    type = 'button',
    fullWidth = false,
    neon = false
}) => {
    const { tokens } = useTheme();

    const colorValue = tokens.colors.primary[color];

    const sizeStyles = {
        sm: {
            padding: `${tokens.spacing.sm} ${tokens.spacing.base}`,
            fontSize: tokens.typography.scale.sm,
            minHeight: '36px',
        },
        base: {
            padding: `${tokens.spacing.base} ${tokens.spacing.lg}`,
            fontSize: tokens.typography.scale.base,
            minHeight: '44px', // Touch-friendly
        },
        lg: {
            padding: `${tokens.spacing.lg} ${tokens.spacing.xl}`,
            fontSize: tokens.typography.scale.lg,
            minHeight: '52px',
        }
    };

    const variantStyles = {
        primary: {
            background: `linear-gradient(135deg, ${colorValue}, ${tokens.colors.primary.purple})`,
            color: tokens.colors.text.white,
            border: `2px solid ${colorValue}`,
        },
        secondary: {
            background: 'var(--bg-secondary)',
            color: colorValue,
            border: `2px solid ${colorValue}`,
        },
        outline: {
            background: 'transparent',
            color: colorValue,
            border: `2px solid ${colorValue}`,
        },
        ghost: {
            background: 'transparent',
            color: colorValue,
            border: '2px solid transparent',
        }
    };

    const baseStyles = {
        ...sizeStyles[size],
        ...variantStyles[variant],
        fontFamily: 'var(--font-display)',
        fontWeight: tokens.typography.weights.semibold,
        borderRadius: tokens.layout.radius.lg,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'var(--transition-normal)',
        position: 'relative' as const,
        overflow: 'hidden' as const,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: tokens.spacing.sm,
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.5 : 1,
        transform: 'translateZ(0)', // Hardware acceleration
    };

    const neonStyles = neon ? {
        boxShadow: tokens.effects.neon.box[color as keyof typeof tokens.effects.neon.box],
    } : {};

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`cyber-button ${className}`}
            style={{
                ...baseStyles,
                ...neonStyles,
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    if (variant === 'primary') {
                        e.currentTarget.style.background = colorValue;
                        e.currentTarget.style.color = tokens.colors.background.dark;
                    }
                    if (neon) {
                        e.currentTarget.style.boxShadow = `
              ${tokens.effects.neon.box[color as keyof typeof tokens.effects.neon.box]},
              0 0 40px ${colorValue},
              0 0 80px ${colorValue}
            `;
                    }
                    e.currentTarget.style.transform = 'translateY(-2px) translateZ(0)';
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled) {
                    if (variant === 'primary') {
                        e.currentTarget.style.background = `linear-gradient(135deg, ${colorValue}, ${tokens.colors.primary.purple})`;
                        e.currentTarget.style.color = tokens.colors.text.white;
                    }
                    if (neon) {
                        e.currentTarget.style.boxShadow = tokens.effects.neon.box[color as keyof typeof tokens.effects.neon.box];
                    }
                    e.currentTarget.style.transform = 'translateY(0) translateZ(0)';
                }
            }}
        >
            {loading && (
                <div
                    style={{
                        animation: 'spin 1s linear infinite',
                        filter: 'drop-shadow(0 0 4px currentColor)'
                    }}
                >
                    ⚡
                </div>
            )}
            {children}
        </button>
    );
};

// Liquid background component
export const LiquidBackground: React.FC<{ className?: string }> = ({
    className = ''
}) => {
    const { tokens } = useTheme();

    return (
        <div
            className={`liquid-background ${className}`}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: -1,
                background: `
          radial-gradient(circle at 20% 80%, ${themeUtils.withOpacity(tokens.colors.primary.cyan, 0.3)} 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, ${themeUtils.withOpacity(tokens.colors.primary.pink, 0.3)} 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, ${themeUtils.withOpacity(tokens.colors.primary.purple, 0.3)} 0%, transparent 50%),
          ${tokens.effects.gradients.dark}
        `,
                animation: 'liquidDream 20s ease-in-out infinite',
                willChange: 'transform',
            }}
        />
    );
};

// Performance-optimized loading spinner
export const CyberSpinner: React.FC<{
    size?: 'sm' | 'base' | 'lg';
    color?: 'cyan' | 'pink' | 'purple';
}> = ({
    size = 'base',
    color = 'cyan'
}) => {
        const { tokens } = useTheme();

        const sizes = {
            sm: '24px',
            base: '32px',
            lg: '48px'
        };

        return (
            <div
                style={{
                    width: sizes[size],
                    height: sizes[size],
                    border: `3px solid transparent`,
                    borderTop: `3px solid ${tokens.colors.primary[color]}`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    filter: `drop-shadow(0 0 10px ${tokens.colors.primary[color]})`,
                }}
            />
        );
    };
