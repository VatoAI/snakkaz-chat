import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { MatrixLoadingScreen } from './MatrixLoading';

interface StandardLoadingProps {
    type?: 'app' | 'auth' | 'chat' | 'inline';
    message?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

// 🚀 SNAKKAZ STANDARDIZED LOADING COMPONENTS
// Erstatter alle CSS conflicts med Tailwind-only animasjoner

// 🧿 DEFAULT MESSAGES FOR EACH TYPE
const getDefaultMessage = (type: 'app' | 'auth' | 'chat') => {
    switch (type) {
        case 'app': return 'Krypterer forbindelse...';
        case 'auth': return 'Autentiserer bruker...';
        case 'chat': return 'Laster inn SnakkaZ Chat...';
        default: return 'Laster...';
    }
};

export const StandardLoading: React.FC<StandardLoadingProps> = ({
    type = 'inline',
    message,
    className,
    size = 'md'
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-16 h-16'
    };

    const messageClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };

    // 🧿 ALLE LOADING TYPER BRUKER NÅ MATRIX PSYCHEDELIC DESIGN
    if (type === 'app' || type === 'auth' || type === 'chat') {
        return <MatrixLoadingScreen message={message || getDefaultMessage(type)} />;
    }

    // Inline loading (default)
    return (
        <div className={cn('flex items-center justify-center gap-2', className)}>
            <Loader2 className={cn('text-cyberblue-500 animate-spin', sizeClasses[size])} />
            {message && (
                <span className={cn('text-cyberblue-400 animate-pulse', messageClasses[size])}>
                    {message}
                </span>
            )}
        </div>
    );
};

// 🎯 TYPING DOTS - Standardized Tailwind version
export const TypingDots: React.FC<{ className?: string; color?: 'gold' | 'blue' | 'green' }> = ({
    className,
    color = 'gold'
}) => {
    const colorClasses = {
        gold: 'bg-cybergold-400',
        blue: 'bg-cyberblue-400',
        green: 'bg-green-400'
    };

    return (
        <div className={cn('flex gap-1 items-center', className)}>
            <div
                className={cn('w-2 h-2 rounded-full animate-bounce', colorClasses[color])}
                style={{ animationDelay: '0ms' }}
            />
            <div
                className={cn('w-2 h-2 rounded-full animate-bounce', colorClasses[color])}
                style={{ animationDelay: '150ms' }}
            />
            <div
                className={cn('w-2 h-2 rounded-full animate-bounce', colorClasses[color])}
                style={{ animationDelay: '300ms' }}
            />
        </div>
    );
};

export default StandardLoading;
