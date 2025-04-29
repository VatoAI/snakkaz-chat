import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Theme = 'light' | 'dark' | 'cyberpunk';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    setTheme: () => { },
    toggleTheme: () => { },
});

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [storedTheme, setStoredTheme] = useLocalStorage<Theme>('snakkaz-theme', 'dark');
    const [theme, setThemeState] = useState<Theme>(storedTheme);

    // Sjekk for systempreferanser ved oppstart
    useEffect(() => {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (!storedTheme) {
            setThemeState(systemPrefersDark ? 'dark' : 'light');
        }
    }, [storedTheme]);

    // Oppdater dokumentklassen når temaet endres
    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark', 'cyberpunk');
        document.documentElement.classList.add(theme);
        setStoredTheme(theme);
    }, [theme, setStoredTheme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const toggleTheme = () => {
        setThemeState((prevTheme) => {
            if (prevTheme === 'dark') return 'light';
            if (prevTheme === 'light') return 'cyberpunk';
            return 'dark';
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);