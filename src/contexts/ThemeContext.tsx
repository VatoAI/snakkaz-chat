import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'system',
    setTheme: () => { },
    resolvedTheme: 'dark',
});

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [storedTheme, setStoredTheme] = useLocalStorage<Theme>('snakkaz-theme', 'system');
    const [theme, setThemeState] = useState<Theme>(storedTheme);
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

    // Lytter etter endringer i systemets fargevalg
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Funksjon for å oppdatere tema basert på nåværende innstillinger
        const updateTheme = () => {
            const systemTheme = mediaQuery.matches ? 'dark' : 'light';
            
            if (theme === 'system') {
                setResolvedTheme(systemTheme);
                applyThemeToDOM(systemTheme);
            } else {
                setResolvedTheme(theme);
                applyThemeToDOM(theme);
            }
        };
        
        // Legg til lytter for endringer i systemets fargevalg
        const mqListener = (e: MediaQueryListEvent) => {
            if (theme === 'system') {
                updateTheme();
            }
        };
        
        mediaQuery.addEventListener('change', mqListener);
        updateTheme();
        
        // Fjern lytter ved cleanup
        return () => mediaQuery.removeEventListener('change', mqListener);
    }, [theme]);
    
    // Hjelpefunksjon for å sette tema på DOM-elementer
    const applyThemeToDOM = (theme: string) => {
        const root = document.documentElement;
        
        // Fjern alle tema-klasser
        root.classList.remove('light', 'dark');
        
        // Legg til aktuell tema-klasse
        root.classList.add(theme);
        
        // Sett også meta-theme-color for browser UI
        document
            .querySelector('meta[name="theme-color"]')
            ?.setAttribute(
                'content',
                theme === 'dark' ? '#121212' : '#ffffff'
            );
    };
    
    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        setStoredTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);