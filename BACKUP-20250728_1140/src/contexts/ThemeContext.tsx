import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Utvidet tema-type som inkluderer flere alternativer
type Theme = 'light' | 'dark' | 'system' | 'cyberpunk' | 'midnight';
type ColorAccent = 'blue' | 'gold' | 'green' | 'purple' | 'red';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: 'light' | 'dark' | 'cyberpunk' | 'midnight';
    colorAccent: ColorAccent;
    setColorAccent: (accent: ColorAccent) => void;
    isAnimationsEnabled: boolean;
    setAnimationsEnabled: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'system',
    setTheme: () => { },
    resolvedTheme: 'dark',
    colorAccent: 'gold',
    setColorAccent: () => { },
    isAnimationsEnabled: true,
    setAnimationsEnabled: () => { }
});

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [storedTheme, setStoredTheme] = useLocalStorage<Theme>('snakkaz-theme', 'system');
    const [storedAccent, setStoredAccent] = useLocalStorage<ColorAccent>('snakkaz-accent', 'gold');
    const [storedAnimations, setStoredAnimations] = useLocalStorage<boolean>('snakkaz-animations', true);
    
    const [theme, setThemeState] = useState<Theme>(storedTheme);
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark' | 'cyberpunk' | 'midnight'>('dark');
    const [colorAccent, setColorAccentState] = useState<ColorAccent>(storedAccent);
    const [isAnimationsEnabled, setAnimationsEnabledState] = useState<boolean>(storedAnimations);
    
    // Oppdaterer fargetemaet basert på endringer i tema eller aksent
    useEffect(() => {
        // Legger til en liten forsinkelse for eventuell animasjon
        document.documentElement.classList.add('theme-transition');
        
        // Oppdater tema
        const updateTheme = () => {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const systemTheme = mediaQuery.matches ? 'dark' : 'light';
            
            let finalTheme: 'light' | 'dark' | 'cyberpunk' | 'midnight';
            
            if (theme === 'system') {
                finalTheme = systemTheme as 'light' | 'dark';
            } else if (theme === 'cyberpunk' || theme === 'midnight') {
                finalTheme = theme;
            } else {
                finalTheme = theme as 'light' | 'dark';
            }
            
            setResolvedTheme(finalTheme);
            applyThemeToDOM(finalTheme, colorAccent);
        };
        
        // Forsinkelse for animasjonen
        const transitionTimeout = setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 500);
        
        updateTheme();
        
        // Cleanup
        return () => clearTimeout(transitionTimeout);
    }, [theme, colorAccent]);
    
    // Lytter etter endringer i systemets fargevalg
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const mqListener = (e: MediaQueryListEvent) => {
            if (theme === 'system') {
                const systemTheme = e.matches ? 'dark' : 'light';
                setResolvedTheme(systemTheme);
                applyThemeToDOM(systemTheme, colorAccent);
            }
        };
        
        mediaQuery.addEventListener('change', mqListener);
        return () => mediaQuery.removeEventListener('change', mqListener);
    }, [theme, colorAccent]);
    
    // Hjelpefunksjon for å sette tema på DOM-elementer
    const applyThemeToDOM = (theme: string, accent: ColorAccent) => {
        const root = document.documentElement;
        
        // Fjern alle tema-klasser
        root.classList.remove('light', 'dark', 'cyberpunk', 'midnight');
        
        // Fjern alle aksent-klasser
        root.classList.remove('accent-gold', 'accent-blue', 'accent-green', 'accent-purple', 'accent-red');
        
        // Legg til aktuell tema-klasse
        root.classList.add(theme);
        
        // Legg til aksent-klasse
        root.classList.add(`accent-${accent}`);
        
        // Håndter animasjoner
        if (isAnimationsEnabled) {
            root.classList.remove('reduced-motion');
        } else {
            root.classList.add('reduced-motion');
        }
        
        // Sett også meta-theme-color for browser UI
        let themeColor = '#121212'; // default dark
        
        switch (theme) {
            case 'light':
                themeColor = '#ffffff';
                break;
            case 'cyberpunk':
                themeColor = '#0f172a';
                break;
            case 'midnight':
                themeColor = '#080c14';
                break;
        }
        
        document
            .querySelector('meta[name="theme-color"]')
            ?.setAttribute('content', themeColor);
    };
    
    // Oppdater tema og lagre i localstorage
    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        setStoredTheme(newTheme);
    };
    
    // Oppdater fargeaksent og lagre i localstorage
    const setColorAccent = (newAccent: ColorAccent) => {
        setColorAccentState(newAccent);
        setStoredAccent(newAccent);
    };
    
    // Oppdater animasjonsinnstillinger og lagre i localstorage
    const setAnimationsEnabled = (enabled: boolean) => {
        setAnimationsEnabledState(enabled);
        setStoredAnimations(enabled);
    };

    return (
        <ThemeContext.Provider value={{ 
            theme, 
            setTheme, 
            resolvedTheme, 
            colorAccent, 
            setColorAccent,
            isAnimationsEnabled,
            setAnimationsEnabled
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);