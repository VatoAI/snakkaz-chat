import React, { createContext, useContext, useEffect, useState } from 'react';

// Definerer tema typene
type Theme = 'light' | 'dark';

// Typen på konteksten som vi vil eksponere
type ThemeContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

// Oppretter konteksten med standardverdier
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook for å bruke tema-konteksten
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Props for ThemeProvider
interface ThemeProviderProps {
    children: React.ReactNode;
}

// Hovedkomponenten som gir tilgang til tema-konteksten i hele appen
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    // Lagrer tema i localStorage for å huske brukerens preferanse
    const [theme, setTheme] = useState<Theme>(() => {
        // Sjekk localStorage første gang komponenten laster
        const savedTheme = localStorage.getItem('snakkaz-theme');

        // Sjekk om brukeren har en systempreferanse for mørkt tema hvis ingen lagret preferanse finnes
        if (!savedTheme) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        return (savedTheme as Theme) || 'dark'; // Default til dark theme hvis ingenting er lagret
    });

    // Effekt for å legge til eller fjerne 'dark' klassen på HTML-elementet
    useEffect(() => {
        const root = window.document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Lagre tema-valget i localStorage
        localStorage.setItem('snakkaz-theme', theme);
    }, [theme]);

    // Funksjon for å bytte tema
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    // Verdier som vil være tilgjengelige gjennom konteksten
    const value = {
        theme,
        setTheme,
        toggleTheme,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};