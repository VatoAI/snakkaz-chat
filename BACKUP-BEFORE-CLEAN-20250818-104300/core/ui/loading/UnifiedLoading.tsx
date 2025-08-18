import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { LoadingType, LOADING_STYLES } from './LoadingTypes';
import { MatrixLoadingScreen } from './MatrixLoading';

interface UnifiedLoadingProps {
    type?: LoadingType;
    message?: string;
    className?: string;
    progress?: number;
    showProgress?: boolean;
}

// 🚀 SNAKKAZ UNIFIED LOADING COMPONENT
// Erstatter ALLE andre loading implementasjoner
export const UnifiedLoading: React.FC<UnifiedLoadingProps> = ({
    type = 'inline',
    message,
    className,
    progress,
    showProgress = false
}) => {
    const config = LOADING_STYLES[type];

    // 🌟 MATRIX LOADING for full-screen og spesielle typer
    if (config.fullScreen || config.showMatrix) {
        return (
            <MatrixLoadingScreen
                message={message}
                progress={showProgress ? progress : undefined}
                fullScreen={config.fullScreen}
            />
        );
    }

    // 📦 INLINE LOADING for små elementer
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    };

    return (
        <div className={cn(
            'flex items-center justify-center gap-3',
            'text-cybercyan-400',
            className
        )}>
            <Loader2
                className={cn(
                    sizeClasses[config.size],
                    'animate-spin',
                    'text-cybercyan-400'
                )}
            />
            {message && (
                <span className={cn(
                    textSizeClasses[config.size],
                    'font-mono tracking-wide'
                )}>
                    {message}
                </span>
            )}
            {showProgress && progress !== undefined && (
                <div className="ml-2 text-cybercyan-300 text-xs font-mono">
                    {progress}%
                </div>
            )}
        </div>
    );
};

// 🎯 TYPING DOTS ANIMATION - Unified
export const TypingDots: React.FC<{
    className?: string;
    color?: 'gold' | 'blue' | 'green';
}> = ({ className, color = 'gold' }) => {
    const colorClasses = {
        gold: 'text-yellow-400',
        blue: 'text-cybercyan-400',
        green: 'text-emerald-400'
    };

    return (
        <div className={cn('flex gap-1 items-center', className)}>
            {[0, 1, 2].map((index) => (
                <div
                    key={index}
                    className={cn(
                        'w-2 h-2 rounded-full animate-pulse',
                        colorClasses[color]
                    )}
                    style={{
                        animationDelay: `${index * 0.2}s`,
                        animationDuration: '1s'
                    }}
                />
            ))}
        </div>
    );
};

// 💀 SKELETON LOADING for content placeholders
export const SkeletonLoader: React.FC<{
    lines?: number;
    className?: string;
    avatar?: boolean;
}> = ({ lines = 3, className, avatar = false }) => {
    return (
        <div className={cn('animate-pulse space-y-3', className)}>
            {avatar && (
                <div className="flex gap-3">
                    <div className="w-10 h-10 bg-cyberdark-700 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 bg-cyberdark-700 rounded w-1/4" />
                        <div className="h-2 bg-cyberdark-800 rounded w-1/6" />
                    </div>
                </div>
            )}

            {Array.from({ length: lines }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        'h-3 bg-cyberdark-700 rounded',
                        index === lines - 1 ? 'w-3/4' : 'w-full'
                    )}
                />
            ))}
        </div>
    );
};
