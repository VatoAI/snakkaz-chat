import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWholePageEncryption } from '@/hooks/useWholePageEncryption';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface AppEncryptionContextType {
    isEncryptionEnabled: boolean;
    toggleEncryption: () => void;
    encryptData: <T>(data: T) => Promise<string | null>;
    decryptData: <T>(encryptedData: string) => Promise<T | null>;
    encryptionStatus: 'idle' | 'encrypting' | 'decrypting' | 'error';
    encryptionError: Error | null;
}

export const AppEncryptionContext = createContext<AppEncryptionContextType>({
    isEncryptionEnabled: false,
    toggleEncryption: () => { },
    encryptData: async () => null,
    decryptData: async () => null,
    encryptionStatus: 'idle',
    encryptionError: null
});

interface AppEncryptionProviderProps {
    children: React.ReactNode;
}

export const AppEncryptionProvider: React.FC<AppEncryptionProviderProps> = ({ children }) => {
    const { user } = useAuth();
    const [isEncryptionEnabled, setIsEncryptionEnabled] = useLocalStorage('encryption-enabled', false);
    const [encryptionKey, setEncryptionKey] = useLocalStorage('encryption-key', '');
    const [encryptionStatus, setEncryptionStatus] = useState<'idle' | 'encrypting' | 'decrypting' | 'error'>('idle');
    const [encryptionError, setEncryptionError] = useState<Error | null>(null);

    const { encryptPage, decryptPage, error } = useWholePageEncryption({
        onError: (err) => {
            console.error('Encryption error:', err);
            setEncryptionError(err);
            setEncryptionStatus('error');
        }
    });

    // Generer eller last krypteringsnøkler når brukeren logger inn
    useEffect(() => {
        const setupEncryption = async () => {
            if (user && !encryptionKey) {
                // I en reell implementasjon ville dette generere eller hente brukerens krypteringsnøkkel
                const newKey = Array.from({ length: 32 }, () =>
                    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
                ).join('');
                setEncryptionKey(newKey);
            }
        };

        setupEncryption();
    }, [user, encryptionKey, setEncryptionKey]);

    // Funksjon for å veksle kryptering av/på
    const toggleEncryption = () => {
        setIsEncryptionEnabled(prev => !prev);
    };

    // Krypter data
    const encryptData = async <T,>(data: T): Promise<string | null> => {
        if (!encryptionKey) return null;

        setEncryptionStatus('encrypting');
        try {
            const result = await encryptPage(data, encryptionKey);
            setEncryptionStatus('idle');
            return result;
        } catch (err) {
            setEncryptionStatus('error');
            setEncryptionError(err instanceof Error ? err : new Error('Ukjent krypteringsfeil'));
            return null;
        }
    };

    // Dekrypter data
    const decryptData = async <T,>(encryptedData: string): Promise<T | null> => {
        if (!encryptionKey) return null;

        setEncryptionStatus('decrypting');
        try {
            const result = await decryptPage(encryptedData, encryptionKey);
            setEncryptionStatus('idle');
            return result as T;
        } catch (err) {
            setEncryptionStatus('error');
            setEncryptionError(err instanceof Error ? err : new Error('Ukjent dekrypteringsfeil'));
            return null;
        }
    };

    return (
        <AppEncryptionContext.Provider
            value={{
                isEncryptionEnabled,
                toggleEncryption,
                encryptData,
                decryptData,
                encryptionStatus,
                encryptionError
            }}
        >
            {children}
        </AppEncryptionContext.Provider>
    );
};

// Hook for enkel tilgang til krypteringskonteksten
export const useAppEncryption = () => useContext(AppEncryptionContext);