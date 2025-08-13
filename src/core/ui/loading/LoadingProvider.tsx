import React, { createContext, useContext, useState, useCallback } from 'react';
import { LoadingState, LoadingConfig, LoadingType, LOADING_MESSAGES, LOADING_STYLES } from './LoadingTypes';

interface LoadingContextType {
    currentLoading: LoadingState | null;
    showLoading: (config: LoadingConfig) => void;
    hideLoading: () => void;
    isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};

interface LoadingProviderProps {
    children: React.ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
    const [currentLoading, setCurrentLoading] = useState<LoadingState | null>(null);

    const showLoading = useCallback((config: LoadingConfig) => {
        const message = config.message || LOADING_MESSAGES[config.type];
        const style = LOADING_STYLES[config.type];

        const loadingState: LoadingState = {
            type: config.type,
            message,
            progress: 0,
            isVisible: true,
            duration: config.duration || style.duration
        };

        setCurrentLoading(loadingState);

        // Auto hide if duration is set
        if (loadingState.duration && loadingState.duration > 0) {
            setTimeout(() => {
                hideLoading();
            }, loadingState.duration);
        }
    }, []);

    const hideLoading = useCallback(() => {
        setCurrentLoading(null);
    }, []);

    const isLoading = currentLoading?.isVisible || false;

    return (
        <LoadingContext.Provider
            value={{
                currentLoading,
                showLoading,
                hideLoading,
                isLoading
            }}
        >
            {children}
        </LoadingContext.Provider>
    );
};
