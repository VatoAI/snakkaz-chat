import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { CYBERPUNK_DESIGN_TOKENS } from '../styles/tokens';

// Theme variants
export type ThemeVariant = 'cyberpunk' | 'liquid-dream' | 'dark' | 'light';

// Theme context interface
interface ThemeContextType {
    theme: ThemeVariant;
    tokens: typeof CYBERPUNK_DESIGN_TOKENS;
    toggleTheme: () => void;
    setTheme: (theme: ThemeVariant) => void;
    isDark: boolean;
    isGlassEnabled: boolean;
    toggleGlass: () => void;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider props
interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: ThemeVariant;
    enableGlass?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    defaultTheme = 'cyberpunk',
    enableGlass = true
}) => {
    const [theme, setTheme] = useState<ThemeVariant>(defaultTheme);
    const [isGlassEnabled, setIsGlassEnabled] = useState(enableGlass);

    // Load saved preferences
    useEffect(() => {
        const savedTheme = localStorage.getItem('snakkaz-theme') as ThemeVariant;
        const savedGlass = localStorage.getItem('snakkaz-glass') === 'true';

        if (savedTheme) setTheme(savedTheme);
        if (savedGlass !== null) setIsGlassEnabled(savedGlass);
    }, []);

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement;

        // Set theme attribute
        root.setAttribute('data-theme', theme);

        // Apply CSS custom properties
        const tokens = CYBERPUNK_DESIGN_TOKENS;

        // Background colors
        root.style.setProperty('--bg-primary', tokens.colors.background.dark);
        root.style.setProperty('--bg-secondary', tokens.colors.background.secondary);
        root.style.setProperty('--bg-elevated', tokens.colors.background.elevated);
        root.style.setProperty('--bg-tertiary', tokens.colors.background.tertiary);
        root.style.setProperty('--bg-glass', tokens.colors.background.glass);

        // Text colors
        root.style.setProperty('--text-primary', tokens.colors.text.primary);
        root.style.setProperty('--text-secondary', tokens.colors.text.secondary);
        root.style.setProperty('--text-tertiary', tokens.colors.text.tertiary);
        root.style.setProperty('--text-white', tokens.colors.text.white);

        // Primary colors
        root.style.setProperty('--color-cyan', tokens.colors.primary.cyan);
        root.style.setProperty('--color-pink', tokens.colors.primary.pink);
        root.style.setProperty('--color-purple', tokens.colors.primary.purple);
        root.style.setProperty('--color-yellow', tokens.colors.primary.yellow);

        // Interactive states
        root.style.setProperty('--interactive-hover', tokens.colors.interactive.hover);
        root.style.setProperty('--interactive-active', tokens.colors.interactive.active);
        root.style.setProperty('--interactive-focus', tokens.colors.interactive.focus);

        // Typography
        root.style.setProperty('--font-primary', tokens.typography.fonts.primary);
        root.style.setProperty('--font-display', tokens.typography.fonts.display);
        root.style.setProperty('--font-mono', tokens.typography.fonts.mono);

        // Glassmorphism
        if (isGlassEnabled) {
            root.style.setProperty('--glass-backdrop', 'blur(16px) saturate(150%)');
            root.style.setProperty('--glass-bg', tokens.effects.glass.medium.backgroundColor);
            root.style.setProperty('--glass-border', tokens.effects.glass.medium.border);
        } else {
            root.style.setProperty('--glass-backdrop', 'none');
            root.style.setProperty('--glass-bg', tokens.colors.background.secondary);
            root.style.setProperty('--glass-border', '1px solid rgba(255, 255, 255, 0.1)');
        }

        // Animation properties
        root.style.setProperty('--transition-normal', `${tokens.animation.duration.normal} ${tokens.animation.easing.cyberpunk}`);
        root.style.setProperty('--transition-fast', `${tokens.animation.duration.fast} ${tokens.animation.easing.liquid}`);

        // Save to localStorage
        localStorage.setItem('snakkaz-theme', theme);
        localStorage.setItem('snakkaz-glass', isGlassEnabled.toString());
    }, [theme, isGlassEnabled]);

    const toggleTheme = () => {
        const themeOrder: ThemeVariant[] = ['cyberpunk', 'liquid-dream', 'dark', 'light'];
        const currentIndex = themeOrder.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themeOrder.length;
        setTheme(themeOrder[nextIndex]);
    };

    const toggleGlass = () => {
        setIsGlassEnabled(!isGlassEnabled);
    };

    const isDark = theme === 'cyberpunk' || theme === 'liquid-dream' || theme === 'dark';

    const contextValue: ThemeContextType = {
        theme,
        tokens: CYBERPUNK_DESIGN_TOKENS,
        toggleTheme,
        setTheme,
        isDark,
        isGlassEnabled,
        toggleGlass,
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            <div
                data-theme={theme}
                data-glass={isGlassEnabled}
                className="app-container"
                style={{
                    minHeight: '100vh',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-primary)',
                    transition: 'var(--transition-normal)',
                }}
            >
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

// Custom hook for using theme context
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Theme utilities
export const themeUtils = {
    // Get color with opacity
    withOpacity: (color: string, opacity: number) => {
        if (color.startsWith('#')) {
            const hex = color.slice(1);
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return color;
    },

    // Generate neon text shadow
    neonText: (color: string, intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
        const intensities = {
            light: [7, 10, 21],
            medium: [7, 10, 21, 42],
            heavy: [7, 10, 21, 42, 82, 92, 102, 151]
        };

        return intensities[intensity]
            .map(blur => `0 0 ${blur}px ${color}`)
            .join(', ') + `, 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff`;
    },

    // Generate glassmorphism styles
    glass: (variant: 'light' | 'medium' | 'heavy' = 'medium') => {
        const effects = CYBERPUNK_DESIGN_TOKENS.effects.glass[variant];
        return {
            backdropFilter: effects.backdropFilter,
            backgroundColor: effects.backgroundColor,
            border: effects.border,
            borderRadius: '12px',
            position: 'relative' as const,
            overflow: 'hidden' as const,
        };
    }
};
